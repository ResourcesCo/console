import {Component} from 'react'
import dynamic from 'next/dynamic'
const Code = dynamic(import('./code-with-codemirror'), {ssr: false})
import SendIcon from 'react-icons/lib/md/send'
import SectionBar from './section-bar'

export default class OutputForm extends Component {
  render() {
    const {output} = this.props
    return (
      <form className="output-form">
        <SectionBar selectedTab="function">
          <tab value="function">Function</tab>
          <tab value="output" disabled>Output</tab>
        </SectionBar>
        <div className="code">
          <div>
            <Code
              json={false}
              value={this.props.currentFunction && this.props.currentFunction.source}
              options={{readOnly: true}}
            />
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