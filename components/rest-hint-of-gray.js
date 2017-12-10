import {Component} from 'react'

class Expandable extends Component {
  constructor({children, ...props}) {
    super({children, ...props})
    this.linkComponent = children[0]
    this.contentComponent = children[1]
    this.state = { display: false }
  }

  show = () => {
    this.setState({ display: true })
  }

  hide = () => {
    this.setState({ display: false })
  }

  onPopoverRef = el => {
    if (el) this.setState({ popoverWidth: el.offsetWidth })
  }

  popoverPosition() {
    if (this.el && this.props.containerEl && this.state.popoverWidth) {
      const leftEdge = this.el.offsetLeft + (this.el.offsetWidth / 2) - (this.state.popoverWidth / 2)
      if (leftEdge < this.props.containerEl.offsetLeft) return 'left'
      const rightEdge = this.el.offsetLeft + (this.el.offsetWidth / 2) + (this.state.popoverWidth / 2)
      if (rightEdge > this.props.containerEl.offsetLeft + this.props.containerEl.offsetWidth) return 'right'
      return 'center'
    } else {
      return 'invisible'
    }
  }

  render() {
    const display = this.state.display
    return (
      <div className="expandable" onMouseEnter={this.show} onMouseLeave={this.hide} ref={el => this.el = el}>
        {this.linkComponent}
        {this.state.display && (<div
             className={['popover', this.popoverPosition()].join(' ')}
             style={{maxWidth: '500px'}}
             ref={this.onPopoverRef}
        >
          {this.contentComponent}
        </div>)}
        <style jsx>{`
          .expandable {
            display: inline-block;
            position: relative;
          }
          .popover {
            position: absolute;
            top: 100%;
            border: 1px solid #999;
            border-radius: 3px;
            padding: 2px 5px;
            background-color: #eee;
          }
          .popover.invisible {
            visibility: hidden
          }
          .popover.left {
          }
          .popover.center {
            left: 50%;
            transform: translate(-50%, 0);
          }
          .popover.right {
            right: 0;
          }
        `}</style>
      </div>
    )
  }
}

export default class RestHintOfGray extends Component {
  render() {
    return (
      <div className="rest-header" ref={el => this.containerEl = el}>
        <div className="left">
          <Expandable containerEl={this.containerEl}>
            <a href="">GET</a>
            <div style={{whiteSpace: "nowrap"}}>method: GET</div>
          </Expandable>
          {" "}
          <Expandable containerEl={this.containerEl}>
            <a href="">https://api.github.com/v3/users/<em className="field">douglascrockford</em></a>
            <div style={{whiteSpace: "nowrap"}}>url: https://api.github.com/v3/users/douglascrockford</div>
          </Expandable>
          {" "}
          <Expandable containerEl={this.containerEl}>
            <a href=""><span className="smaller">▼</span>json</a>
            <div style={{whiteSpace: "nowrap"}}><strong>header</strong> Accept: application/json</div>
          </Expandable>
          {" "}
          <Expandable containerEl={this.containerEl}>
            <a href="">ua:<em className="field">r</em></a>
            <div style={{whiteSpace: "nowrap"}}><strong>header</strong> User-Agent: resources</div>
          </Expandable>
          {" "}
          <Expandable containerEl={this.containerEl}>
            <a href="">auth:<em className="field">none</em></a>
            <div style={{width: 400}}>Without authorization, the number of requests permitted may be reduced. An Authorization header can be used for auth.</div>
          </Expandable>
        </div>
        <div className="right">
          <a href="" className="button">go</a>
        </div>
        <style jsx>{`
          .rest-header .left  {
            float: left;
          }
          .rest-header .right {
            float: right;
          }
          a {
            color: #222;
            text-decoration-color: #bbb;
          }
          a.button {
            color: #999;
          }
          em.field {
            color: #999;
          }
          span.smaller {
            font-size: 50%;
          }
        `}</style>
      </div>
    )
  }
}
