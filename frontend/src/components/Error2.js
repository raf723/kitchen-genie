import '../css/error-page.css'
import spilt_milk from '../spilt-milk.gif'

export function Error() {
    return (
        <div className="error-page-container">
            <h1 className="error-header"> Error!!! </h1>
            <div className="mockcard" onClick={() => window.location.replace('/')} title="Reload! Let's try again!">
                <div className="mockcard-top">
                    <img  className="error-image" src={spilt_milk} alt="spilt milk" />
                </div>
                <div>
                    <p className="error-body">Something went wrong :( <br/> Click here to reset the app</p>
                    <span className="broken-heart-image"  title="Click to heal a broken heart">
                        💔
                    </span>
                </div>
            </div>
       </div>
    )
}

export default Error
