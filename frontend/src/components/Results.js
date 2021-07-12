import React from 'react'
import '../css/results.css'

// Component imports
import Search from './reusable/Search'
import RecipeCard from './RecipeCard'

// Asset imports
import DeleteIcon from '../delete.png'

const mealTypes = ['Appetizer', 'Beverage', 'Bread', 'Breakfast', 'Dessert', 'Drink', 'Fingerfood', 'Main course', 'Marinade', 'Salad', 'Sauce', 'Side dish', 'Snack', 'Soup']
const diets = ['Gluten free', 'Ketogenic', 'Pescetarian', 'Vegan', 'Vegetarian']
const cuisines = ['African', 'American', 'British', 'Caribbean', 'Chinese', 'French', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Spanish', 'Thai', 'Vietnamese']
const intolerances = ['Dairy', 'Egg', 'Grain', 'Gluten', 'Nut', 'Peanut', 'Seafood', 'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree', 'Wheat']

class Results extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    ingredients: this.props.location.state.ingredients
  }

  // Set state to initialState
  state = this.initialState

  render() {
    const { results } = this.props.location.state

    return (
      <div id="results-container">
        <div id="checkbox-container">
          <div className="subgroup-container">
            <h2>Meal type</h2>
            { mealTypes.map(mealType => <div><input type="checkbox" value={ mealType }/><span> { mealType }</span></div> )}
          </div>

          <div className="subgroup-container">
            <h2>Dietary requirement</h2>
            { diets.map(diet => <div><input type="checkbox" value={ diet }/><span> { diet }</span></div> )}
          </div>

          <div className="subgroup-container">
            <h2>Cuisines</h2>
            { cuisines.map(cuisine => <div><input type="checkbox" value={ cuisine }/><span> { cuisine }</span></div> )}
          </div>

          <div className="subgroup-container">
            <h2>Intolerances</h2>
            { intolerances.map(intolerance => <div><input type="checkbox" value={ intolerance }/><span> { intolerance }</span></div> )}
          </div>
        </div>
 
        <div id="checkbox-adjacent-container">
          <div id="autosuggest-container">
            <Search />
            <button onClick={ () => this.searchHandler() }>GO</button>
          </div>

          <div id="ingredients-container">
            { this.state.ingredients.map(ingredient => 
              <button className="ingredient-button" key={ ingredient } onClick={ () => this.removeIngredient(ingredient) }>
                { ingredient }<img className="delete-icon" alt="delete-ingredient" src={ DeleteIcon }/>
              </button>
            )}
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
      </div>
    )
  }
}

export default Results
