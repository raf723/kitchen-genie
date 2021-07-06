export function Email({ isTouched, isEmailValid, email, onBlur, onChange, labelClass, className }) {
    return (
        <section className="email-input">
        <div className={ labelClass || "email-input-label" }>
            <label htmlFor="email">Email: </label>
            { isTouched && !isEmailValid ? <span className="error-message">Invalid email!</span> : <></> }
        </div>
        <input type="text" 
               className={ className || "email-input-box" }
               name="email" 
               placeholder="example@site.com" 
               value={ email }
               onChange={ (e) => onChange(e) } 
               onBlur={ () => onBlur('email') } />
        </section>
    )
}

export default Email
