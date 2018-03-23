import { Component } from 'react'

export default class App extends Component {
  signIn = () => {
    window.location.href = '/auth/github'
  }

  render() {
    return (
      <div>
        <button onClick={this.signIn}>Sign In with GitHub</button>
        <style jsx global>{`
          html, body {
            background-color: #222;
          }

          body {
            text-align: center;
          }
        `}</style>
        <style jsx>{`
          div {
            text-align: center;
            margin-top: 100px;
          }

          button {
            background-color: #4aa933;
            color: #ddd;
            font-size: 30px;
            border: none;
            padding: 10px 25px;
          }
        `}</style>
      </div>
    )
  }
}