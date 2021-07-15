import React from 'react'
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
    // Push input value to this.state's array of ingredients
    const updatedIngredients = this.state.ingredients
    if (this.state.value !== '') updatedIngredients.push(this.state.value.trim())
    this.setState({ ingredients: updatedIngredients })

    // Clear input
    this.setState({ value: '' })
  }

  // Remove ingredient from this.state's ingredients on user click
  removeIngredient = (deletedIngredient) => this.setState({ ingredients: this.state.ingredients.filter(ingredient => ingredient !== deletedIngredient) })

  // Search for recipes via ingredients
  searchHandler = async() => {
    // Convert this.state's ingredients to comma separated string
    const ingredientsArray = this.state.ingredients.join(',')

    // Get recipes from Spoonacular
    const spoonacular = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsArray}&number=30&ranking=1&ignorePantry=true&apiKey=${process.env.REACT_APP_API_KEY}`)

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

        <div id="search-container">
          <Search value={ this.state.value } onChange={ this.onChange } onKeyPress={ this.onKeyPress }/>
          <button onClick={ () => this.searchHandler() }>GO</button>
        </div>

        {/* Ingredients buttons */}
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
