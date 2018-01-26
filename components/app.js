import { Component } from 'react'
import Head from './head'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Request from './request'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      requestId: 'none'
    }
  }

  handleChange = ({requestId}) => {
    this.setState({requestId})
  }

  render() {
    return (
      <Request
        functions={this.props.functions}
        requestId={this.state.requestId}
        onChange={this.handleChange}
      />
    )
  }
}

const AllFunctions = gql`
  query {
    allFunctions {
      id,
      name,
      source,
      example
    }
  }
`

const AppWithData = graphql(AllFunctions, { name: 'functions' })(App)

export default AppWithData