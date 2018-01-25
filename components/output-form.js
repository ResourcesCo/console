import {Component} from 'react'
import dynamic from 'next/dynamic'
const Code = dynamic(import('./code-with-codemirror'), {ssr: false})
import SendIcon from 'react-icons/lib/md/send'
import SectionBar from './section-bar'
import classNames from 'classnames'

export default class OutputForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: null
    }
  }

  componentWillReceiveProps({output}) {
    if (output !== this.props.output) {
      this.setState({selectedTab: null})
    }
  }

  get activeTab() {
    return this.state.selectedTab || (this.props.output ? 'output' : 'function')
  }

  handleSectionBarChange = (tab) => {
    this.setState({selectedTab: tab})
  }

  render() {
    const functionSource = this.props.currentFunction && this.props.currentFunction.source
    return (
      <form className="output-form">
        <SectionBar activeTab={this.activeTab} onChange={this.handleSectionBarChange}>
          <tab value="function">Function</tab>
          <tab value="output" disabled={!this.props.output}>Output</tab>
        </SectionBar>
        <div className="code">
          <div>
            <Code
              json={this.activeTab === 'output'}
              value={this.activeTab === 'function' ? functionSource : this.props.output}
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
          :global(.CodeMirror) {
            cursor: text;
          }
        `}</style>
      </form>
    )
  }
}