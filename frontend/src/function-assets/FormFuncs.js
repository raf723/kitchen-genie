/* A Library of boilerplate methods for forms with certain types of components */

import { includesNumber } from "./helpers"

//A boilerplate method for forms with touced field in state
export function markTouched(field) {
    let newTouched = {...this.state.touched}
    newTouched[field] = true
    this.setState({ touched: newTouched })
} 

export function isEmailValid(email) {
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
    return emailPattern.test(email)
}

export function validatePassword(password) {
    if (password.length < 8){
      return { bool: false, msg: "Password must be at least 8 characters long!" }
    } else if (!password.match(/[a-z]/)) {
      return { bool: false, msg: "Password must include at least one lowercase letter!" }
    } else if (!password.match(/[A-Z]/)) {
      return { bool: false, msg: "Password must include at least one uppercase letter!" }
    } else if (!includesNumber(password)) {
      return { bool: false, msg: "Password must include at least one numeric character!" }
    } else if (!password.match(/[.!#$%&'*+/=?^_`{|}~-]/)) {
      return { bool: false, msg: "Password must include at least one special character!" }
    } else {
      return { bool: true, msg: "" }
    }
}

export function validateUsername(proposedName) {
    if(proposedName.length === 0) {
      return { bool: false, msg: "Username must be provided!" }
    } else if (proposedName.length > 50) {
      return { bool: false, msg: "Username must be less than 50 characters long!" }
    } else {
      return { bool: true, msg: "" }
    }
}

export async function isUsernameTaken(proposedName) {
    if(proposedName) {
      const existenceCheckResponse = await fetch(`http://localhost:8080/checkname/${proposedName}`)
      const { nameExists } = await existenceCheckResponse.json()
      this.setState({ isUsernameTaken: nameExists })
      return nameExists
    } else {
      return false
    }
}

export function validateTitle(proposedTitle) {
    if (proposedTitle.length === 0) {
        return { bool: false, msg: "Title must be given!" }
    } else if (proposedTitle.length > 200) {
        return { bool: false, msg: "Title is too long!" }
    } else {
        return { bool: true, msg: "" }
    }
}

export const FormFuncs = { markTouched, isEmailValid, validatePassword, validateUsername, isUsernameTaken, validateTitle }

export default FormFuncs