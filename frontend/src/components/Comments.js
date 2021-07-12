import React from 'react'


class Comments extends React.Component {
    initialState = { comments: [], recipeId: "" }

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
            this.setState({comments, recipeId})
        } else {
            window.location.replace('/error')
        }
    }

    renderComment(comment) {
        return (
            <li key={comment.id}>
                <p><strong>{comment.username}</strong> said:</p>
                <p>
                    {comment.comment}
                </p>
                <p><strong>Comment Ref: </strong>{comment.id} | <strong>Date: </strong>{comment.created_at}</p>
            </li>
        )
    }



    render() {
        const { comments } = this.state
        return(
            <div className="comments-container">
                <ul>
                    { comments.map((comment) => this.renderComment(comment))}
                    
                        {/* time / date of comment */}
                        {/* pass in reference id */}
                </ul>
            </div>
        )
    }
}

export default Comments