import '../css/recipe-card.css'
import StarsRatings from 'react-star-ratings'
import { withRouter } from 'react-router-dom'
import React from 'react'

class RecipeCard extends React.Component {
  // Navigate to recipe page with recipe data
  recipeHandler = (id, image, numIngredients, numMissingIngredients) => {
    // Pass data another parent component (page)
    this.props.history.push({
      pathname: '/recipe',
      state: {
        id: id,
        image: image,
        numIngredients: numIngredients,
        numMissingIngredients: numMissingIngredients
      }
    })
  }

  render() {
    const { id, title, image, numIngredients, numMissingIngredients } = this.props

    return (
      <article id={ id } className="recipe-card" onClick={ () => this.recipeHandler(id, image, numIngredients, numMissingIngredients) }>
        {/* Card image */}
        <img className="recipe-image" src={ image } alt="prepared recipe" height="100%" width="100%"/>

        {/* Card meta */}
        <div className="recipe-card-bottom">
          {/* Recipe title */}
          <h5>{ title }</h5>

          {/* Star rating */}
          <StarsRatings
            className="star-rating"
            rating={ 0 }
            starRatedColor="gold"
            starDimension="15px"
            starSpacing="3px" />

          {/* Ingredients info */}
          { ( numMissingIngredients && <p className="some-missing">Missing { numMissingIngredients } ingredients</p> ) 
            || <p className="none-missing">You've got all the ingredients! </p> }
        </div>
      </article>
    )
  }
}

export default withRouter(RecipeCard)
