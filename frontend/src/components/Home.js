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
    const ingredients = this.state.ingredients.join(',')

    // Get recipes from Spoonacular
    const spoonacular = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=12&ranking=2&apiKey=f1e60ea98b204bac9657574150fa57ec`)
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

        <button id="random-recipe-button">Serve me up!</button>
      </div>
    )
  }
}

export default withRouter(Home)
