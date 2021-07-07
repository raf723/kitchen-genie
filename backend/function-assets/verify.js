/* A Library of boilerplate methods for forms with certain types of components */

import { includesNumber } from "./helpers.js"


export function isEmailValid(email) {
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
    return email && emailPattern.test(email)
}

export function isPasswordValid(password) {
  return (
    password
    && password.length >= 8  
    && password.match(/[a-z]/) 
    && password.match(/[A-Z]/) 
    && includesNumber(password) 
    && password.match(/[^A-Za-z0-9]/) 
  )
}

export function isUsernameValid(proposedName) {
  return (
    proposedName
    && proposedName.length !== 0
    && proposedName.length <= 50
  )
}

export const verify = { isEmailValid, isPasswordValid, isUsernameValid }

export default verify
