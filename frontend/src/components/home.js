import React from 'react'
import '../css/home.css'

// Autosuggest ingredients
import Autosuggest from 'react-autosuggest'
import ingredients from '../ingredients.json'



//------------------------------ Global functions ------------------------------//
function getSuggestions(value) {
  // Regex function
  const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Remove whitespace and invalid characters from input value
  const escapedValue = escapeRegexCharacters(value.trim())

  // If result is an empty string return an empty array i.e. no suggestions
  if (escapedValue === '') return []

  // Function to check one string against another
  const regex = new RegExp('^' + escapedValue, 'i')

  // Filter through the array of ingredients to return an array of suggested ingredients
  return ingredients.filter(ingredient => regex.test(ingredient.name)).slice(0, 4)
}



//------------------------------ Home component ------------------------------//
class Home extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    value: '',
    suggestions: [],
    ingredients: []
  }

  // Set state to initialState
  state = this.initialState

  // Set state of value to selected suggestion
  onChange = (event, { newValue, method }) => {
    this.setState({ value: newValue })
  }

  // Set input value to selected suggestion
  getSuggestionValue = suggestion => suggestion.name

  // Render element for each suggestion
  renderSuggestion = suggestion => <span className="suggestion-span">{ suggestion.name }</span>

  // Set state of suggestions to filtered array
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ suggestions: getSuggestions(value) })
  }

  // Set state of suggestions to empty array
  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  searchHandler = async() => {
    const ingredients = this.state.value
    const ingredientsArray = ingredients.split(',').map(ingredient => ingredient.trim())

    // Get recipes from Spoonacular
    const spoonacular = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsArray}&number=30&ranking=2&ignorePantry=true&apiKey=807da9ccc8384fb7b7ef86071f9b8f79`)
    const recipes = await spoonacular.json()
    console.log(recipes)
  }

  render() {
    const { value, suggestions } = this.state;

    // Set properties for Autosuggest's input
    const inputProps = {
      placeholder: "Find a recipe!",
      value,
      onChange: this.onChange
    }

    return (
      <div className="home-container">
        <h1>Supercook</h1>

        <div id="search-container">
          <Autosuggest
            suggestions={ suggestions }
            onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
            onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
            getSuggestionValue={ this.getSuggestionValue }
            renderSuggestion={ this.renderSuggestion }
            inputProps={ inputProps } />
          
          <button onClick={ () => this.searchHandler() }>GO</button>
        </div>

        <button id="random-recipe-button">Serve me up!</button>
      </div>
    )
  }
}

export default Home
