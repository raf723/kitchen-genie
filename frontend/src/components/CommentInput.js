import React from 'react'
import { Link } from 'react-router-dom'
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

    renderCommentBox(userAuthenticated){
        const { comment } = this.state
        if (!!userAuthenticated) {
            return (
                <div className="comment-input-container">
                    <h3 className="user-prompt">Hi, {userAuthenticated.username}! Leave a comment here!</h3>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                    <textarea name="comment" value={comment} className="comment-box" onChange={(e) => this.setState({comment: e.target.value})}/>
                    <div className="comment-buttons">
                        <button type="submit" name="post" value="Post">Submit</button>
                        <button type="button" value="Cancel" name="cancel" onClick={() => this.setState({ comment: "" })}>Cancel</button>
                    </div>
                    </form>
                </div>
            )
        } else {
            return <h3 className="user-prompt">Log in <Link className="login-link" to="/login">here</Link> to add a comment!</h3>
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
