import React from 'react'
import '../css/input-comments.css'

// If user is logged in then run Comments, if not then run CommentsLogin


class InputComments extends React.Component {
    initialState = { comment: ""}
    state = {...this.initialState}
        
    async handleSubmit(e) {
        e.preventDefault()
        const { comment } = this.state
        const apiResponse = await fetch(`http://localhost:8080/comment/${this.props.recipeId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment })
        })
    }

    render() {
        const { comment } = this.state
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
                {/* Display comments */}
                <h2>Comments (10)</h2>
            </div>
        )
    }
}

export default InputComments
