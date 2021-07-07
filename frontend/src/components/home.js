import React from 'react'
import '../css/home.css'

class Home extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    ingredients: ''
  }

  // Set state to initialState
  state = this.initialState

  searchHandler = async() => {
    const ingredients = this.state.ingredients
    const ingredientsArray = ingredients.split(',').map(ingredient => ingredient.trim())

    // POST request to server
    const request = await fetch(`http://localhost:8080/search`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: ingredientsArray })
    })
    
    // Server response
    const { response } = await request.json()
  }

  render() {
    return (
        <div className="home-container">
          <h1>Supercook</h1>

          <div id="search-container">
            <input
              name="search"
              placeholder="Find a recipe!"
              value={ this.state.ingredients }
              onChange={ (e) => this.setState({ ingredients: e.target.value }) }></input>
            <button onClick={ () => this.searchHandler() }>GO</button>
          </div>

          <button id="random-recipe-button">Serve me up!</button>
        </div>
    )
  }
}

export default Home
