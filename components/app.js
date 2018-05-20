import { Component } from 'react'
import Head from './head'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import RequestView from './request-view'
import RequestList from './request-list'
import Router from 'next/router'
import ObjectID from 'bson-objectid'

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
            width: 30%;
            background-color: rgb(38, 50, 56);
            border-right: 2px solid #000;
            padding: 5px;
            color: #ddd;
            max-height: 100vh;
            overflow-y: scroll;
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
