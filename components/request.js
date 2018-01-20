import { Component } from 'react'
import Head from './head'
import FunctionForm from './function-form'
import OutputForm from './output-form'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import shortid from 'shortid'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentFunction: null,
      loading: false
    }
  }

  get currentFunction() {
    if (this.props.functions.allFunctions) {
      return this.props.functions.allFunctions[0]
    }
  }

  onSubmit = code => {
    const variables = {
      id: shortid(),
      input: code,
      functionId: this.currentFunction.id
    }
    this.props.onChange({requestId: variables.id})
    this.props.mutate({
      variables
    })
  }

  get loading() {
    if (!this.props.data.request) return false;
    const createdRequest = (this.props.data.request.id !== 'none')
    const outputLoaded = (typeof this.props.data.request.output === 'string')
    return (createdRequest && !outputLoaded)
  }

  render() {
    return (
      <div className="page">
        <Head loggedIn={true} />
        
        <div className="function">
          <FunctionForm loading={this.loading} currentFunction={this.currentFunction} onSubmit={this.onSubmit} />
        </div>
        <div className="output">
          <OutputForm currentFunction={this.currentFunction} />
        </div>

        <style jsx>{`
          .page {
            height: 100vh;
            width: 100vw;
          }
          .function {
            position: absolute;
            top: 0;
            bottom: 50%;
            left: 0;
            right: 0;
          }
          .output {
            position: absolute;
            top: 50%;
            bottom: 0;
            left: 0;
            right: 0;
          }
        `}</style>
      </div>
    )
  }
}

const Request = gql`
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
  graphql(CreateRequest),
  graphql(Request, {
    options: ({requestId}) => ({
      variables: { id: requestId }
    })
  })
)(App)

export default AppWithData