import {Component} from 'react'
import dynamic from 'next/dynamic'
const Code = dynamic(import('./code-with-codemirror'), {ssr: false})
import SendBar from './send-bar'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'

class FunctionForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sending: false,
      value: null
    }
  }

  get example() {
    return this.props.currentFunction && this.props.currentFunction.example
  }

  get value() {
    return this.state.value === null ? this.example : this.state.value
  }

  handleChange = value => {
    this.setState({value: value})
  }

  sendClicked = event => {
    event.preventDefault()
    this.setState({
      sending: true
    })
    this.props.onSubmit(this.value)
    return false
  }

  render() {
    return (
      <form className="function-form" onSubmit={this.sendClicked}>
        <div className="code">
          <div>
            <Code
              value={this.example}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <SendBar 
          functions={this.props.functions}
          currentFunction={this.props.currentFunction}
          loading={this.props.loading}
          onSendClick={this.sendClicked}
          onFunctionSelect={this.props.onFunctionSelect}
        />
      
        <style jsx>{`
          .function-form {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
          }
          .code {
            flex-grow: 1;
            position: relative;
          }
          .code > div {
            position: absolute;
            width: 100%;
            height: 100%;
          }
          .code :global(.CodeMirror) {
            height: 100%;
          }
        `}</style>
      </form>
    )
  }
}

export default FunctionForm