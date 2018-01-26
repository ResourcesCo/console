import {Component} from 'react'
import dynamic from 'next/dynamic'
const Code = dynamic(import('./code-with-codemirror'), {ssr: false})
import Spinner from 'react-svg-spinner'
import SendIcon from 'react-icons/lib/md/send'
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
        <div className={classNames('send-bar', {loading: this.props.loading})}>
          <span className="spinner">
            <Spinner size="1em" color="white" />
          </span>
          <span className="send-icon">
            <SendIcon onClick={this.sendClicked} />
          </span>
        </div>
      
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
          .send-bar {
            background-color: #8bc34a;
            color: #fff;
            text-align: right;
            width: 100%;
            font-size: 200%;
            padding: 2px 5px;
            border: none;
          }
          .send-bar .spinner :global(svg) {
            margin-bottom: -5px;
            display: none;
          }
          .send-bar .send-icon :global(svg) {
            margin-top: -6px;
            cursor: pointer;
          }
          .send-bar.loading .spinner :global(svg) {
            display: inline;
          }
          .send-bar.loading .send-icon :global(svg) {
            display: none;
          }
          .send-bar:focus {
            outline: 0;
          }
        `}</style>
      </form>
    )
  }
}

export default FunctionForm