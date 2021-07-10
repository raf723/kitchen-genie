import { Component } from 'react'
import RecipeCard from './RecipeCard'
import SaveButton from './SaveButton'
import '../css/saved-recipes.css'

export class SavedRecipes extends Component {
    initialState = {
        loggedInUser: {},
        savedRecipes: [],
        isCurrentlySaved: {}
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
            this.setState({savedRecipes: recipes, isCurrentlySaved, loggedInUser})
        } else if (response === 'unauthorized') {
            //do nothing
        } else if (response === 'service down') { 
            //notify the user (e.g. when access limit reached )
        }else {
            window.location.replace('/error')
        }
    }

    async handleSaveRecipe(recipeId) {
        const { isCurrentlySaved } = this.state
        const newSaveState = await this.props.onSaveRecipe(recipeId, !isCurrentlySaved[recipeId])
        isCurrentlySaved[recipeId] = newSaveState
        this.setState({ isCurrentlySaved })
    }

    renderCard(recipe){
        const { isCurrentlySaved } = this.state
        return (
            <div key={recipe.id} className="favourite-recipe">
                { 
                    <SaveButton onSave={ async () => await this.handleSaveRecipe(recipe.id)} 
                    isCurrentlySaved={isCurrentlySaved[recipe.id]}/>
                }
                <RecipeCard  
                            id={recipe.id} 
                            title={recipe.title}
                            image={recipe.image} 
                            numIngredients={recipe.numIngredients} 
                            numMissingIngredients={recipe.numMissingIngredients} />
            </div>
        )
    }

    render() {
        const { savedRecipes, loggedInUser } = this.state
        return (
            <div className="saved-recipes-page-container">
                <h1> Hi {loggedInUser.username}! <br/> Servrnig Up Your Faves 🍽</h1>
                <div className="card-display-container">
                    { savedRecipes.map((recipe) => this.renderCard(recipe)) }
                </div>
            </div>
        )
    }
}

export default SavedRecipes