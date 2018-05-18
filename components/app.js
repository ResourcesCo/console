import { Component } from 'react'
import Head from './head'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import RequestView from './request-view'
import RequestList from './request-list'
import Router from 'next/router'

class App extends Component {
  handleChange = ({requestId}) => {
    Router.push({ pathname: '/', query: { id: requestId } },
                `/requests/${requestId}`,
                { shallow: true })
  }

  get request() {
    return (this.props.data && this.props.data.request) || {}
  }

  render() {
    return (
      <div className="app">
        <Head loggedIn={true} />
        <div className="sidePane">
          <RequestList 
            requests={this.props.requests} 
            request={this.request} 
            onChange={this.handleChange} 
          />
        </div>
        <div className="mainPane">
          <div className="innerMainPane">
            <RequestView
              functions={this.props.functions}
              request={this.request}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <style jsx>{`
          .app {
            display: flex;
          }
          .sidePane {
            width: 30%;
            background-color: rgb(38, 50, 56);
            border-right: 2px solid #000;
            padding: 5px;
            color: #ddd;
          }
          .mainPane {
            width: 70%;
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
  query($refresh: String) {
    requests(refresh: $refresh) {
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

const AppWithData = compose(
  graphql(ListFunctions, { name: 'functions' }),
  graphql(ListRequests, {
    name: 'requests',
    options: ({requestId}) => ({
      variables: { refresh: requestId }
    })
  }),
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
