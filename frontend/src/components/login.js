import React from 'react'
import '../css/login.css'
import splash from '../splash.jpeg';

// Routing imports
import { NavLink } from 'react-router-dom'

// Component imports
import Input from './reusable/input'

// Function imports

class Login extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    email: '',
    password: '',
    remember: false,
    touched: {
      email: false, password: false
    }
  }

  // Set state to initialState
  state = this.initialState

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
    const {email, password, remember} = this.state
    return (
      <div className="page-container">
        { /* Splash background */ }
        <img id="splash-img" src={ splash } alt="splash"/>

        <div id="login-container">
          <div id="form-container">
            <h1>Login</h1>

            { /* Email */ }
            <Input type="email" onChange={ this.onChange } onBlur={ this.onBlur } error={ false }></Input>

            { /* Password */ }
            <Input type="password" onChange={ this.onChange } onBlur={ this.onBlur } error={ false }></Input>

            { /* Remember me checkbox */ }
            <label>
              <input className="checkbox" name="remember" type="checkbox" onChange={ (e) => this.setState({ remember: e.target.checked }) }/> Remember me?
            </label>

            { /* Login button */ }
            <button id="login-button" onClick={ () => this.props.onLogin({email, password, remember}) }>Login</button>

            { /* Register option */ }
            <span>Don't have an account? Register <NavLink id="register-button" exact to="/register">here</NavLink></span>
          </div>
        </div>
      </div>
    );
  }
}

export default Login
