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
      currentFunctionId: null,
      loading: false
    }
  }

  get currentFunction() {
    if (this.state.currentFunctionId) {
      return this.allFunctions.filter(fn => fn.id === this.state.currentFunctionId)[0]
    } else {
      return this.allFunctions[0]
    }
  }

  get allFunctions() {
    if (this.props.functions.allFunctions) {
      return this.props.functions.allFunctions
    } else {
      return []
    }
  }

  onFunctionSelect = functionId => {
    this.setState({currentFunctionId: functionId})
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

  get output() {
    if (!this.props.data.request) return null;
    if (typeof this.props.data.request.output !== 'string') return null;
    return this.props.data.request.output;
  }

  get loading() {
    if (!this.props.data.request) return false;
    const createdRequest = (this.props.data.request.id !== 'none')
    return (createdRequest && this.output === null)
  }

  render() {
    return (
      <div className="page">
        <Head loggedIn={true} />
        
        <div className="function">
          <FunctionForm
            loading={this.loading}
            allFunctions={this.allFunctions}
            currentFunction={this.currentFunction}
            onFunctionSelect={this.onFunctionSelect}
            onSubmit={this.onSubmit}
          />
        </div>
        <div className="output">
          <OutputForm currentFunction={this.currentFunction} output={this.output} />
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