import React from 'react'

// Styling imports
import '../css/results.css'
import '../css/save-button.css'

// Component imports
import Search from './reusable/Search'
import RecipeCard from './RecipeCard'
import SaveButton from './SaveButton'

// Asset imports
import DeleteIcon from '../delete.png'

class Results extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    value: '',
    ingredients: this.props.location.state.ingredients,
    results: this.props.location.state.results,
    savedRecipeIds: [],
    displaySaveFeature: false,
    pageStatus: '',
  }

  // Set state to initialState
  state = this.initialState

  async componentDidMount() { 
    /*Routine to Identify which of the recipies displayed in the results were previously saved by the user */
    const apiResponse = await fetch(`${process.env.REACT_APP_URL}/myrecipes/id-only`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    const { response, savedRecipeIds } = await apiResponse.json()

    if (response === 'success') this.setState({ savedRecipeIds, displaySaveFeature: true })
    else if (response !== 'unauthorized') window.location.replace('/error')

    /*Routine to check and notify user if there is some external problem with the website (e.g. site has exceeded the maximum number of calls to spoonacular)*/
    const { results } = this.props.location.state
    if (!Array.isArray(results)) this.setState({pageStatus: 'The service is temporarily down! Please try again later.'})
  }

  // Get recipes from Spoonacular
  getRecipes = async(ingredients = this.state.ingredients) => {
    const spoonacular = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=12&ranking=2&apiKey=d45bc24e8cc84723b6786271e498854f`)
    const recipes = await spoonacular.json()
    this.setState({ results: recipes })
  }

  // Set state of value to selected suggestion
  onChange = (newValue) => this.setState({ value: newValue })

  // If user hits Enter, add to state's ingredients array and clear input
  onKeyPress = async() => {
    const { value, ingredients } = this.state

    // Push input value to this.state's array of ingredients
    const updatedIngredients = ingredients
    if (value !== '' & !ingredients.includes(value)) updatedIngredients.push(value.trim())
    this.setState({ ingredients: updatedIngredients })
    this.getRecipes()

    // Clear input
    this.setState({ value: '' })
  }

  // Remove ingredient from this.state's ingredients on user click
  removeIngredient = (deletedIngredient) => {
    const filteredIngredients = this.state.ingredients.filter(ingredient => ingredient !== deletedIngredient)
    this.setState({ ingredients: filteredIngredients }, () => {
      this.getRecipes(this.state.ingredients)
    })
  }

  // Save recipe button
  handleSaveRecipe = async (recipeId, toSave=true) => {
    const apiResponse = await fetch(`http://localhost:8080/save/${recipeId}/${ toSave ? 'save' : 'unsave'}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    const { response } = await apiResponse.json()

    if (response === 'success') {
      let { savedRecipeIds } = this.state
      if (toSave) this.setState({ savedRecipeIds: savedRecipeIds.concat(recipeId) })
      else this.setState({ savedRecipeIds: savedRecipeIds.filter((id) => id !== recipeId) })
      this.setState(savedRecipeIds)
    } else if (response === 'unauthorized') {
        alert("Unauthorized access!\nYou must log in to access saved recipes!")
        window.location.replace('/login')
    } else window.location.replace('/error')
  }

  render() {
    const { savedRecipeIds, displaySaveFeature, pageStatus, results } = this.state

    return (
      <div id="results-container">
        {/* Placeholder and input */}
        <div id="search-container">
          <span id="title-span">{ this.state.value !== '' && `Hit 'Enter' to add an ingredient!` }</span>
          <div id="autosuggest-container">
            <Search value={ this.state.value } onChange={ this.onChange } onKeyPress={ this.onKeyPress }/>
          </div>
        </div>

        {/* Buttons for when ingredients are added */}
        <div id="ingredients-container">
          <p>{pageStatus}</p>
          { this.state.ingredients.map(ingredient => 
            <button className="ingredient-button" key={ ingredient } onClick={ () => this.removeIngredient(ingredient) }>
              { ingredient }<img className="delete-icon" alt="delete-ingredient" src={ DeleteIcon }/>
            </button>
          )}
        </div>

        {/* Grid of cards (recipes) */}
        { this.state.results.length > 0 && <div id="grid-container">
          {/* For each recipe, render a recipe card and save button (only if user is authenticated i.e. displaySaveFeature is true) */}
          { Array.isArray(results) && results.map(recipe => <div className="card-container" key={ recipe.id }>
            { displaySaveFeature &&
              <SaveButton
                onSave={ () => this.handleSaveRecipe(recipe.id, !savedRecipeIds.includes(recipe.id)) } 
                isCurrentlySaved={ savedRecipeIds.includes(recipe.id) } />
            }
            <RecipeCard recipe={ recipe } forPage="results" />
          </div>) }
        </div> }

        {/* If number of recipes is 0, show a no results message */}
        { this.state.results.length === 0 && <span id="no-results-span">Oh no! We couldn't find any recipes!</span> }
      </div>
    )
  }
}

export default Results
