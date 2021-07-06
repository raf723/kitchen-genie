import React from 'react'
import '../css/login.css'
import splash from '../splash.jpeg';

// Routing imports
import { NavLink } from 'react-router-dom'

// Component imports
import Input from './reusable/input'

// Function imports
import Validate from '../function-assets/validate';

class Login extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    email: '',
    password: '',
    touched: {
      email: false, password: false
    }
  }

  // Set state to initialState
  state = this.initialState

  // When user clicks login
  loginHandler = async() => {
    const { email, password } = this.state

    // POST request to server
    const response = await fetch(`http://localhost:8080/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    })
    
    // Server response
    const { errorMessage } = await response.json()
    
    // Display alert if login error, else redirect to homepage
    if (errorMessage !== '') alert(errorMessage)
    // else window.location.replace('/')
  }

  // When input value is changed
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  // When input focus is removed
  onBlur = (field) => {
    const touchedField = {...this.state.touched}
    touchedField[field] = true
    this.setState({ touched: touchedField })
  }

  render() {
    return (
      <div className="page-container">
        { /* Splash background */ }
        <img id="splash-img" src={ splash } alt="splash"/>

        <div id="login-container">
          <div id="form-container">
            <h1>Login</h1>

            { /* Email */ }
            <Input type="email" onChange={ this.onChange } onBlur={ this.onBlur } error={ true }></Input>

            { /* Password */ }
            <Input type="password" onChange={ this.onChange } onBlur={ this.onBlur } error={ true }></Input>

            { /* Remember me checkbox */ }
            <label>
              <input className="checkbox" name="remember" type="checkbox"/> Remember me?
            </label>

            { /* Login button */ }
            <button id="login-button" onClick={ () => this.loginHandler() }>Login</button>

            { /* Register option */ }
            <span>Don't have an account?<button id="register-button">Register</button></span>
          </div>
        </div>
      </div>
    );
  }
}

export default Login
