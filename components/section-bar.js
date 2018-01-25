import {Component} from 'react'
import classNames from 'classnames'

export default class SectionBar extends Component {
  handleClick(value, disabled) {
    if (!disabled) {
      this.props.onChange(value)
    }
  }

  render() {
    const tabs = [...this.props.children]
    return (
      <div className="section-bar">
        {
          tabs.map(tab => {
            const active = this.props.activeTab == tab.props.value
            const disabled = tab.props.disabled
            return (
              <div key={tab.props.value}
                   className={classNames('tab', {active, disabled})}
                   onClick={() => this.handleClick(tab.props.value, disabled)}>
                {tab.props.children}
              </div>
            )
          })
        }
        <style jsx>{`
          .section-bar {
            background-color: #516375;
            color: #A8D3F0;
          }
          .tab {
            display: inline-block;
            padding: 12px 15px 7px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            font-size: 85%;
          }
          .tab.active {
            border-bottom: 2px solid #fff;
          }
          .tab.disabled {
            color: #86919B;
          }
        `}</style>
      </div>
    )
  }
}