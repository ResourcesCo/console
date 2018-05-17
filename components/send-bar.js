import {Component} from 'react'
import dynamic from 'next/dynamic'
const Code = dynamic(import('./code-with-codemirror'), {ssr: false})
import Spinner from 'react-svg-spinner'
import SendIcon from 'react-icons/lib/md/send'
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

  render() {
    return (
      <div className={classNames('send-bar', {loading: this.props.loading})}>
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