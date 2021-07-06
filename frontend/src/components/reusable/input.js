import React from 'react'
import '../../css/input.css'

// Render input using props
const Input = (props) => {
  return (
    <section className="email-input">
      <input
        name="email" 
        type="email" 
        className={ props.class }
        value={ props.email }
        onBlur={ () => props.onBlur('email') }
        onChange={ (e) => props.onChange(e) } />
    </section>
  )
}

export default Input
