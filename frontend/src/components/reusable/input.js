import React from 'react'
import '../../css/input.css'

// Render input using props
const Input = (props) => {
  return (
    <div>
      <p id="title">{ props.type }</p>

      <input
        name={ props.type }
        type={ props.type }
        className={ props.class }
        value={ props.email }
        onChange={ (e) => props.onChange(e) }
        onBlur={ () => props.onBlur(props.type) } />

      { /* If condition on the left is true, show element on the right */ }
      { props.error && <p id="error">Error message</p> }
    </div>
  )
}

export default Input
