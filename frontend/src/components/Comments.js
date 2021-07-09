import React from 'react'
import '../css/comments.css'

// If user is logged in then run Comments, if not then run CommentsLogin


class Comments extends React.Component {
    render() {
        return (
            <div className="Comments">
                <h2>Comments (10)</h2>
                {/* Display comments */}
                <textarea></textarea>
                <button>Post</button>
                <button>Cancel</button>
            </div>
        )
    }
}

export default Comments

// class CommentsLogin extends React.Component {
//     render() {
//         return (
//             <div className="Comments">
//                 <h2>Comments (10)</h2>
//                 {/* Display comments */}
//                 <textarea>
//                     <p>You need to either <button>Log-in</button>Or <button>Register</button> to post a comment.</p>
//                 </textarea>
//             </div>
//         )
//     }
// }

// export default CommentsLogin