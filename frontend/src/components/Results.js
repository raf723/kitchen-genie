import React from 'react'
import '../css/results.css'
import '../css/save-button.css'

// Component imports
import Search from './reusable/Search'
import RecipeCard from './RecipeCard'
import SaveButton from './SaveButton'

class Results extends React.Component {
  // Declare initialState object where all values are empty
  initialState = {
    savedRecipeIds: [],
    displaySaveFeature: false
  }

  // Set state to initialState
  state = this.initialState

 async componentDidMount(){
  const apiResponse = await fetch(`http://localhost:8080/myrecipes/id-only`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
    const { response, savedRecipeIds } = await apiResponse.json()

    if (response === 'success') { 
      this.setState({savedRecipeIds, displaySaveFeature: true})
    } else if (response === 'unauthorized') {
      //do nothing
    } else {
      window.location.replace('/error')
    }
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
    const { results } = this.props.location.state
    const {savedRecipeIds, displaySaveFeature} = this.state

    return (
      <div className="results-page-container">
        <div id="results-search-container">
          <Search />
        </div>

        <div id="grid-container">
          { results.map(recipe => <div className="card-container" key={ recipe.id }>
            { 
              displaySaveFeature 
              && <SaveButton onSave={() => this.handleSaveRecipe(recipe.id, !savedRecipeIds.includes(recipe.id))} 
              isCurrentlySaved={savedRecipeIds.includes(recipe.id)}/>
            }
            <Recipe recipe={recipe} forPage="results"/>
          </div>) }
        </div>
      </div>
    )
  }
}

export default Results
