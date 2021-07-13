import React from 'react'
import '../css/input-comments.css'
import Comments from './Comments'

// If user is logged in then run Comments, if not then run CommentsLogin


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
                <div>
                    <div className="comments">
                        <p>Username</p>
                        <form onSubmit={(e) => this.handleSubmit(e)}>
                        <textarea name="comment" value={comment} placeholder="Add a comment..." className="commentText" onChange={(e) => this.setState({comment: e.target.value})}></textarea>
                        <button type="submit" name="post" value="Post">Submit</button>
                        <button type="button" value="Cancel" name="cancel" onClick={() => this.setState({ comment: "" })}>Cancel</button>
                        </form>
                    </div>
                </div>
            )
        } else {
            return <p>Log in to comment!</p>
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
