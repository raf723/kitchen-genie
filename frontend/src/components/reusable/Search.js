import React from 'react'
import '../../css/search.css'

// Autosuggest ingredients
import Autosuggest from 'react-autosuggest'
import ingredients from '../../ingredients.json'



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

  // Filter through the array of ingredients to return an array of suggested ingredients (4 suggestions max)
  return ingredients.filter(ingredient => regex.test(ingredient.name)).slice(0, 4)
}



class Search extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    value: '',
    suggestions: []
  }

  // Set state to initialState
  state = this.initialState

  // On input change
  onChange = (event, { newValue, method }) => {
    this.setState({ value: newValue })
    this.props.onChange(newValue)
  }

  // If user hits Enter, pass true to parent and clear input
  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Execute parent function
      this.props.onKeyPress()

      // Clear input
      this.setState({ value: '' })
    }
  }

  // On suggested value click
  getSuggestionValue = suggestion => suggestion.name

  // Render element for each suggestion
  renderSuggestion = suggestion => <span className="suggestion-span">{ suggestion.name }</span>

  // Set state of suggestions to filtered array
  onSuggestionsFetchRequested = ({ value }) => this.setState({ suggestions: getSuggestions(value) })

  // Set state of suggestions to empty array
  onSuggestionsClearRequested = () => this.setState({ suggestions: [] })

  render() {
    const { value, suggestions } = this.state;

    // Set properties for Autosuggest's input
    const inputProps = {
      placeholder: "Search for an ingredient and hit 'Enter'!",
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      value
    }

    return (
      <Autosuggest
          suggestions={ suggestions }
          onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
          onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
          getSuggestionValue={ this.getSuggestionValue }
          renderSuggestion={ this.renderSuggestion }
          inputProps={ inputProps } />
    )
  }
}

export default Search
