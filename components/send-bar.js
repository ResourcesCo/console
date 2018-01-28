import {Component} from 'react'
import dynamic from 'next/dynamic'
const Code = dynamic(import('./code-with-codemirror'), {ssr: false})
import Spinner from 'react-svg-spinner'
import SendIcon from 'react-icons/lib/md/send'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'

class SendBar extends Component {
  sendClicked = event => {
    event.preventDefault()
    this.setState({
      sending: true
    })
    this.props.onSubmit(this.value)
    return false
  }

  onSelect = event => {
    this.props.onFunctionSelect(event.target.value)
  }

  render() {
    return (
      <div className={classNames('send-bar', {loading: this.props.loading})}>
        <span className="function-select">
          <select value={this.props.currentFunction && this.props.currentFunction.id} onChange={this.onSelect}>
            {this.props.allFunctions.map(fn => (
              <option key={fn.id} value={fn.id}>{fn.name}</option>
            ))}
          </select>
        </span>
        <span className="spinner">
          <Spinner size="1em" color="white" />
        </span>
        <span className="send-icon">
          <SendIcon onClick={this.props.onSendClick} />
        </span>
        <style jsx>{`
          .send-bar {
            background-color: #8bc34a;
            color: #fff;
            width: 100%;
            font-size: 200%;
            padding: 2px 5px;
            border: none;
          }
          .send-bar .function-select {
            float: left;
            height: 32px;
            display: inline-block;
          }
          .send-bar .function-select select {
            vertical-align: middle;
            margin-top: -9px;
            margin-left: 3px;
          }
          .send-bar .spinner :global(svg) {
            display: none;
            float: right;
          }
          .send-bar .send-icon :global(svg) {
            cursor: pointer;
            float: right;
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
      </div>
    )
  }
}

export default SendBar