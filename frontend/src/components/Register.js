import React from 'react'
import '../css/register.css'
import EmailInput from './form-components/EmailInput'
import PasswordInput from './form-components/PasswordInput'
import UsernameInput from './form-components/UsernameInput'
import PasswordConfirmation from './form-components/PasswordConfirmation'
import validate from '../function-assets/validate'
import splash from '../splash.jpeg';

class Register extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    email: '',
    username: '',
    password: '',
    confirmationPassword: '',
    touched: {
      email: false, username: false, password: false, confirmationPassword: false
    },
    isUsernameTaken: false,
    isEmailTaken: false
  }

  // Set state to initialState
  state = this.initialState
  markTouched = validate.markTouched.bind(this)
  isUsernameTaken = validate.isUsernameTaken.bind(this)
  isEmailTaken = validate.isEmailTaken.bind(this)
  isEmailValid = validate.isEmailValid
  validatePassword = validate.validatePassword
  validateUsername = validate.validateUsername

  areAllFieldsValid() {
   const {email, username, password, confirmationPassword} = this.state
   return ( this.isEmailValid(email) 
          && this.validatePassword(password).bool
          && password === confirmationPassword 
          && this.validateUsername(username).bool )
  }

  async signupHandler(form) {
    form.preventDefault()
    if(this.areAllFieldsValid()){
      const { email, username, password } = this.state

      const apiResponse = await fetch(`${process.env.REACT_APP_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      })

      const { response } = await apiResponse.json()

      if (response === `success`) {
        window.location.replace("/login");
      } else if (response === `already registered`) {
        alert("There is already an email address associated with that email.\n Try logging in or registering again!")
        window.location.reload()
      } else if (response === `bad credentials`) {
        alert("Invalid email, username or password!\nEnsure Javascript is enabled and reload the app.")
        window.location.replace("/error")
      }
    }
  }

  render() {
    const {email, isEmailTaken, username, isUsernameTaken, password, confirmationPassword, touched} = this.state
    const passwordValidity = this.validatePassword(password)
    const usernameValidity = this.validateUsername(username)
    return (
      <div className="page-container">
        <div id="registration-container">
            <h1>Register</h1>
            <form id="form-container" onSubmit={(e) => this.signupHandler(e)}>
              {isEmailTaken && <p className="error-message">Your email address is already associated with an account! <br/> Log in or use a different email.</p>}
              <EmailInput email={email}
                isTouched={touched.email} 
                isEmailValid={this.isEmailValid(email)}
                onBlur={() => this.markTouched('email')}
                onChange={(e) => { this.setState({email: e.target.value})
                  this.isEmailTaken(e.target.value)} }/>

              <UsernameInput username={username}
                isTouched={touched.username}
                isUsernameValid={usernameValidity.bool}
                isUsernameTaken={isUsernameTaken}
                errorMsg={usernameValidity.msg}
                onKeyUp={async (e) => await this.isUsernameTaken(e.target.value)}
                onChange={(e) => this.setState({username: e.target.value})}
                onBlur={() => this.markTouched('username')} />

              <PasswordInput password={password}
                isTouched={touched.password}
                isPasswordValid={passwordValidity.bool}
                errorMsg={passwordValidity.msg}
                onBlur={() => {this.markTouched('password')}}
                onChange={(e) => this.setState({password: e.target.value})}/>

              <PasswordConfirmation confirmationPassword={confirmationPassword}
                password={password}
                isTouched={touched.confirmationPassword}
                isPasswordValid={passwordValidity.bool}
                onBlur={() => {this.markTouched('confirmationPassword')}}
                onChange={(e) => {this.setState({confirmationPassword: e.target.value})}}/>

              <button id="register-button"
                  type='submit' 
                  disabled={!this.areAllFieldsValid() || isEmailTaken || isUsernameTaken} 
                  className={this.areAllFieldsValid() && !isEmailTaken && !isUsernameTaken ? "acitve-button" : "inactive-button"}>
              Register
              </button>
          </form>
        </div>
        <img id="splash-img" src={ splash } alt="splash"/>
      </div>
    );
  }
}

export default Register
