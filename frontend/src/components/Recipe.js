import React from 'react'
import '../css/recipe.css'

// Third party imports
import StarsRatings from 'react-star-ratings'

// Component imports
import Comments from './Comments'

// Helper functions
import { getCookie } from '../function-assets/helpers'

class Recipe extends React.Component {
  initialState = {
    recipeId: this.props.location.state.id,
    isCurrentlySaved: false,
    image: this.props.location.state.image ? this.props.location.state.image : '',
    title: this.props.location.state.title,
    numIngredients: this.props.location.state.numIngredients ? this.props.location.state.numIngredients : '',
    numMissingIngredients: this.props.location.state.numMissingIngredients ? this.props.location.state.numMissingIngredients : '',
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
  
  async componentDidMount() {
    await this.getAverageStarRatings()
    await this.getPersonalStarRating()
    await this.checkSavedRecipe()
    await this.fetchRecipeInfomation()
    await this.summariseRecipe() // May not need this as it is passed from recipeCard.sj
    await this.fetchRecipeIntructions() // May not need this as this is also passed from recipeCard
  }

  // Get average rating for current recipe
  async getAverageStarRatings() {
    const { recipeId } = this.state
    const fetchAverageRating = await fetch(`${process.env.REACT_APP_URL}/recipe/averagerating/${recipeId}`)
    const recipe= await fetchAverageRating.json()
    this.setState({ averageRating: parseFloat(recipe.value), totalRatings: recipe.total_ratings})
  }

  // Get user's specific rating for this recipe (if exists)
  async getPersonalStarRating() {
    const { recipeId } = this.state
    const currentSession = getCookie('sessionId') ?? null
    if (currentSession) {
      const apiResponse= await fetch(`${process.env.REACT_APP_URL}/recipe/personalrating/${recipeId}/${currentSession}`)
      const { response, recipe } = await apiResponse.json()
      
      if (response === 'success') this.setState({ personalRating: recipe.rating })
      else if (response !== 'unauthorized') this.props.history.push('/error')
    }
  }

  // Has the user saved the recipe
  async checkSavedRecipe(){
    const apiResponse = await fetch(`${process.env.REACT_APP_URL}/myrecipes/id-only`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const { response, savedRecipeIds } = await apiResponse.json()

    if (response === 'success') this.setState({ isCurrentlySaved: savedRecipeIds.includes(this.state.recipeId)})
    else if (response !== 'unauthorized') this.props.history.push('/error')
  }

  // Recipe title, image, ingredients, price, prep time, serving size and diet
  async fetchRecipeInfomation() {
    const { recipeId } = this.state
    const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${process.env.REACT_APP_API_KEY}`
    const spoonacularRes = await fetch(spoonacularEndpoint)
    const spoonacularData = await spoonacularRes.json()
    const { extendedIngredients } = spoonacularData

    this.setState({
      diets: spoonacularData.diets,
      title: spoonacularData.title, 
      imageSrc: spoonacularData.image, 
      ingredients: extendedIngredients,
      preperationTime: spoonacularData.readyInMinutes,
      pricePerServing: spoonacularData.pricePerServing,
      serving: spoonacularData.serving
    })
  }

  // Recipe description
  async summariseRecipe() {
    const { recipeId } = this.state
    const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/summary?&apiKey=${process.env.REACT_APP_API_KEY}`
    const summaryRes = await fetch(spoonacularEndpoint)
    const { summary } = await summaryRes.json()
    this.setState({ description: this.removeHtmlTagsFromString(summary) })
  }

  // Recipe instructions
  async fetchRecipeIntructions() {
    const { recipeId } = this.state
    const instructionRes = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?&apiKey=${process.env.REACT_APP_API_KEY}`)
    const [{ steps }] = await instructionRes.json()
    this.setState({ instructions: steps })
  }

  // Rating handler
  handleChangeRating = async (newRating) => this.setState({ personalRating: newRating }, () => { this.postStarRating() })
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
    
    this.setState({ personalRating: recipe.rating })
  }

  // Save recipe handler
  async handleSaveRecipe() {
    const { isCurrentlySaved, recipeId } = this.state
    const newSaveState = await this.props.onSaveRecipe(recipeId, !isCurrentlySaved)
    this.setState({ isCurrentlySaved: newSaveState })
  }

  // For each ingredient, render an <li>
  renderIngredients() {
    const { ingredients } = this.state 
    
    return ingredients
      .filter((item, index) => ingredients.indexOf(item) === index)
      .map((ingredient, i) => <li key={ i } className="recipe-li-ingredient">{ ingredient.name }</li>)
  }
  
  // For each instruction, render an <li>
  renderInstructions = (instructionsArr) => instructionsArr.map((instruction, i) => <li key={ i } className="instruction-item">{ instruction.step }</li>)
  
  // Use regex to remove HTML tags from a string
  removeHtmlTagsFromString = (string) => string === '' ? 'No description' : string.replace(/(<([^>]+)>)/gi, "")

  render() {
    const { averageRating, description, diets, instructions, isCurrentlySaved, personalRating, preperationTime, pricePerServing, recipeId, serving, title, totalRatings, image, numIngredients, numMissingIngredients } = this.state
    const { userAuthenticated } = this.props

    return (
      <div id="recipe-container">
        {/* Title */}
        <h1>{ title }</h1>

        {/* Header i.e. Recipe's average rating */}
        <div id="header-container">
          <div id="ratings-container">
            <span id="star-icon" class="fa fa-star"></span>
            <span className="rating-span">{ averageRating === 0 ? "No ratings" : `Average rating: ${parseFloat(averageRating).toFixed(1)} (${ totalRatings })` }</span>
          </div>

          {/* Save recipe button */}
          <div id="save-container">
            <button id="save-recipe-button" onClick={ () => this.handleSaveRecipe() }>
              <i className={ isCurrentlySaved ? "fas fa-heart" : "far fa-heart" }></i>
              <span> { isCurrentlySaved ? "Saved" : "Save recipe" }</span>
            </button>
          </div>
        </div>

        <div id="recipe-body-container">
          <div id="img-ingredients-container">
            {/* Recipe image */}
            <img src={ image } className="recipe-image" alt="food" />

            {/* Ingredients list */}
            <div id="ingredients-container">
              <span className="recipe-subheading">Ingredients</span>
              <ul>{ this.renderIngredients() }</ul>
            </div>
          </div>

          <div id="meta-desc-instructions-container">
            {/* Recipe meta i.e. prep time, servings, etc. */}
            <div id="meta-container">
              { serving && 
                <span>
                  <span className="title-span">Serves: </span>
                  <span className="result-span">{ serving } people</span>
                </span> 
              }

              { preperationTime &&
                <span>
                  <span className="title-span">Preparation time: </span>
                  <span className="result-span">{ preperationTime } min</span>
                </span>
              }

              { pricePerServing && 
                <span>
                  <span className="title-span">Price per serving: </span>
                  <span className="result-span">${ (pricePerServing / 100).toFixed(2) } per person</span>
                </span>
              }

              { diets.length !== 0 && 
                <span>
                  <span className="title-span">Diet: </span>
                  <span className="result-span" id="diet-span">{ diets.join(', ') }</span>
                </span>
              }

              {/* { numIngredients &&
                <span>
                  <span className="title-span">Number of ingredients: </span>
                  <span className="result-span">{ numIngredients }</span>
                </span>
              }
              
              { numMissingIngredients && 
                <span>
                  <span className="title-span">Number of missing ingredients: </span>
                  <span className="result-span" id="red-span">{ numMissingIngredients }</span>
                </span>
              } */}
            </div>
            
            {/* Recipe description */}
            <div id="description-container">
              <span className="recipe-subheading">Description</span>
              <p>{ description }</p>
            </div>

            {/* Instructions list */}
            <div id="instructions-container">
              <span className="recipe-subheading">Instructions</span>
              { instructions.length === 0 ? <p>No intructions available</p> : <ol>{ this.renderInstructions(instructions) }</ol> }
            </div>
          </div>
        </div>

        {/* Current user's rating */}
        <div id="user-rating-container">
          { userAuthenticated && personalRating === 0 && <p>{`Leave a rating below!`}</p> }
          { userAuthenticated && personalRating !== 0 && <p>{`Your rating`}</p> }
          { userAuthenticated && 
            <StarsRatings
              id="star-rating"
              rating={ personalRating }
              starHoverColor="rgba(248,176,82,255)"
              starRatedColor="rgba(248,176,82,255)"
              starDimension="25px"
              starSpacing="5px"
              changeRating={(newRating) => { this.handleChangeRating(newRating) }} /> }
        </div>

        {/* Comments section */}
        <Comments userAuthenticated={ userAuthenticated } recipeId={ recipeId }/>
      </div>
    )
  }
}

export default Recipe