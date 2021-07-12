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
    value: '',
    ingredients: this.props.location.state.ingredients,
    results: this.props.location.state.results,
    type: [],
    diet: [],
    cuisine: [],
    intolerances: [],
    savedRecipeIds: [],
    displaySaveFeature: false
  }

  // Set state to initialState
  state = this.initialState

  async componentDidMount() {
    const myRecipes = await fetch(`http://localhost:8080/myrecipes/id-only`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    const { response, savedRecipeIds } = await myRecipes.json()

    if (response === 'success') this.setState({ savedRecipeIds, displaySaveFeature: true })
    else if (response !== 'unauthorized') window.location.replace('/error')
  }

  // Set state of value to selected suggestion
  onChange = (newValue) => this.setState({ value: newValue })

  // If user hits Enter, add to state's ingredients array and clear input
  onKeyPress = () => {
    // Push input value to this.state's array of ingredients
    const updatedIngredients = this.state.ingredients
    if (this.state.value !== '') updatedIngredients.push(this.state.value.trim())
    this.setState({ ingredients: updatedIngredients })

    // Clear input
    this.setState({ value: '' })
  }

  // Remove ingredient from this.state's ingredients on user click
  removeIngredient = (deletedIngredient) => this.setState({ ingredients: this.state.ingredients.filter(ingredient => ingredient !== deletedIngredient) })

  // Complex search using filters
  async getRecipes() {
    const spoonacular = await fetch(`https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${this.state.ingredients}&type=${this.state.type}&diet=${this.state.diet}&cuisine=${this.state.cuisine}&intolerances=${this.state.intolerances}&number=12&ranking=2&apiKey=f1e60ea98b204bac9657574150fa57ec`)
    const recipes = await spoonacular.json()
    this.setState({ results: recipes.results })
  }

  // Add/remove checkbox value from this.state on check/uncheck
  checkHandler = async (parameter, e) => {
    if (e.target.checked) {
      const updatedState = this.state[parameter]
      updatedState.push(e.target.value)
      this.setState({ [parameter]: updatedState })
    } else this.setState({ [parameter]: this.state[parameter].filter(value => value !== e.target.value) })
    this.getRecipes()
  }

  handleSaveRecipe = async (recipeId, toSave=true) => {
    const apiResponse = await fetch(`http://localhost:8080/save/${recipeId}/${ toSave ? 'save' : 'unsave'}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    const { response } = await apiResponse.json()

    if (response === 'success') {
      let { savedRecipeIds } = this.state
      if (toSave) {
        this.setState({ savedRecipeIds: savedRecipeIds.concat(recipeId) })
      } else {
        this.setState({ savedRecipeIds: savedRecipeIds.filter((id) => id !== recipeId) })
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
    const results = this.state.results
    const {savedRecipeIds, displaySaveFeature} = this.state

    return (
      <div id="results-container">
        <div id="checkbox-container">
          <div className="subgroup-container">
            <h2>Meal type</h2>
            { mealTypes.map(mealType => <div key={ mealType }><input type="checkbox" value={ mealType } onChange={ (e) => this.checkHandler('type', e) }/><span> { mealType }</span></div> )}
          </div>

          <div className="subgroup-container">
            <h2>Diet</h2>
            { diets.map(diet => <div key={ diet }><input type="checkbox" value={ diet } onChange={ (e) => this.checkHandler('diet', e) }/><span> { diet }</span></div> )}
          </div>

          <div className="subgroup-container">
            <h2>Cuisine</h2>
            { cuisines.map(cuisine => <div key={ cuisine }><input type="checkbox" value={ cuisine } onChange={ (e) => this.checkHandler('cuisine', e) }/><span> { cuisine }</span></div> )}
          </div>

          <div className="subgroup-container">
            <h2>Intolerances</h2>
            { intolerances.map(intolerance => <div key={ intolerance }><input type="checkbox" value={ intolerance } onChange={ (e) => this.checkHandler('intolerances', e) }/><span> { intolerance }</span></div> )}
          </div>
        </div>
 
        <div id="checkbox-adjacent-container">
          <div id="autosuggest-container">
            <Search value={ this.state.value } onChange={ this.onChange } onKeyPress={ this.onKeyPress }/>
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
                && <SaveButton onSave={() => this.handleSaveRecipe(recipe.id, !savedRecipeIds.includes(recipe.id))} 
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
