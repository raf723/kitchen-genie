import React from 'react'
import '../css/home.css'

// Routing ingredients
import { Link, withRouter } from 'react-router-dom'

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
    ingredients: [],
    results: [
      {
          "id": 649419,
          "title": "Leche Flan (Caramel Flan)",
          "image": "https://spoonacular.com/recipeImages/649419-312x231.jpg",
          "imageType": "jpg",
          "usedIngredientCount": 2,
          "missedIngredientCount": 2,
          "missedIngredients": [
              {
                  "id": 1125,
                  "amount": 8,
                  "unit": "large",
                  "unitLong": "larges",
                  "unitShort": "large",
                  "aisle": "Milk, Eggs, Other Dairy",
                  "name": "egg yolks",
                  "original": "8 larges egg yolks",
                  "originalString": "8 larges egg yolks",
                  "originalName": "s egg yolks",
                  "metaInformation": [],
                  "meta": [],
                  "image": "https://spoonacular.com/cdn/ingredients_100x100/egg-yolk.jpg"
              },
              {
                  "id": 2050,
                  "amount": 1,
                  "unit": "teaspoon",
                  "unitLong": "teaspoon",
                  "unitShort": "tsp",
                  "aisle": "Baking",
                  "name": "vanilla extract",
                  "original": "1 teaspoon vanilla extract",
                  "originalString": "1 teaspoon vanilla extract",
                  "originalName": "vanilla extract",
                  "metaInformation": [],
                  "meta": [],
                  "image": "https://spoonacular.com/cdn/ingredients_100x100/vanilla-extract.jpg"
              }
          ],
          "usedIngredients": [
              {
                  "id": 1077,
                  "amount": 1,
                  "unit": "",
                  "unitLong": "",
                  "unitShort": "",
                  "aisle": "Milk, Eggs, Other Dairy",
                  "name": "full-fat milk",
                  "original": "1 tall can Full Cream Evaporated Milk",
                  "originalString": "1 tall can Full Cream Evaporated Milk",
                  "originalName": "tall can Full Cream Evaporated Milk",
                  "metaInformation": [
                      "canned"
                  ],
                  "meta": [
                      "canned"
                  ],
                  "extendedName": "canned full-fat milk",
                  "image": "https://spoonacular.com/cdn/ingredients_100x100/milk.png"
              },
              {
                  "id": 1077,
                  "amount": 0.5,
                  "unit": "can",
                  "unitLong": "cans",
                  "unitShort": "can",
                  "aisle": "Milk, Eggs, Other Dairy",
                  "name": "milk",
                  "original": "1/2 can Sweetened Condense Milk",
                  "originalString": "1/2 can Sweetened Condense Milk",
                  "originalName": "Sweetened Condense Milk",
                  "metaInformation": [
                      "sweetened"
                  ],
                  "meta": [
                      "sweetened"
                  ],
                  "extendedName": "canned sweetened milk",
                  "image": "https://spoonacular.com/cdn/ingredients_100x100/milk.png"
              }
          ],
          "unusedIngredients": [],
          "likes": 1
      }
    ]
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
    const spoonacular = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsArray}&number=30&ranking=1&ignorePantry=true&apiKey=807da9ccc8384fb7b7ef86071f9b8f79`)
    const recipes = await spoonacular.json()

    this.props.history.push({
      pathname: '/results',
      state: { results: recipes }
    })
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
          {/* <Link
            to={{
              pathname: "/results",
              state: { results: this.state.results }
            }}>GO</Link> */}
        </div>

        <button id="random-recipe-button">Serve me up!</button>
      </div>
    )
  }
}

export default withRouter(Home)
