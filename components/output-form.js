import {Component} from 'react'
import dynamic from 'next/dynamic'
const Code = dynamic(import('./code-with-codemirror'), {ssr: false})
import SendIcon from 'react-icons/lib/md/send'
import SectionBar from './section-bar'

export default class OutputForm extends Component {
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
      <form className="output-form" onSubmit={this.sendClicked}>
        <div className="code">
          <div>
            <SectionBar selectedTab="function">
              <tab value="function">Function</tab>
              <tab value="output">Output</tab>
            </SectionBar>
            <Code json={false} value={this.props.currentFunction && this.props.currentFunction.source} />
          </div>
        </div>
      
        <style jsx>{`
          .output-form {
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