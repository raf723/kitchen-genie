import React from 'react'
import '../css/comments.css'
import { format } from 'date-fns'
import CommentInput from './CommentInput'
import { withRouter } from 'react-router-dom'

class Comments extends React.Component {
  initialState = { 
    comments: [], 
    recipeId: "",
    componentStatus: "Loading..."
  }

  state = this.initialState

  // Get comments from database using recipeID
  async componentWillMount() {
    const { recipeId } = this.props

    const apiResponse = await fetch(`${process.env.REACT_APP_URL}/comments/${recipeId}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
    const { response, comments }= await apiResponse.json()

    // Set state of componentStatus depending on whether the current recipe has any comments stored in the database
    if (response === 'success') comments.length === 0 ? 
    this.setState({ componentStatus: 'No comments yet!' }) : this.setState({ componentStatus: '', comments: comments})
    else this.props.history.push('/error')
  }

  renderComment(comment) {
    return (
      <li key={ comment.id }>
        <div className="comment-box">
          <p className="comment-header"><strong>{ comment.username }</strong></p>
          <p className="comment-body">{ comment.comment }</p>
        </div>
        <p className="comment-footer">{format(new Date(comment.created_at), 'PPPp')}</p>
      </li>
    )
  }

  handleNewComment = (commentObject) => {
    const newCommentsArray = this.state.comments
    newCommentsArray.unshift({
      comment: commentObject.newComment,
      created_at: commentObject.createdAt,
      username: this.props.userAuthenticated.username
    })
    this.setState({ comment: newCommentsArray, componentStatus: "" })
  }

  render() {
    const { comments, componentStatus } = this.state

    return(
      <div id="comments-container">
        <div id="input-comments-container">
          <h2>Comments ({ comments.length })</h2>
          <CommentInput userAuthenticated={ this.props.userAuthenticated } recipeId={ this.props.recipeId } handleNewComment={ this.handleNewComment } />
        </div>

        <div id="get-comments-container">
          { comments.length === 0 && <p className="comments-status">{ componentStatus }</p> }
          <ul className="comments-list">
            { comments.map((comment) => this.renderComment(comment)) }
          </ul>
        </div>
      </div>
    )
  }
}

export default withRouter(Comments)
