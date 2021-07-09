import React from 'react'
import '../css/comments.css'

// If user is logged in then run Comments, if not then run CommentsLogin


class Comments extends React.Component {
    initialState = { comment: "", userId: "", recipeId: "" }
    state = {...this.initialState}
    
    resetText() {
        document.querySelector(".commentText").value = ""
        this.setState({ comment: "" });
    }
    
    render() {
        return (
            <div>
                <div className="comments">
                    <p>Username</p>
                    <textarea placeholder="Add a comment..." className="commentText" onChange={(e) => this.setState({comment: e.target.value})}>{this.state.comment}</textarea>
                    <button>Post</button>
                    <button value="Clear" onClick={() => this.resetText()}>Cancel</button>
                </div>
                {/* Display comments */}
                <h2>Comments (10)</h2>
            </div>
        )
    }
}

export default Comments
            
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