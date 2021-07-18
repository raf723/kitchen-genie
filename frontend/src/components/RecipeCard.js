import React from 'react'
import '../css/recipe-card.css'

// ROuting imports
import { withRouter } from 'react-router-dom'

// Component imports
import SaveButton from './SaveButton'

// Third party imports
import StarsRatings from 'react-star-ratings'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

class RecipeCard extends React.Component {
  // Navigate to recipe page with recipe data
  recipeHandler = (recipe) => {
    // Pass data another parent component (page)
    this.props.history.push({
      pathname: '/recipe',
      state: {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
        numIngredients: recipe.usedIngredientCount + recipe.missedIngredientCount,
        numMissingIngredients: recipe.missedIngredientCount
      }
    })
  }

  renderInfo({ forPage, recipe }) {
    function listToTitleString(lst, maxNumberOfItems=3) {
      if (!Array.isArray(lst)) return ''
      if (lst.length > maxNumberOfItems) {
        const reducedLst = lst.slice(0, maxNumberOfItems)
        return reducedLst.map((ingredient) => ingredient.name).join(', ') + '...'
      } else {
        return lst.map((ingredient) => ingredient.name).join(', ') 
      }
    }

    if (forPage === 'saved-recipes') {
      return (
        <Tippy placement="bottom" content={ listToTitleString(recipe.extendedIngredients) }>
          <p className="none-missing">Uses {recipe.extendedIngredients.length} ingredients! </p> 
        </Tippy>
      )
    } else {
      if (recipe.missedIngredientCount > 0) {
        return (
          <Tippy placement="bottom" content={"Missing: " + listToTitleString(recipe.missedIngredients)}>
            <p className="some-missing">
              Missing { recipe.missedIngredientCount } { recipe.missedIngredientCount === 1 ? "ingredient" : "ingredients" }
            </p>  
          </Tippy>
        )
      } else {
        return ( 
          <Tippy placement="bottom" content={"Using: " + listToTitleString(recipe.usedIngredients)}>
            <p className="none-missing">You've got all the ingredients! </p> 
          </Tippy>
        )
      }
    }
  }

  formatNumberOfRatings(n) {
    n = parseInt(n, 10)
    if (n >= 1e9) {
      return (n / 1e6).toFixed(1) + "B"
    } else if (n >= 1e6) {
      return (n / 1e6).toFixed(1) + "M"
    } else if ( n >= 1e3) {
      return (n / 1e3).toFixed(1) + "k"
    } else {
      return n
    }

  }


  render() {
    const { recipe, forPage, rating, isCurrentlySaved } = this.props

    return (
      <article  key={recipe.id} id={ recipe.id } className="recipe-card">
        <div className="recipe-card-top">
        {/* Card image */}
          <img className="recipe-image" src={ recipe.image } alt="prepared recipe"/>
        </div>
        {/* Card meta */}
        <div className="recipe-card-bottom">
          {/* Recipe title */}
          <span className="recipe-title" onClick={ () => this.recipeHandler(recipe) }>{ recipe.title }</span>

          {/* Star rating */}
          {
            (!rating && <div className="unrated-recipe-tag">No rating yet!</div>)
            || (
              <div className="ratings">
                <StarsRatings
                  className="star-rating"
                  rating={ rating.value }
                  starRatedColor="gold"
                  starDimension="15px"
                  starSpacing="3px" /> <span className="number-of-ratings"> ({this.formatNumberOfRatings(rating.numberOfRatings)})</span>
              </div>
            )
          }

          {/* Ingredients info */}
          <div className="card-footer-container">
            {this.renderInfo({ forPage, recipe })}
            <SaveButton
              recipeID={ recipe.id }
              onSave={ () => this.props.onSave(recipe.id) } 
              isCurrentlySaved={ isCurrentlySaved } /> 
          </div>
        </div>
      </article>
    )
  }
}

export default withRouter(RecipeCard)
