import {Component} from 'react'
import classNames from 'classnames'

export default class SectionBar extends Component {
  render() {
    const tabs = [...this.props.children]
    return (
      <div className="section-bar">
        {
          tabs.map(tab => {
            const selected = this.props.selectedTab == tab.props.value
            return (
              <div key={tab.props.value} className={classNames('tab', {selected})}>
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
          .tab.selected {
            border-bottom: 2px solid #fff;
          }
        `}</style>
      </div>
    )
  }
}