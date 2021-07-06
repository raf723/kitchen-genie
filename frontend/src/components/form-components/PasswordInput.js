export function PasswordInput({password, isPasswordValid, isTouched, errorMsg, onChange, onBlur}) {
    return (
        <section className="password-input">
            <div>
                <label htmlFor="password">Password: </label>
                { isTouched && !isPasswordValid ? <span className="error-message">{errorMsg}</span> : <></> }
            </div>
            <input type="password" name="password" value={password} 
                    onChange={(e) => onChange(e)}
                    onBlur={() => onBlur()} />
        </section>
    )
}

export default PasswordInput