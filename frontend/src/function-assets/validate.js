/* A Library of boilerplate methods for forms with certain types of components */

import { includesNumber } from "./FormFuncs"

//A boilerplate method for forms with touced field in state
export function markTouched(field) {
    let newTouched = {...this.state.touched}
    newTouched[field] = true
    this.setState({ touched: newTouched })
} 

export function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return emailPattern.test(email)
}

export function validatePassword(password) {
    if (password.length < 8){
      return { bool: false, msg: "Password must be at least 8 characters long!" }
    } else if (!includesNumber(password)) {
      return { bool: false, msg: "Password must include at least one numeric character!" }
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

export const Validate = { markTouched, validateEmail, validatePassword, validateUsername }

export default Validate
