import React from 'react'
import '../css/comment-input.css'

class InputComments extends React.Component {
    initialState = { comment: ""}
    
    state = {...this.initialState}
        
    async handleSubmit(e) {
        e.preventDefault()
        const { comment } = this.state
        const apiResponse = await fetch(`${process.env.REACT_APP_URL}/comment/${this.props.recipeId}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment })
        })

        const { response, newComment, createdAt }= await apiResponse.json()

        if (response === 'success') {
            this.props.handleNewComment({ newComment, createdAt })
            this.setState(this.initialState)
        } else if (response === 'unauthorized') {
            alert('You must be logged in to comment!')
            window.location.replace('/login')
        } else {
            window.location.replace('/error')
        }
    }

    autoGrow(element) {
        element.target.style.height = "5px";
        element.target.style.height = (element.target.scrollHeight)+"px";
    }

    renderCommentBox(userAuthenticated){
        const { comment } = this.state



        if (!!userAuthenticated) {
            return (
                <div id="comment-input-container">
                    <div className="comment-input-container">
                        <h3>Hi, <span className="user-prompt">{userAuthenticated.username}!</span> Leave a comment below!</h3>
                        <form onSubmit={(e) => this.handleSubmit(e)}>
                            <div className="comment-and-buttons">
                                <textarea name="comment" placeholder="Please enter a comment..." value={comment} className="comment-box-valid" onInput={this.autoGrow} onChange={(e) => this.setState({comment: e.target.value})}/>
                                <div>
                                    <button className="cancel-button" type="button" value="Cancel" name="cancel" onClick={() => this.setState({ comment: "" })}>Cancel</button>
                                    <button className="post-button" type="submit" name="post" value="Post">Post</button>
                                </div>                        
                            </div>
                        </form>
                    </div>
                </div>
            )
        } else {
            return (
                <div id="comment-input-container">
                    <div className="comment-input-container">
                        <h3>Please leave a comment below!</h3>
                        <div className="comment-and-buttons">
                            <textarea className="comment-box-invalid" value={comment} name="comment" placeholder="You must be logged in to leave a comment." disabled/>
                            <div>
                                <button className="sign-up-button" type="button" name="sign-up-butto" onClick={() =>  window.location.href='/register'}>Sign Up</button>
                                <button className="log-in-button" type="button" name="log-in-button" onClick={() =>  window.location.href='/login'}>Log In</button>
                            </div>                        
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        const { userAuthenticated } = this.props
        return (
            this.renderCommentBox(userAuthenticated)
        )
    }
}

export default InputComments
