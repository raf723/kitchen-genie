import { Component } from 'react'
import RecipeCard from './RecipeCard'
import '../css/saved-recipes.css'
import { withRouter } from 'react-router-dom'

export class SavedRecipes extends Component {
  initialState = {
    loggedInUser: {},
    savedRecipes: [],
    isCurrentlySaved: {},
    averageRatings: {},
    pageState: ["Loading...", "Calling our chefs...", "Searching the recipe books...", "It's worth the wait...", "Licking lips in anticipation..."][Math.floor(Math.random() * 5)],
  }

  state = this.initialState

  async componentDidMount() {
    const apiResponse = await fetch(`${process.env.REACT_APP_URL}/myrecipes`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const { response, recipes, loggedInUser } = await apiResponse.json()

    if (response === 'success') { 
      const isCurrentlySaved =  {}
      recipes.forEach((recipe) => isCurrentlySaved[recipe.id] = true)
      let pageState 
      if (recipes.length === 0) {pageState = 'No saved recipes!'} else {pageState = ''} 

      //Update state
      this.setState({savedRecipes: recipes, isCurrentlySaved, loggedInUser, pageState})

      //Fetch the average ratings from backend and populate the averageRatings object in state
      await this.getAverageRatings()
    } else if (response === 'unauthorized') {
      // Do nothing
      this.setState({loggedInUser, pageState: 'Please log in to save and access favourite recipes!'})
    } else if (response === 'service down') { 
      // Notify the user (e.g. when access limit reached )
      this.setState({loggedInUser, pageState: 'Service is currently down. Please try again later!'})
    } else {
      this.props.history.push('/error')
    }
  }

  /*Routine to get the average rating of each recipe on page, to be displayed on RecipeCard via its rating prop*/
  async getAverageRatings() {
    const { savedRecipes } = this.state

    if (savedRecipes.length !== 0) {
      const recipeIds = savedRecipes.map((recipe) => recipe.id).join(',') || '-1'
      const apiResponse = await fetch(`${process.env.REACT_APP_URL}/recipe/averagerating/bulk/${recipeIds}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      const  { averageRatings } = await apiResponse.json()

      this.setState({averageRatings})
    }
  }

  async handleSaveRecipe(recipeId) {
    const { isCurrentlySaved } = this.state
    const newSaveState = await this.props.onSaveRecipe(recipeId, !isCurrentlySaved[recipeId])
    isCurrentlySaved[recipeId] = newSaveState
    this.setState({ isCurrentlySaved })
    window.location.reload()
  }

  renderCard(recipe){
    const { isCurrentlySaved, averageRatings } = this.state
    return (
      <div key={recipe.id} className="favourite-recipe">
        <RecipeCard
          recipe={ recipe }
          forPage="saved-recipes"
          rating={averageRatings[recipe.id]}
          onSave={ () => this.handleSaveRecipe(recipe.id) } 
          isCurrentlySaved={ isCurrentlySaved } />
      </div>
    )
  }

  render() {
    const { savedRecipes, loggedInUser, pageState } = this.state
    return (
      <div className="saved-recipes-page-container">
        <h1> Hi {loggedInUser.username}! <br/> Serving up your faves ????</h1>
        <p>{pageState}</p>
        <div className="card-display-container">
          { savedRecipes.map((recipe) => this.renderCard(recipe)) }
        </div>
      </div>
    )
  }
}

export default withRouter(SavedRecipes)
