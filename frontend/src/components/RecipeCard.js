import '../css/recipe-card.css'
import StarsRatings from 'react-star-ratings'
import { withRouter } from 'react-router-dom'
import React from 'react'
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
            <p className="some-missing"> Missing { recipe.missedIngredientCount } ingredients</p>  
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


  render() {
    const { recipe, forPage, rating } = this.props

    return (
      <article  key={recipe.id} id={ recipe.id } className="recipe-card" onClick={ () => this.recipeHandler(recipe) }>
        <div className="recipe-card-top">
        {/* Card image */}
          <img className="recipe-image" src={ recipe.image } alt="prepared recipe"/>
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
          {this.renderInfo({ forPage, recipe })}
        </div>
      </article>
    )
  }
}

export default withRouter(RecipeCard)
