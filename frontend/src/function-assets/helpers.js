export function stringToDecimal(str) {
    if (typeof str !== 'string') {
        throw new TypeError(`A string representing a decimal integer must be passed to stringToDecimal!`)
    }
    try {
        return parseInt(str || 0, 10)
    } catch {
        throw new Error(`Error using convering variable ${Object.keys({str})[0]} to integer!`)
    }
}

export function includesNumber(str) {
    const charArray = str.split('')
    const numeralArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    return charArray.some((char) => numeralArray.includes(char))
}

//Snippet from https://www.w3schools.com/js/js_cookies.asp
export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

export const helpers = { stringToDecimal, includesNumber, getCookie, setCookie }
export default helpers
