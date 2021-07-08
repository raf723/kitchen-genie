import '../css/recipe-card.css'
import StarsRatings from 'react-star-ratings'
import { Link } from 'react-router-dom'

export function RecipeCard({ id, title, image, rating, numMissingIngredients, numIngredients, recipeLink }){
  return (
    <Link className="recipe-link" to={ recipeLink }>
      <article id={ id } className="recipe-card">
        {/* Card image */}
        <div className="recipe-card-top">
          <img className="recipe-image" src={ image } alt="prepared recipe" height="100%" width="100%"/>
        </div>

        {/* Card meta */}
        <div className="recipe-card-bottom">
          {/* Recipe title */}
          <h5>{ title }</h5>

          {/* Star rating */}
          <StarsRatings
            className="star-rating"
            rating={ rating }
            starRatedColor="gold"
            starDimension="15px"
            starSpacing="3px" />

          {/* Ingredients info */}
          { ( numMissingIngredients && <p className="some-missing">🔴 You have { numIngredients - numMissingIngredients } out of { numIngredients } of the ingredients required!</p> ) 
            || <p className="none-missing">🟢 You've got all the ingredients! </p> }
        </div>
      </article>
    </Link>
  )
}

export default RecipeCard
