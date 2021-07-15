import React from 'react'

// Styling imports
import '../css/home.css'

// Routing ingredients
import { withRouter } from 'react-router-dom'

// Component imports
import Search from './reusable/Search'

// Asset imports
import DeleteIcon from '../delete.png'

class Home extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    value: '', // Search input's value
    ingredients: [] // Array of ingredients selected by the client
  }

  // Set state to initialState
  state = this.initialState

  // Set state of value to selected suggestion
  onChange = (newValue) => this.setState({ value: newValue })

  // If user hits Enter, add to state's ingredients array and clear input
  onKeyPress = () => {
    const { value, ingredients } = this.state

    // Push input value to this.state's array of ingredients
    const updatedIngredients = ingredients
    if (value !== '' && !ingredients.includes(value)) updatedIngredients.push(value.trim())
    this.setState({ ingredients: updatedIngredients })

    // Clear input
    this.setState({ value: '' })
  }

  // Remove ingredient from this.state's ingredients on user click
  removeIngredient = (deletedIngredient) => this.setState({ ingredients: this.state.ingredients.filter(ingredient => ingredient !== deletedIngredient) })

  // Search for recipes via ingredients
  searchHandler = async() => {
    // Get recipes from Spoonacular
    const spoonacular = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${this.state.ingredients}&number=12&ranking=1&ignorePantry=true&apiKey=${process.env.REACT_APP_API_KEY}`)
    const recipes = await spoonacular.json()

    // Pass data another parent component (page)
    this.props.history.push({
      pathname: '/results',
      state: { 
        results: recipes,
        ingredients: this.state.ingredients
      }
    })
  }

  // Get random recipe from API and navigate to recipe page
  serveRecipe = async() => {
    const spoonacular = await fetch(`https://api.spoonacular.com/recipes/random?number=1&apiKey=${process.env.REACT_APP_API_KEY}`)
    const responseObject = await spoonacular.json()
    const randomRecipe = responseObject.recipes[0]
    // Navigate to recipe page and pass recipe data
    this.props.history.push({
      pathname: '/recipe',
      state: {
        id: randomRecipe.id,
        image: randomRecipe.image
      }
    })
  }

  render() {
    return (
      <div id="home-container">
        <h1>Supercook</h1>

        {/* Placeholder, input and search button */}
        <div id="search-container">
          <span id="title-span">{ this.state.value !== '' && `Hit 'Enter' to add an ingredient!` }</span>
          <div id="autosuggest-container">
            <Search value={ this.state.value } onChange={ this.onChange } onKeyPress={ this.onKeyPress }/>

            {/* Disbale the search button if ingredients array is empty */}
            <button
              id={ this.state.ingredients.length !== 0 ? "green-button" : "grey-button" }
              className="search-button"
              onClick={ () => this.searchHandler() }>
                GO
            </button>
          </div>
        </div>

        {/* Buttons for when ingredients are added */}
        <div id="ingredients-container">
          { this.state.ingredients.map(ingredient => 
            <button className="ingredient-button" key={ ingredient } onClick={ () => this.removeIngredient(ingredient) }>
              { ingredient }<img className="delete-icon" alt="delete-ingredient" src={ DeleteIcon }/>
            </button>
          )}
        </div>
        <button id="random-recipe-button" onClick={this.serveRecipe}>Serve me up!</button>
      </div>
    )
  }
}

export default withRouter(Home)
