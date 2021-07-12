import React from 'react'


class Comments extends React.Component {
    initialState = { comments: [], recipeId: "", loggedInUser: {} }

    async componentWillUnmount() {
        const { recipeId } = this.props
        const apiResponse = await fetch(`http://localhost:8080/comments/${recipeId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        })

        const { response, comments }= await apiResponse.json()

        console.log(response)
        
        if (response === 'success') {
            this.setState(this.initialState)
        } else {
            window.location.replace('/error')
        }


        // set loggedInUser from backend
        // insert comments from backend into state
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