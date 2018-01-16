import React, { Component } from 'react'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'

export default (props) => (
  <div className="react-codemirror-wrapper">
    <CodeMirror
      {...props}
      value={props.value}
      options={{theme: 'material',
               mode: { name: 'javascript', json: 'json' in props ? props.json : true },
               tabSize: 2}}
      onChange={() => null}
    />
    <style jsx>{`
      .react-codemirror-wrapper,
      .react-codemirror-wrapper :global(.react-codemirror2),
      .react-codemirror-wrapper :global(.react-codemirror2) :global(.CodeMirror) {
        height: 100%;
        min-height: 100%;
      }
    `}</style>
  </div>
)