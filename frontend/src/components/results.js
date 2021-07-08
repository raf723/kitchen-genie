import React from 'react'
import '../css/results.css'

import { useLocation } from 'react-router-dom'

class Results extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
  }

  // Set state to initialState
  state = this.initialState

  render() {
    const { results } = this.props.location.state

    return (
      <div>
        { results.map(recipe => <p key={recipe.id}>{ recipe.title }</p>) }
      </div>
    )
  }
}

export default Results
