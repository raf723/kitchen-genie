import { Component } from 'react'
import SaveButton from './SaveButton'
import RecipeCard from './RecipeCard'

export class SavedRecipes extends Component {
    initialState = {
        savedRecipes: [],
        isCurrentlySaved: {}
    }
    componentDidMount(){
        //fetch saved recipes from database and add them to state
        //render recipe cards of saved recipes
    }

    handleSave(recipeId) {
        //make a POST to bakend with sessionId credentials to 
        //Vote status 
    }

    renderCard(recipe){
        return (
            <RecipeCard id={recipe.id} 
                        image={recipe.image} 
                        numIngredients={recipe.numIngredients} 
                        numMissingIngredients={recipe.numMissingIngredients}
                        onSave={() => this.handleSave(recipe.id)}
                        isCurrentlySaved={this.state.isCurrentlySaved[recipe.id]} />
        )
    }

    render() {
        return (
            <div className="page-container">
                <h1> Saved Recipes </h1>
                <div className="card-display-container">
                    {/* For each recipe in saved recipes render a card*/}
                </div>
            </div>
        )
    }
}

export default SavedRecipes