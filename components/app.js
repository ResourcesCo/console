import { Component } from 'react'
import Head from './head'
import FunctionForm from './function-form'
import OutputForm from './output-form'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentFunction: null
    }
  }

  get currentFunction() {
    if (this.props.data.allFunctions) {
      return this.props.data.allFunctions[0]
    }
  }

  render() {
    return (
      <div className="page">
        <Head loggedIn={true} />
        
        <div className="function">
          <FunctionForm currentFunction={this.currentFunction} />
        </div>
        <div className="output">
          <OutputForm currentFunction={this.currentFunction} />
        </div>

        <style jsx>{`
          .page {
            height: 100vh;
            width: 100vw;
          }
          .function {
            position: absolute;
            top: 0;
            bottom: 50%;
            left: 0;
            right: 0;
          }
          .output {
            position: absolute;
            top: 50%;
            bottom: 0;
            left: 0;
            right: 0;
          }
        `}</style>
      </div>
    )
  }
}

const AllFunctions = gql`query { allFunctions { name, source, example } }`
const AppWithData = graphql(AllFunctions)(App)

export default AppWithData