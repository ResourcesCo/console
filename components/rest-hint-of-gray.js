import {Component} from 'react'

class Expandable extends Component {
  constructor(props) {
    super(props)
    this.state = { display: false }
  }

  show = () => {
    this.setState({ display: true })
  }

  hide = () => {
    this.setState({ display: false })
  }

  render() {
    const display = this.state.display
    return (
      <div className="expandable" onMouseEnter={this.show} onMouseLeave={this.hide}>
        {this.props.children[0]}
        {this.state.display && (<div
             className="popover"
             style={{display: display ? 'block' : 'none'}}
        >
          {this.props.children[1]}
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
          <a href=""><span className="smaller">▼</span>json</a>{" "}
          <a href="">ua:<em className="field">r</em></a>{" "}
          <a href="">auth:<em className="field">none</em></a>
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
