import {Component} from 'react'
import dynamic from 'next/dynamic'
const Code = dynamic(import('./code-with-codemirror'), {ssr: false})
import SectionBar from './section-bar'
import SendBar from './send-bar'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'
import {debounce} from 'lodash'

class FunctionForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sending: false,
      value: undefined,
      selectedTab: null
    }
    this.readCode = debounce(this.readCode, 500, {maxWait: 2000})
  }

  readCode() {
    let data
    try {
      data = JSON.parse(this.state.value)
    } catch (err) {
      // ignore
    }
    let clientType
    if (data && data.client) {
      if (typeof data.client === 'string') {
        clientType = data.client
      } else {
        clientType = data.client.type
      }
    }
    this.props.onChange({clientType})
  }

  get activeTab() {
    return this.state.selectedTab || 'input'
  }

  handleSectionBarChange = (tab) => {
    this.setState({selectedTab: tab})
  }

  get code() {
    return this.props.input || this.props.example
  }

  get value() {
    return this.state.value === undefined ? this.code : this.state.value
  }

  handleChange = value => {
    this.readCode()
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
        <SectionBar
          onMenuClick={this.props.onMenuClick} 
          menu
          activeTab={this.activeTab} 
          onChange={this.handleSectionBarChange}
        >
          <tab value="input">Input</tab>
        </SectionBar>
        <div className="code">
          <div>
            <Code
              value={this.code}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <SendBar
          loading={this.props.loading}
          onSendClick={this.sendClicked}
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