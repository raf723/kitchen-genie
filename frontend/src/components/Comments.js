import React from 'react'
import { format } from 'date-fns'
import '../css/comments.css'
import CommentInput from './CommentInput'

class Comments extends React.Component {
    initialState = { 
        comments: [], 
        recipeId: "",
        componentStatus: "Loading..."
    }

    state = this.initialState

    async componentWillMount() {

        const { recipeId } = this.props

        const apiResponse = await fetch(`${process.env.REACT_APP_URL}/comments/${recipeId}`, {
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
            <li key={comment.id}>
                <div className="comment-box2">
                    <p className="comment-header"><strong>{comment.username}</strong></p>
                    <p className="comment-body">
                        {comment.comment}
                    </p>
                    {/* <hr/> */}
                </div>



                <p className="comment-footer">
                    {/* <strong>Comment Ref: </strong>{comment.id} | <strong>Date: </strong> */}
                    {format(new Date(comment.created_at), 'PPPp')}
                </p>

            </li>
        )
    }

    render() {
        const { comments, componentStatus } = this.state
    
        return(
            <div>
                <div className="comments-container">
                    <h2>Comments ({comments.length})</h2>
                    <CommentInput userAuthenticated={this.props.userAuthenticated} recipeId={this.props.recipeId} />
                    <p className="comments-status">{componentStatus}</p>
                    <ul className="comments-list">
                        { comments.map((comment) => this.renderComment(comment))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Comments