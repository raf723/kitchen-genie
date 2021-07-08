/* A Library of boilerplate methods for forms with certain types of components */

import { includesNumber } from "./helpers.js"
import { getUser } from "./serverFunctions.js"


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

export async function isUsernameValid(username, checkNameIsNew=false) {
  return (
    username
    && username.length !== 0
    && username.length <= 50
    && !(checkNameIsNew && await getUser({username}))
  )
}

export const verify = { isEmailValid, isPasswordValid, isUsernameValid }

export default verify
