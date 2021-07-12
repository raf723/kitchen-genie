import React from 'react'
import { format } from 'date-fns'
import '../css/comments.css'

class Comments extends React.Component {
    initialState = { 
        comments: [], 
        recipeId: "",
        componentStatus: "Loading..."
    }

    state = this.initialState

    async componentWillMount() {
        const { recipeId } = this.props
        const apiResponse = await fetch(`http://localhost:8080/comments/${recipeId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        })

        const { response, comments }= await apiResponse.json()

        if (response === 'success') {
            if ( comments.length === 0) {
                this.setState({comments, recipeId, componentStatus: 'No comments yet!'})
            } else {
                this.setState({comments, recipeId, componentStatus: ''})
            }
        } else {
            window.location.replace('/error')
        }
    }

    renderComment(comment) {
        return (
            <li className="comment" key={comment.id}>
                <p className="comment-header"><strong><span className="highlight">{comment.username}</span></strong> said:</p>
                <div className="separator"><hr/></div>
                <p className="comment-body">
                    {comment.comment}
                </p>
                <hr/>
                <p className="comment-footer">
                    <strong>Comment Ref: </strong>{comment.id} | <strong>Date: </strong><span className="highlight">{format(new Date(comment.created_at), 'MM/dd/yyyy h:mmbbb ')}</span>
                </p>
            </li>
        )
    }

    render() {
        const { comments, componentStatus } = this.state
        return(
            <div className="comments-container">
                <h2>Comments ({comments.length})</h2>
                <p className="comments-status">{componentStatus}</p>
                <ul className="comments-list">
                    { comments.map((comment) => this.renderComment(comment))}
                </ul>
            </div>
        )
    }
}

export default Comments