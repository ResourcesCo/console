import { Component } from 'react'
import Head from './head'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Request from './request'
import Router from 'next/router'

class App extends Component {
  handleChange = ({requestId}) => {
    Router.push({ pathname: '/', query: { id: requestId } },
                `/requests/${requestId}`,
                { shallow: true })
  }

  render() {
    return (
      <Request
        functions={this.props.functions}
        requestId={this.props.requestId}
        onChange={this.handleChange}
      />
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

const AppWithData = graphql(ListFunctions, { name: 'functions' })(App)

export default AppWithData
