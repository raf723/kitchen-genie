import { Component } from 'react'
import StarsRatings from 'react-star-ratings'
import SaveButton from './SaveButton'
import { getCookie } from '../function-assets/helpers'
import '../css/recipe.css'
import Comments from './Comments'

class Recipe extends Component {

    initialState = {
        recipeId: this.props.location.state.id,
        isCurrentlySaved: false,
        title: this.props.location.state.title,
        description: '',
        instructions: [],
        ingredients: [],
        averageRating: undefined,
        totalRatings: undefined,
        personalRating: undefined,
        preperationTime: '',
        serving: '',
        pricePerServing: '',
        diets: [],
    }

    state = this.initialState

    async fetchRecipeInfomation() {

        const { recipeId } = this.state

        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${process.env.REACT_APP_API_KEY}`

        const spoonacularRes = await fetch(spoonacularEndpoint)

        const spoonacularData = await spoonacularRes.json()

        const { extendedIngredients } = spoonacularData

        this.setState({ 
            title: spoonacularData.title, 
            imageSrc: spoonacularData.image, 
            ingredients: extendedIngredients,
            pricePerServing: spoonacularData.pricePerServing,
            preperationTime: spoonacularData.readyInMinutes,
            serving: spoonacularData.serving,
            diets: spoonacularData.diets,
         })

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

        const [ instructions ] = await instructionRes.json()

        if(instructions.steps.length === 0 ){
            instructions.steps.push('No instructions available.')
        }

        this.setState({
            instructions: instructions.steps
        })
    }

    async getAverageStarRatings() {

        const { recipeId } = this.state

        const fetchAverageRating = await fetch(`${process.env.REACT_APP_URL}/recipe/averagerating/${recipeId}`)

        const recipe= await fetchAverageRating.json()

        this.setState({ averageRating: parseFloat(recipe.value), totalRatings: recipe.total_ratings})
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

        await this.getAverageStarRatings()

        this.setState({ personalRating: recipe.rating, totalRatings: recipe.total_ratings })
    }

    async handleChangeRating(newRating) {
        this.setState({
            personalRating: newRating
        }, () => {
            this.postStarRating()
        })
    }

    renderIngredients() {
        const { ingredients } = this.state 
        return ingredients
        .filter((item, index) => ingredients.indexOf(item) === index)
        .map((ingredient, i) => <li key={i} className="recipe-li-ingredient">{ingredient.name}</li>)
    }


    renderInstructions(instructionsArr) {
        return instructionsArr.map((instruction, i) => <li key={i} className="recipe-list-item instruction">{instruction.step}</li>)
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
      await this.getAverageStarRatings()
      await this.getPersonalStarRating()
      await this.checkSavedRecipe()
      await this.fetchRecipeInfomation()
      await this.summariseRecipe()
      await this.fetchRecipeIntructions() 
    }


    async handleSaveRecipe() {
        const { isCurrentlySaved, recipeId } = this.state
        const newSaveState = await this.props.onSaveRecipe(recipeId, !isCurrentlySaved)
        this.setState({ isCurrentlySaved: newSaveState })
    }


    render() {

        const { title, description, instructions, personalRating, averageRating, recipeId, preperationTime, pricePerServing, diets, serving, totalRatings } = this.state

        const { image, numIngredients, numMissingIngredients } = this.props.location.state

        const { userAuthenticated } = this.props

        return (
            <div>
                <div className="recipe-page-root">
                    <section className="recipe-header-container">
                        <h1 id="recipe-page-title">{title}</h1>
                        <div id="average-rating">
                            <div className="rating-fav-container flex row">
                                <StarsRatings
                                    className="star-rating"
                                    rating={averageRating}
                                    starHoverColor="rgb(116, 166, 127, 1)"
                                    starRatedColor="rgb(253, 193, 76, 1)"
                                    starDimension="24px"
                                    starSpacing="5px"
                                    />
                                    <span className="recipe-subheading">{totalRatings > 0 ? `Average Rating - ${averageRating} out of 5 (${totalRatings} ratings)` : `No ratings yet`}</span>
                            </div>
                            {userAuthenticated && ( 
                            <div className="favourite-box"> 
                                    <p>Save Recipe</p>
                                    <SaveButton id="recipe-favourite" onSave={() => this.handleSaveRecipe()} isCurrentlySaved={this.state.isCurrentlySaved} size={30} />    
                            </div>
                            )}    
                        </div>
                    </section>
                        {/* Main section of page */}
                    <div className="recipe-page-body flex row">
                        {/* Ingredients and Images */}
                        <section className="image-instruction-column flex column">
                            <img src={image} className="recipe-page-image" alt="food" />
                            <span className="recipe-subheading">Ingredients</span>
                            <ul className="ingredients-list">
                                {this.renderIngredients()}
                            </ul>
                        </section>
                        {/* Preptime and instructions */}
                        <section className="info-desc-instruct-column flex column">
                            <article className="key-info flex column">
                                { preperationTime && <span>Preperation time - <span className="important-info">{preperationTime} minutes</span></span> }
                                { pricePerServing && <span>Price Per Serving - <span className="important-info">£ {((pricePerServing / 100)*0.8).toFixed(2)} per person</span></span> }
                                { serving && <span>Serving - <span className="important-info">{preperationTime} people</span> </span> }
                                { diets.length !== 0 && <span>Diets - <span className="important-info">{ diets.join(', ') }</span></span> }
                                { numIngredients && <span>Number of Ingredients - <span className="important-info">{numIngredients}</span></span> }
                                { numMissingIngredients && <span className="missing">Number of Missing Ingredients - {numMissingIngredients}</span>}    
                                <span className="recipe-subheading">Description</span>
                                {<p className='recipe-description'>{description}</p>}
                            </article>
                            <article className="instructions">
                                <span className="recipe-subheading">Instructions</span>
                                { 
                                instructions.length === 0 ? <p>No intructions</p> :
                                <ol>
                                    {this.renderInstructions(instructions)}
                                </ol>
                                }
                            </article>
                        </section>
                    </div>
                    <section className="personal-rating">
                        {userAuthenticated && personalRating !== 0 && <span className="bottom-rating recipe-subheading">Your personal rating is <span className="important-info">{`${personalRating}`}</span></span>}
                        {userAuthenticated && personalRating === 0 && <span className="bottom-rating recipe-subheading">{`Enjoyed? Rate this meal`}</span>}
                        {userAuthenticated && <StarsRatings
                            className="star-rating"
                            changeRating={(newRating) => { this.handleChangeRating(newRating) }}
                            rating={personalRating}
                            starHoverColor="rgb(116, 166, 127, 1)"
                            starRatedColor="rgb(253, 193, 76, 1)"
                            starDimension="24px"
                            starSpacing="5px"
                            />
                        }

                    </section>
                </div>
                    <section>
                        <Comments userAuthenticated={userAuthenticated} recipeId={recipeId} />
                    </section>
                </div>                   
        )
    }
}

export default Recipe