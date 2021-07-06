import React from 'react'
import '../css/login.css'
import splash from '../splash.jpeg';

// Routing imports
import { NavLink } from 'react-router-dom'

// Component imports
import Input from './reusable/input'

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

  onChange() {

  }

  onBlur() {

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
            <Input onChange={ this.onChange } onBlur={ this.onBlur }></Input>

            { /* Password */ }
            <Input onChange={ this.onChange } onBlur={ this.onBlur }></Input>

            { /* Remember me checkbox */ }
            <label>
              <input className="checkbox" name="remember" type="checkbox"/> Remember me?
            </label>

            { /* Login button */ }
            <button id="login-button">Log in</button>

            { /* Register option */ }
            <span>Don't have an account?<button id="register-button">Register</button></span>
          </div>
        </div>

        { /* <div id="login-container">
          <h1>Sigma Labs</h1>

          <p id="email-p">Email address</p>
          <input
            name="email"
            type="email"
            value={ this.state.email }
            onChange={ (e) => this.setState({ email: e.target.value }) }>
          </input>

          <div id="pw-title-container">
            <p id="pw-p">Password</p>
            <button id="forgot-button">Forgot password?</button>
          </div>

          <input
            id="pw-input"
            name="password"
            type="password"
            value={ this.state.password }
            onChange={ (e) => this.setState({ password: e.target.value }) }>
          </input>

          <button id="login-button" onClick={ () => this.loginHandler() }>Sign in</button>
        </div> */ }
      </div>
    );
  }
}

export default Login
