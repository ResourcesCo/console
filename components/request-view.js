import { Component } from 'react'
import FunctionForm from './function-form'
import OutputForm from './output-form'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

export default class RequestView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: undefined,
      clientType: undefined
    }
  }

  get clientType() {
    if (this.state.clientType) {
      return this.state.clientType
    } else {
      return 'http'
    }
  }

  get currentFunction() {
    return this.functions.filter(fn => fn.id === this.clientType)[0]
  }

  get functions() {
    if (this.props.functions.functions) {
      return this.props.functions.functions
    } else {
      return []
    }
  }

  handleInputChange = ({clientType}) => {
    this.setState({clientType})
  }

  get input() {
    if (this.props.request && typeof this.props.request.input === 'string') {
      return this.props.request.input;
    }
  }

  get output() {
    if (this.props.request && typeof this.props.request.output === 'string') {
      return this.props.request.output;
    }
  }

  get loading() {
    return (
      this.props.request.id &&
      this.props.request.id === this.props.loading &&
      !this.props.request.output
    )
  }

  render() {
    return (
      <div className="page">
        <div className="function">
          <FunctionForm
            onMenuClick={this.props.onMenuClick}
            loading={this.loading}
            example={this.functions[0] && this.functions[0].example}
            input={this.input}
            onChange={this.handleInputChange}
            onSubmit={code => this.props.onSubmit({functionId: this.clientType, code})}
          />
        </div>
        <div className="output">
          <OutputForm currentFunction={this.currentFunction} output={this.output} />
        </div>

        <style jsx>{`
          .page {
            height: 100vh;
            width: 100%;
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
