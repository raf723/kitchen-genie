import React from 'react'
import { Link } from 'react-router-dom'
import '../css/comment-input.css'


class InputComments extends React.Component {
    initialState = { comment: ""}
    state = {...this.initialState}
        
    async handleSubmit(e) {
        e.preventDefault()
        const { comment } = this.state
        const apiResponse = await fetch(`http://localhost:8080/comment/${this.props.recipeId}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment })
        })

        const { response }= await apiResponse.json()

        if (response === 'success') {
            this.setState(this.initialState)
        } else if ( response === 'unauthorized') {
            alert('You must be logged in to comment!')
            window.location.replace('/login')
        } else {
            window.location.replace('/error')
        }
    }

    renderCommentBox(loggedInUser){
        const { comment } = this.state
        if (!!loggedInUser) {
            return (
                <div className="comment-box">
                    <h3>Hi, {loggedInUser.username}! Leave a comment here!</h3>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                    <textarea name="comment" value={comment} className="commentText" onChange={(e) => this.setState({comment: e.target.value})}/>
                    <div className="comment-buttons">
                        <button type="submit" name="post" value="Post">Submit</button>
                        <button type="button" value="Cancel" name="cancel" onClick={() => this.setState({ comment: "" })}>Cancel</button>
                    </div>
                    </form>
                </div>
            )
        } else {
            return <p>Log in <Link className="login-link" to="/login">here</Link> to add a comment!</p>
        }
    }

    render() {
        const { loggedInUser } = this.props
        return (
            this.renderCommentBox(loggedInUser)
        )
    }
}

export default InputComments
