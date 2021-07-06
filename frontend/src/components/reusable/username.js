export function Username({ username, isUsernameValid, isTouched, isUsernameTaken, errorMsg, onChange, onBlur, onKeyUp }){
    return (
        <section className="username-input">
            <div className="username-input-label">
              <label htmlFor="username">Username: </label>
              { isTouched && !isUsernameValid ? <span className="error-message">{ errorMsg }</span> :
                isUsernameTaken ? <span className="error-message">Username is already taken!</span> : <></> }
            </div>
            <input type="text" name="username" value={ username }
                   className="username-input-box"
                   onChange={ (e) => onChange(e) } 
                   onKeyUp={ (e) => onKeyUp(e) }
                   onBlur={ () => onBlur() } />
        </section>
    ) 
}

export default Username
