import React from 'react'


class Comments extends React.Component {
    initialState = { comments: [], recipeID: "", loggedInUser: {} }

    componentWillUnmount() {
        // take recipeID from props
        // fetch comments from backend
        // set loggedInUser from backend
        // insert commnets from backend into state
    }

    render() {
        return(
            <div className="comments-container">
                <ul>
                    <li>
                        {/* comment body */}
                        {/* which user made a comment */}
                        {/* time / date of comment */}
                        {/* pass in reference id */}
                    </li>
                </ul>
            </div>
        )
    }
}

export default Comments