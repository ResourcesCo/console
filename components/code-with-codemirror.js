import React, { Component } from 'react'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'

export default ({onChange, ...props}) => {
  const options = {
    theme: 'material',
    mode: { name: 'javascript', json: 'json' in props ? props.json : true },
    tabSize: 2,
    ...(props.options || {})
  }
  return (
    <div className="react-codemirror-wrapper">
      <CodeMirror
        {...props}
        value={props.value}
        options={options}
        onChange={(editor, data, value) => onChange ? onChange(value) : null}
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
}