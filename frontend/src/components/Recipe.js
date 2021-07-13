import { Component } from 'react'
import StarsRatings from 'react-star-ratings'
import { getCookie } from '../function-assets/helpers'

class Recipe extends Component {

    state = {
        recipeId: this.props.location.state.id,
        title: '',
        description: '',
        instructions: [],
        ingredients: [],
        averageRating: undefined,
        personalRating: undefined,
    }



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

        console.log('I am being called')

        const { recipeId } = this.state

        const currentSession = getCookie('sessionId') ?? null

        console.log(currentSession)

        if (currentSession) {
            
            const apiResponse= await fetch(`${process.env.REACT_APP_URL}/recipe/personalrating/${recipeId}/${currentSession}`)

            const recipe = await apiResponse.json()

            this.setState({ personalRating: recipe.rating })

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
        return this.state.ingredients.map(ingredient => <li key={ingredient.id}>{ingredient.name}</li>)
    }


    renderInstructions(instructionsArr) {
        return instructionsArr.map(instruction => <li key={instruction.id}>{instruction.step}</li>)
    }

    removeHtmlTagsFromString(string) {
        return string === '' ? 'No description' : string.replace(/(<([^>]+)>)/gi, "")
    }

    componentDidMount() {
        this.getAverageStarRatings()
        this.getPersonalStarRating()
        this.fetchRecipeInfomation()
        this.summariseRecipe()
        this.fetchRecipeIntructions()
    }


    render() {

        const { title, description, instructions, personalRating, averageRating } = this.state

        const { image, numIngredients, numMissingIngredients } = this.props.location.state

        const { userAuthenticated } = this.props

        console.log(userAuthenticated)

        return (
            <div>
                <section>
                    <img src={image} alt="" />
                    <h1>{title}</h1>
                    <div>
                        <StarsRatings
                            className="star-rating"
                            rating={averageRating}
                            starRatedColor="gold"
                            starDimension="15px"
                            starSpacing="3px" />
                        {averageRating === 0 && <p>(No rating yet)</p>}
                        {userAuthenticated && <h3>{`Your personal rating is ${personalRating}`}</h3>}
                    </div>

                    {userAuthenticated && <StarsRatings
                        className="star-rating"
                        rating={personalRating}
                        starRatedColor="gold"
                        starDimension="15px"
                        starSpacing="3px"
                        changeRating={(newRating) => { this.handleChangeRating(newRating) }} />
                    }

                </section>
                <section className="recipe-container">
                    <div className="instructions-container">
                        <p className='recipe-description'>{description}</p>
                        <p>Number of Ingredients: {numIngredients}</p>
                        <p>Missing Ingredients: {numMissingIngredients}</p>
                        <ul>
                            {this.renderInstructions(instructions)}
                        </ul>
                    </div>
                    <div className="ingredients-container">
                        <ul>
                            {this.renderIngredients()}
                        </ul>
                    </div>
                </section>
            </div>
        )
    }
}

export default Recipe
