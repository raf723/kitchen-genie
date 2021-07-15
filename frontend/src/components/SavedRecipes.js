import { Component } from 'react'
import RecipeCard from './RecipeCard'
import SaveButton from './SaveButton'
import '../css/saved-recipes.css'

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
        const apiResponse = await fetch(`http://localhost:8080/myrecipes`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        })
        const { response, recipes, loggedInUser } = await apiResponse.json()
        if (response === 'success') { 
            const isCurrentlySaved =  {}
            recipes.forEach((recipe) => isCurrentlySaved[recipe.id] = true)
            let pageState 
            if (recipes.length === 0) {pageState = 'No favourite recipes yet!'} else {pageState = ''} 

            //Update state
            await this.setState({savedRecipes: recipes, isCurrentlySaved, loggedInUser, pageState})

            //Fetch the average ratings from backend and populate the averageRatings object in state
            await this.getAverageRatings()
        } else if (response === 'unauthorized') {
            //do nothing
            this.setState({loggedInUser, pageState: 'Please log in to save and access favourite recipes!'})
        } else if (response === 'service down') { 
            //notify the user (e.g. when access limit reached )
            this.setState({loggedInUser, pageState: 'Service is currently down. Please try again later!'})
        }else {
            window.location.replace('/error')
        }
    }

    /*Routine to get the average rating of each recipe on page, to be displayed on RecipeCard via its rating prop*/
    async getAverageRatings() {
        const { savedRecipes } = this.state

        const recipeIds = savedRecipes.map((recipe) => recipe.id).join(',')
        const apiResponse = await fetch(`${process.env.REACT_APP_URL}/recipe/averagerating/bulk/${recipeIds}`, {
        headers: { 'Content-Type': 'application/json' },
        })

        const  { averageRatings } = await apiResponse.json()

        this.setState({averageRatings})
    }

    async handleSaveRecipe(recipeId) {
        const { isCurrentlySaved } = this.state
        const newSaveState = await this.props.onSaveRecipe(recipeId, !isCurrentlySaved[recipeId])
        isCurrentlySaved[recipeId] = newSaveState
        this.setState({ isCurrentlySaved })
    }

    renderCard(recipe){
        const { isCurrentlySaved, averageRatings } = this.state
        return (
            <div key={recipe.id} className="favourite-recipe">
                { 
                    <SaveButton onSave={ async () => await this.handleSaveRecipe(recipe.id)} 
                    isCurrentlySaved={isCurrentlySaved[recipe.id]}/>
                }
                <RecipeCard recipe={ recipe } forPage="saved-recipes" rating={averageRatings[recipe.id]} />
            </div>
        )
    }

    render() {
        const { savedRecipes, loggedInUser, pageState } = this.state
        return (
            <div className="saved-recipes-page-container">
                <h1> Hi {loggedInUser.username}! <br/> Serving Up Your Faves 🍽</h1>
                <p className="user-message">{pageState}</p>
                <div className="card-display-container">
                    { savedRecipes.map((recipe) => this.renderCard(recipe)) }
                </div>
            </div>
        )
    }
}

export default SavedRecipes