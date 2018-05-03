import { Component } from 'react'
import Head from './head'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Request from './request'
import RequestList from './request-list'
import Router from 'next/router'

class App extends Component {
  handleChange = ({requestId}) => {
    Router.push({ pathname: '/', query: { id: requestId } },
                `/requests/${requestId}`,
                { shallow: true })
  }

  render() {
    return (
      <div className="app">
        <Head loggedIn={true} />
        <div className="sidePane">
          <RequestList />
        </div>
        <div className="mainPane">
          <div className="innerMainPane">
            <Request
              functions={this.props.functions}
              requestId={this.props.requestId}
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

const AppWithData = graphql(ListFunctions, { name: 'functions' })(App)

export default AppWithData
