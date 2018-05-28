import { Component } from 'react'
import Head from './head'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import RequestView from './request-view'
import RequestList from './request-list'
import Router from 'next/router'
import ObjectID from 'bson-objectid'
import classNames from 'classnames';

class App extends Component {
  constructor() {
    super()
    this.state = {
      loading: undefined
    }
  }

  handleChange = ({requestId}) => {
    Router.push({ pathname: '/', query: { id: requestId } },
                `/requests/${requestId}`,
                { shallow: true })
  }

  get request() {
    return (this.props.data && this.props.data.request) || {}
  }

  handleSubmit = ({code, functionId}) => {
    const variables = {
      id: ObjectID().toString(),
      input: code,
      functionId
    }
    this.setState({loading: variables.id})
    this.handleChange({requestId: variables.id})
    this.props.createRequest({
      variables
    })
  }

  handleMenuClick = () => {
    this.setState({menuOpen: true});
  }

  handleBackdropClick = () => {
    this.setState({menuOpen: false});
  }

  render() {
    return (
      <div className="app">
        <Head loggedIn={true} />
        <div className={classNames("sidePane", {open: this.state.menuOpen})}>
          <RequestList 
            requests={this.props.requests} 
            request={this.request} 
            onChange={this.handleChange} 
          />
        </div>
        <div
          className={classNames("backdrop", {open: this.state.menuOpen})}
          onClick={this.handleBackdropClick}
        >
        </div>
        <div className="mainPane">
          <div className="innerMainPane">
            <RequestView
              onMenuClick={this.handleMenuClick}
              functions={this.props.functions}
              request={this.request}
              loading={this.state.loading}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
            />
          </div>
        </div>
        <style jsx>{`
          .app {
            display: flex;
          }
          .sidePane {
            background-color: rgb(38, 50, 56);
            border-right: 2px solid #000;
            overflow-y: scroll;
            padding: 5px;
            color: #ddd;
          }
          @media (min-width: 600px) {
            .sidePane {
              width: 30%;
              max-height: 100vh;
            }

            .mainPane {
              width: 70%;
            }

            .backdrop {
              display: none;
            }
          }
          @media (max-width: 599px) {
            .sidePane {
              position: absolute;
              width: 80vw;
              height: 100vh;
              top: 0;
              left: -81vw;
              z-index: 10;
              transition: 0.5s ease-out;
            }

            .sidePane.open {
              left: 0;
            }

            .backdrop {
              display: none;
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background-color: rgba(128, 128, 128, 0.6);
              z-index: 5;
              transition: 0.5s linear;
            }

            .backdrop.open {
              display: block;
            }

            .mainPane {
              width: 100%;
            }
          }
          .innerMainPane {
            position: relative;
          }
        `}</style>
      </div>
    )
  }
}

const ListFunctions = gql`
  query {
    functions {
      id,
      name,
      source,
      example
    }
  }
`

const ListRequests = gql`
  query {
    requests {
      id,
      data
    }
  }
`

const GetRequest = gql`
  query($id: ID!) {
    request(id: $id) {
      id,
      functionId,
      input,
      output
    }
  }
`

const CreateRequest = gql`
  mutation createRequest($id: ID!, $input: String!, $functionId: String!) {
    createRequest(
      id: $id,
      input: $input,
      functionId: $functionId
    ) {
      id,
      input,
      functionId,
      output
    }
  }
`

const AppWithData = compose(
  graphql(ListFunctions, { name: 'functions' }),
  graphql(ListRequests, {
    name: 'requests',
    options: {
      pollInterval: 2000
    }
  }),
  graphql(CreateRequest, {name: 'createRequest'}),
  graphql(GetRequest, {
    skip: ({requestId}) => {
      return !requestId
    },
    options: ({requestId}) => ({
      variables: { id: requestId }
    })
  })
)(App)

export default AppWithData
