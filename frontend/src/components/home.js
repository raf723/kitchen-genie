import React from 'react'
import '../css/home.css'

// Routing ingredients
import { Link, withRouter } from 'react-router-dom'

// Component imports
import Search from './reusable/search'



//------------------------------ Home component ------------------------------//
class Home extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    value: ''
  }

  // Set state to initialState
  state = this.initialState

  // Set state of value to selected suggestion
  onChange = (newValue) => {
    this.setState({ value: newValue })
  }

  // Search for recipes via ingredients
  searchHandler = async() => {
    const ingredients = this.state.value
    const ingredientsArray = ingredients.split(',').map(ingredient => ingredient.trim())

    // Get recipes from Spoonacular
    const spoonacular = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsArray}&number=30&ranking=1&ignorePantry=true&apiKey=d45bc24e8cc84723b6786271e498854f`)
    const recipes = await spoonacular.json()
    console.log(recipes)

    this.props.history.push({
      pathname: '/results',
      state: { results: recipes }
    })
  }

  render() {
    return (
      <div className="home-container">
        <h1>Supercook</h1>

        <div id="search-container">
          <Search onChange={ this.onChange } />
          <button onClick={ () => this.searchHandler() }>GO</button>
        </div>

        <button id="random-recipe-button">Serve me up!</button>
      </div>
    )
  }
}

export default withRouter(Home)
