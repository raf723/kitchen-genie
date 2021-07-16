export function SaveButton({onSave, isCurrentlySaved, size=24}) {
    return (
        <span id="favourite-button" className= { isCurrentlySaved ? "active-save-button" : "inactive-save-button"} onClick={() => onSave()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={`${size}px`} height={`${size}px`} viewBox={`0 0 24 24`} fill="pink" stroke="darkred" strokeWidth=".9" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </span>
    )
}

export default SaveButton
