export function confirmPassword({ confirmationPassword, password, isPasswordValid, isTouched, onChange, onBlur, className }) {
    return (
        <section className="password-confirmation-input">
            <div className={ className }>
                <label htmlFor="password_confirmation">Confirm password: </label>
                { isTouched && isPasswordValid && password !== confirmationPassword ? <span className="error-message">Passwords must match!</span> : <></> }
            </div>
            <input type="password" name="password_confirmation" value={confirmationPassword} 
                    onChange={ (e) => onChange(e) } 
                    onBlur={ () => onBlur() } />
        </section>
    )
}

export default confirmPassword
