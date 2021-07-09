import { Component } from 'react'
import StarsRatings from 'react-star-ratings'

class Recipe extends Component {

    state = {
        recipeId: this.props.location.state.id,
        title: '',
        description: '',
        instructions: [],
        ingredients: [],
        rating: 3
    }

 componentDidMount(){

        //  this.fetchRecipeInfomation()
        //  this.summariseRecipe()
        //  this.fetchRecipeIntructions()

        this.postStarRating()
    }


    async fetchRecipeInfomation () {
        
        const { recipeId } = this.state

        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${process.env.REACT_APP_API_KEY}`

        const spoonacularRes = await fetch(spoonacularEndpoint)

        const spoonacularData = await spoonacularRes.json()

        const { extendedIngredients } = spoonacularData

        this.setState({ title: spoonacularData.title, imageSrc: spoonacularData.image, ingredients: extendedIngredients })

    }

    async summariseRecipe (){

        const { recipeId } = this.state

        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/summary?&apiKey=${process.env.REACT_APP_API_KEY}`
        
        const summaryRes = await fetch(spoonacularEndpoint)

        const  { summary } = await summaryRes.json()

        this.setState({ description: this.removeHtmlTagsFromString(summary)})

    }

    async fetchRecipeIntructions () {

        const { recipeId } = this.state 

        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?&apiKey=${process.env.REACT_APP_API_KEY}`

        const instructionRes = await fetch (spoonacularEndpoint)

        const [{ steps }]  = await instructionRes.json()

        this.setState({
        instructions: steps
        })
    }

    renderInstructions(instructionsArr){
        return instructionsArr.map(instruction => <li key={instruction.id}>{instruction.step}</li>)
    }

    renderIngredients(){
        return this.state.ingredients.map(ingredient => <li key={ingredient.id}>{ingredient.name}</li>)
    }

    removeHtmlTagsFromString(string){
        return string.replace(/(<([^>]+)>)/gi, "")
    }

    // getStarRating(){

    //     const endpoint = `${process.env.REACT_APP_URL}/`

    // }

    handleRateRecipe(){
        this.setState({
            rating: 3
        })
    }

    async postStarRating(){

        const { recipeId, rating } = this.state
       
        const postRatingEndPoint = `${process.env.REACT_APP_URL}/rating`

        const postRatingRes = await fetch(postRatingEndPoint, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                rating: rating,
                recipeId: recipeId
            })
        })
    
    }

    render(){
        
        const {  title, description, instructions } = this.state

        const { image, numIngredients, numMissingIngredients } = this.props.location.state

        return (
            <div>
                <section>
                    <img src={image} alt=""/>
                    <h1>{title}</h1>
                    <StarsRatings
                        className="star-rating"
                        rating={ 0 }
                        starRatedColor="gold"
                        starDimension="15px"
                        starSpacing="3px" />
                </section>
                {/* <section className="recipe-container">
                    <div className="instructions-container">
                        <p className='recipe-description'>{ description }</p>
                        <span>{numIngredients}</span>
                        <span>{numMissingIngredients}</span>
                        <ul>
                            {this.renderInstructions(instructions)}
                        </ul>
                    </div>
                    <div className="ingredients-container">
                        <ul>
                            {this.renderIngredients()}
                        </ul>
                    </div>
                </section> */}
            </div>
        )
    }
}

export default Recipe
