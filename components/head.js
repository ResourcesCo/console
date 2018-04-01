import NextHead from 'next/head'

const Head = ({loggedIn, title}) => (
  <NextHead>
    <meta charSet="UTF-8" />
    <title>{title || ''}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel='icon' href='/static/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
    {loggedIn && (<link key="codemirror-css-lib" rel="stylesheet" href="https://unpkg.com/codemirror/lib/codemirror.css" />)}
    {loggedIn && (<link key="codemirror-css-theme-material" rel="stylesheet" href="https://unpkg.com/codemirror/theme/material.css" />)}
    <style>{`
      html, body {
        background: #E3E5E7;
      }
      body {
        padding: 0;
        margin: 0;
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      h1, h2, h3, p, div {
        font-family: 'Roboto', sans-serif;
      }
      code, pre, .CodeMirror, .CodeMirror div {
        font-family: monospace;
      }
    `}</style>
  </NextHead>
)

export default Head
