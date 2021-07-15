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

  renderCommentBox(userAuthenticated) {
    const { comment } = this.state
    
    if (!!userAuthenticated) {
      return (
        <div className="comment-input-container">
          <h3 className="user-prompt">Hi, { userAuthenticated.username }! Leave a comment here!</h3>
          <form onSubmit={(e) => this.handleSubmit(e)}>
          <textarea
            name="comment"
            placeholder="Please enter a comment..."
            value={ comment }
            className="comment-box"
            onChange={ (e) => this.setState({ comment: e.target.value }) }/>
          <div className="comment-buttons">
            <button type="submit" name="post" value="Post">Submit</button>
            <button type="button" value="Cancel" name="cancel" onClick={ () => this.setState({ comment: "" }) }>Cancel</button>
          </div>
          </form>
        </div>
      )
    } else {
      return (
        <div className="comment-input-container">
          <h3>Please leave a comment below!</h3>
          <div className="comment-and-buttons">
            <textarea className="comment-box3" value={comment} name="comment" placeholder="You must be logged in to leave a comment." disabled/>
            <div>
              <button className="sign-up-button" type="button" name="sign-up-butto" onClick={() =>  window.location.href='/register'}>Sign Up</button>
              <button className="log-in-button" type="button" name="log-in-button" onClick={() =>  window.location.href='/login'}>Log In</button>
            </div>                        
          </div>
        </div>
      )
    }
  }

  render() {
    return this.renderCommentBox(this.props.userAuthenticated)
  }
}

export default InputComments
