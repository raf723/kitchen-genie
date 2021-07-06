import React from 'react'
import '../css/register.css'

// Routing imports
import { NavLink } from 'react-router-dom'

class Register extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    email: '',
    password: '',
    confirmPassword: '',
    touched: {
      email: false, password: false, confirmPassword: false
    }
  }

  // Set state to initialState
  state = this.initialState

  // When user clicks login
  signupHandler = async() => {
    const { email, password } = this.state

    // POST request to server
    const response = await fetch(`http://localhost:8080/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    })
    
    // Server response
    const { errorMessage } = await response.json()
    
    // Display alert if signup error, else redirect to homepage
    if (errorMessage !== '') alert(errorMessage)
    // else window.location.replace('/')
  }

  render() {
    return (
      <div className="page-container">
        <div id="signup-container">
          <h1>Register</h1>

          <p id="email-p">Email address</p>
          <input
            name="email"
            type="email"
            value={ this.state.email }
            onChange={ (e) => this.setState({ email: e.target.value }) }>
          </input>

          <p id="pw-p" className="input-title">Password</p>
          <input
            id="pw-input"
            name="password"
            type="password"
            value={ this.state.password }
            onChange={ (e) => this.setState({ password: e.target.value }) }>
          </input>

          <p id="confirm-p" className="input-title">Confirm password</p>
          <input
            id="confirm-input"
            name="confirmPassword"
            type="password"
            value={ this.state.confirmPassword }
            onChange={ (e) => this.setState({ confirmPassword: e.target.value }) }>
          </input>

          <button id="signup-button" onClick={ () => this.signupHandler() }>Register</button>
        </div>
      </div>
    );
  }
}

export default Register
