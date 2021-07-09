import React from 'react'
import '../css/results.css'

// Component imports
import Search from './reusable/Search'
import RecipeCard from './RecipeCard'

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
        <div id="results-search-container">
          <Search />
        </div>

        <div id="grid-container">
          { results.map(recipe => <div className="card-container" key={ recipe.id }>
            <RecipeCard
              id={ recipe.id }
              title={ recipe.title }
              image={ recipe.image }
              numMissingIngredients={ recipe.missedIngredientCount }
              numIngredients={ recipe.usedIngredientCount + recipe.missedIngredientCount }>
            </RecipeCard>
          </div>) }
        </div>
      </div>
    )
  }
}

export default Results
