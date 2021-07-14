import React from 'react'
import '../css/results.css'
import '../css/save-button.css'

// Component imports
import Search from './reusable/Search'
import RecipeCard from './RecipeCard'
import SaveButton from './SaveButton'

// Asset imports
import DeleteIcon from '../delete.png'

const mealTypes = ['Appetizer', 'Beverage', 'Bread', 'Breakfast', 'Dessert', 'Drink', 'Fingerfood', 'Main course', 'Marinade', 'Salad', 'Sauce', 'Side dish', 'Snack', 'Soup']
const diets = ['Gluten free', 'Ketogenic', 'Pescetarian', 'Vegan', 'Vegetarian']
const cuisines = ['African', 'American', 'British', 'Caribbean', 'Chinese', 'French', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Spanish', 'Thai', 'Vietnamese']
const intolerances = ['Dairy', 'Egg', 'Grain', 'Gluten', 'Nut', 'Peanut', 'Seafood', 'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree', 'Wheat']

class Results extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    ingredients: this.props.location.state.ingredients,
    savedRecipeIds: [],
    displaySaveFeature: false
  }

  // Set state to initialState
  state = this.initialState

 async componentDidMount(){
  const apiResponse = await fetch(`http://localhost:8080/myrecipes`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

    const { response, recipes } = await apiResponse.json()
    const savedRecipeIds = recipes.map((recipe) => recipe.id)

    if (response === 'success') { 
      this.setState({savedRecipeIds, displaySaveFeature: true})
    } else if (response === 'unauthorized') {
      //do nothing
    } else {
      window.location.replace('/error')
    }
  }

  handleSaveRecipe = async (recipe, toSave=true) => {
    const apiResponse = await fetch(`http://localhost:8080/save/${ toSave ? 'save' : 'unsave' }`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe) 
    })

    const { response } = await apiResponse.json()

    if (response === 'success') {
      let { savedRecipeIds } = this.state
      if (toSave) {
        this.setState({ savedRecipeIds: savedRecipeIds.concat(recipe.id) })
      } else {
        this.setState({ savedRecipeIds: savedRecipeIds.filter((id) => id !== recipe.id) })
      }
      this.setState(savedRecipeIds)
    } else if (response === 'unauthorized') {
        alert("Unauthorized access!\nYou must log in to access saved recipes!")
        window.location.replace('/login')
    } else {
        window.location.replace('/error')
    }
  }


  render() {
    const { results } = this.props.location.state
    const {savedRecipeIds, displaySaveFeature} = this.state

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
              { 
                displaySaveFeature 
                && <SaveButton onSave={() => this.handleSaveRecipe(recipe, !savedRecipeIds.includes(recipe.id))} 
                isCurrentlySaved={savedRecipeIds.includes(recipe.id)}/>
              }
              <RecipeCard recipe={ recipe } forPage="results" />
            </div>) }
          </div>
        </div>
      </div>
    )
  }
}

export default Results
