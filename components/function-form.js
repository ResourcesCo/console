import {Component} from 'react'
import dynamic from 'next/dynamic'
const Code = dynamic(import('./code-with-codemirror'), {ssr: false})
import SendIcon from 'react-icons/lib/md/send'

export default class FunctionForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sending: false
    }
  }

  sendClicked = event => {
    event.preventDefault()
    this.setState({
      sending: true
    })
    return false
  }
  render() {
    return (
      <form className="function-form" onSubmit={this.sendClicked}>
        <div className="code">
          <div>
            <Code value={this.props.currentFunction && this.props.currentFunction.example} />
          </div>
        </div>
        <div className="send-button">
          <SendIcon />
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
          .send-button {
            background-color: #8bc34a;
            color: #fff;
            text-align: right;
            width: 100%;
            font-size: 200%;
            padding: 2px 5px;
            border: none;
          }
          .send-button :global(svg) {
            padding-bottom: 3px;
          }
          .send-button:focus {
            outline: 0;
          }
        `}</style>
      </form>
    )
  }
}