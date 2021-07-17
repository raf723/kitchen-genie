import '../css/save-button.css'
import heartOutline from '../assets/heart-outline.png'
import heartFill from '../assets/heart-fill.png'

export function SaveButton({ onSave, isCurrentlySaved }) {
  return (
    <div id="save-button-container">
      <button id="save-recipe-button" onClick={ () => onSave() }>
        <img id="save-icon" src={ isCurrentlySaved ? heartFill : heartOutline } alt="splash"/>
      </button>
    </div>
  )
}

export default SaveButton
