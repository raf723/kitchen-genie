import '../css/recipe-card.css'
import StarsRatings from 'react-star-ratings'
import { withRouter } from 'react-router-dom'
import React from 'react'

class RecipeCard extends React.Component {
  // Navigate to recipe page with recipe data
  recipeHandler = (recipe) => {
    // Pass data another parent component (page)
    this.props.history.push({
      pathname: '/recipe',
      state: {
        id: recipe.id,
        image: recipe.image,
        numIngredients: recipe.usedIngredientCount + recipe.missedIngredientCount,
        numMissingIngredients: recipe.missedIngredientCount
      }
    })
  }


  render() {
    const { recipe, rating } = this.props

    return (
      <article id={ recipe.id } className="recipe-card" onClick={ () => this.recipeHandler(recipe) }>
        <div className="recipe-card-top">
        {/* Card image */}
          <img className="recipe-image" src={ recipe.image } alt="prepared recipe" height="100%" width="100%"/>
        </div>
        {/* Card meta */}
        <div className="recipe-card-bottom">
          {/* Recipe title */}
          <h5 className="recipe-title">{ recipe.title }</h5>

          {/* Star rating */}
          {
            (!rating && <div className="unrated-recipe-tag">No rating yet!</div>)
            || <StarsRatings
              className="star-rating"
              rating={ rating }
              starRatedColor="gold"
              starDimension="15px"
              starSpacing="3px" />
          }

          {/* Ingredients info */}
          { ( recipe.missedIngredientCount && <p className="some-missing">Missing { recipe.missedIngredientCount } ingredients</p> ) 
            || <p className="none-missing">You've got all the ingredients! </p> }
        </div>
      </article>
    )
  }
}

export default withRouter(RecipeCard)
