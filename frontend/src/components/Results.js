import React from 'react'
import '../css/results.css'

import Recipe from './RecipeCard'

class Results extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
  }

  // Set state to initialState
  state = this.initialState

  render() {
    const { results } = this.props.location.state

    return (
      <div id="grid-container">
        { results.map(recipe => <div className="card-container" key={ recipe.id }>
          <Recipe
            id={ recipe.id }
            title={ recipe.title }
            image={ recipe.image }
            numMissingIngredients={ recipe.missedIngredientCount }
            numIngredients={ recipe.usedIngredientCount + recipe.missedIngredientCount }
            link={ 'idk' }>
          </Recipe>
        </div>) }
      </div>
    )
  }
}

export default Results