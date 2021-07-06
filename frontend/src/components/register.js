import React from 'react'
import '../css/register.css'
import EmailInput from './form-components/EmailInput'
import PasswordInput from './form-components/PasswordInput'
import PasswordConfirmation from './form-components/PasswordConfirmation'
import FormFuncs from '../function-assets/FormFuncs'
import splash from '../splash.jpeg';

class Register extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    email: '',
    password: '',
    confirmationPassword: '',
    touched: {
      email: false, password: false, confirmationPassword: false
    }
  }

  // Set state to initialState
  state = this.initialState
  markTouched = FormFuncs.markTouched.bind(this)
  isEmailValid = FormFuncs.isEmailValid
  validatePassword = FormFuncs.validatePassword

  areAllFieldsValid() {
   const {email, password, confirmationPassword} = this.state
   return( this.isEmailValid(email) 
          && this.validatePassword(password).bool
          && password === confirmationPassword )
  }

  // // When user clicks login
  async signupHandler(form) {
    form.preventDefault()

    if(this.areAllFieldsValid()){
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
  }

  render() {
    const {email, password, confirmationPassword, touched} = this.state
    const passwordValidity = this.validatePassword(password)
    return (
      <div className="page-container">
        <div id="registration-container">
            <h1>Register</h1>
            <form id="form-container" onSubmit={(e) => this.signupHandler(e)}>
              <EmailInput email={email}
                isTouched={touched.email} 
                isEmailValid={this.isEmailValid(email)}
                onBlur={() => {this.markTouched('email')}}
                onChange={(e) => this.setState({email: e.target.value})}/>

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
                  disabled={!this.areAllFieldsValid()} 
                  className={this.areAllFieldsValid()? "submit-button" : "disabled-submit-button"}>
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
