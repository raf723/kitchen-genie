import { Component } from 'react'
import StarsRatings from 'react-star-ratings'
import SaveButton from './SaveButton'
import { getCookie } from '../function-assets/helpers'
import '../css/recipe.css'

class Recipe extends Component {
    //Think about pulling instructions from Recipe Card
    initialState = {
        recipeId: this.props.location.state.id,
        isCurrentlySaved: false,
        title: this.props.location.state.title,
        description: '',
        instructions: [],
        ingredients: [],
        averageRating: undefined,
        personalRating: undefined,
    }

    state = this.initialState

    async fetchRecipeInfomation() {

        const { recipeId } = this.state

        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${process.env.REACT_APP_API_KEY}`

        const spoonacularRes = await fetch(spoonacularEndpoint)

        const spoonacularData = await spoonacularRes.json()

        const { extendedIngredients } = spoonacularData

        this.setState({ title: spoonacularData.title, imageSrc: spoonacularData.image, ingredients: extendedIngredients })

    }

    async summariseRecipe() {

        const { recipeId } = this.state

        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/summary?&apiKey=${process.env.REACT_APP_API_KEY}`

        const summaryRes = await fetch(spoonacularEndpoint)

        const { summary } = await summaryRes.json()

        this.setState({ description: this.removeHtmlTagsFromString(summary) })

    }

    async fetchRecipeIntructions() {

        const { recipeId } = this.state

        const instructionRes = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?&apiKey=${process.env.REACT_APP_API_KEY}`)

        const [{ steps }] = await instructionRes.json()

        this.setState({
            instructions: steps
        })
    }

    async getAverageStarRatings() {

        const { recipeId } = this.state

        //Endpoint for getting rating by recipe by id
        const fetchAverageRating = await fetch(`${process.env.REACT_APP_URL}/recipe/averagerating/${recipeId}`)

        const averageRating = await fetchAverageRating.json()

        this.setState({ averageRating: parseFloat(averageRating.value) })
    }

    async getPersonalStarRating() {
        const { recipeId } = this.state
        const currentSession = getCookie('sessionId') ?? null
        if (currentSession) {
            const apiResponse= await fetch(`${process.env.REACT_APP_URL}/recipe/personalrating/${recipeId}/${currentSession}`)
            const { response, recipe } = await apiResponse.json()
            if (response === 'success') {
                this.setState({ personalRating: recipe.rating })
            } else if (response === 'unauthorized') {
                //do nothing
            } else {
                window.location.replace('/error')
            }
        }
    }


    async postStarRating() {

        const { recipeId, personalRating } = this.state

        const postRatingRes = await fetch(`${process.env.REACT_APP_URL}/recipe/rating`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rating: personalRating,
                recipeId: recipeId
            })
        })

        const recipe = await postRatingRes.json()

        this.setState({ personalRating: recipe.rating })
    }

    async handleChangeRating(newRating) {
        this.setState({
            personalRating: newRating
        }, () => {
            this.postStarRating()
        })
    }

    renderIngredients() {
        return this.state.ingredients.map((ingredient, i) => <li key={i} className="recipe-list-items">{ingredient.name}</li>)
    }


    renderInstructions(instructionsArr) {
        return instructionsArr.map((instruction, i) => <li key={i} className="recipe-list-items">{instruction.step}</li>)
    }

    removeHtmlTagsFromString(string) {
        return string === '' ? 'No description' : string.replace(/(<([^>]+)>)/gi, "")
    }

    async checkSavedRecipe(){
        const apiResponse = await fetch(`${process.env.REACT_APP_URL}/myrecipes/id-only`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          })
            const { response, savedRecipeIds } = await apiResponse.json()
            if (response === 'success') { 
              this.setState({ isCurrentlySaved: savedRecipeIds.includes(this.state.recipeId)})
            } else if (response === 'unauthorized') {
              //do nothing
            } else {
              window.location.replace('/error')
            }

    }

    async componentDidMount() {
        //Todo: Return values and update stage once.
        await this.getAverageStarRatings()
        await this.getPersonalStarRating()
        await this.checkSavedRecipe()
        await this.fetchRecipeInfomation()
        await this.summariseRecipe() //! May not need this as it is passed from recipeCard.sj
        await this.fetchRecipeIntructions() //! May not need this as this is also passed from recipeCard
    }


    async handleSaveRecipe() {
        const { isCurrentlySaved, recipeId } = this.state
        const newSaveState = await this.props.onSaveRecipe(recipeId, !isCurrentlySaved)
        this.setState({ isCurrentlySaved: newSaveState })
    }

    render() {

        const { title, description, instructions, personalRating, averageRating } = this.state

        const { image, numIngredients, numMissingIngredients } = this.props.location.state

        const { userAuthenticated } = this.props

        return (
                <div className="recipe-page-root">
                    <section className="recipe-header-container">
                            <img src={image} className="recipe-page-image" alt="food" />
                            <h1>{title}</h1>
                                <div className="rating-fav-container flex row">
                                    <StarsRatings
                                        className="star-rating"
                                        rating={averageRating}
                                        starRatedColor="gold"
                                        starDimension="15px"
                                        starSpacing="5px" 
                                        />
                                    {userAuthenticated && ( 
                                        <div className="flex row"> 
                                        <span>Save to Favourites</span>
                                         <SaveButton onSave={() => this.handleSaveRecipe()} isCurrentlySaved={this.state.isCurrentlySaved} />
                                    </div>
                                    )}    
                                </div>
                       
                    </section>
                    <section className="recipe-section recipe-body flex row">
                         <article className="ingredients">
                            <h4>Ingredients</h4>
                            <p>Number of Ingredients: {numIngredients}</p>
                            <p>Missing Ingredients: {numMissingIngredients}</p>
                            <ul>
                                {this.renderIngredients()}
                            </ul>
                        </article>
                        <article className="instructions">
                            <h4>Description</h4>
                            <p className='recipe-description'>{description}</p>
                            <h4>Instructions</h4>
                            <ol>
                                {this.renderInstructions(instructions)}
                            </ol>
                        </article>

                       
                    </section>
                    <section className="recipe-section personal-rating">
                        {userAuthenticated && <h3>{`Your personal rating is ${personalRating}`}</h3>}
                        {userAuthenticated && <StarsRatings
                            className="star-rating"
                            rating={personalRating}
                            starRatedColor="gold"
                            starDimension="15px"
                            starSpacing="5px"
                            changeRating={(newRating) => { this.handleChangeRating(newRating) }} />
                        }
                    </section>
                </div>
        )
    }
}

export default Recipe
