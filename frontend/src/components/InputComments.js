import React from 'react'
import '../css/input-comments.css'

// If user is logged in then run Comments, if not then run CommentsLogin


class InputComments extends React.Component {
    initialState = { comment: "", userId: "", recipeId: "" }
    state = {...this.initialState}
        
    handleSubmit(e) {
        e.preventDefault()
        
    }

    render() {
        const { comment } = this.state
        return (
            <div>
                <div className="comments">
                    <p>Username</p>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                      <textarea name="comment" value={comment} placeholder="Add a comment..." className="commentText" onChange={(e) => this.setState({comment: e.target.value})}></textarea>
                      <input type="submit" name="post" value="Post"/>
                      <input type="button" value="Cancel" name="cancel" onClick={() => this.setState({ comment: "" })} />
                    </form>
                </div>
                {/* Display comments */}
                <h2>Comments (10)</h2>
            </div>
        )
    }
}

export default InputComments
            
            // class Comments extends React.Component {
            //     render() {
            //         return (
            //             <div className="Comments">
            //             <h2>Comments (10)</h2>
            //             {/* Display comments */}
            //             <textarea>
            //             <p>You need to either <button>Log-in</button>Or <button>Register</button> to post a comment.</p>
            //             </textarea>
            //             </div>
            //             )
            //         }
            //     }
                
            //     export default Comments