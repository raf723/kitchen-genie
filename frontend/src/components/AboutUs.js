import React from 'react'
import '../css/about-us.css'

// Asset imports
import inspirationImg from '../assets/buffet.jpg';
import processImg from '../assets/process.jpg';
import cengiz from '../assets/cengiz.jpg';
import keano from '../assets/keano.jpg';
import rafiul from '../assets/rafiul.png';
import tawab from '../assets/tawab.jpg';

const inspiration = 'As we got older, we started falling more in love with different foods, dishes, and recipes from all over the world. What was once a simple meal to fill us up is now filled with the intrigue of discovering whole new world of flavours, aromas, herbs and spices. So we came up with this wonderful website to make it easier to make all kinds of foods using the ingredients in your kitchen. A recipe has no soul until you bring the dish to life.'
const process = 'Kitchen Genie processes a database of recipes based on the ingredients you want to use. It also tells you the ingredients you are missing, step by step instructions on how to make the food, supported by the community to share, comment, and rate recipes and save your favourite recipes.'
const teamMembers = [
  { name: 'Cengiz Ziyaeddin',
    image: cengiz },
  { name: 'Keano Robinson',
    image: keano },
  { name: 'Rafiul Ansari',
    image: rafiul },
  { name: 'Tawab Rahmani',
    image: tawab }
]

class AboutUs extends React.Component {
  constructor() {
    super()
    this.state = { currentTab: "inspiration"}
  }

  render() {
    return (
      <div id="about-us-container">
        <div id="process-container">
          <img className="side-img" src={ processImg } alt="process"/>
          <div className="p-container">
            <span>What's Kitchen Genie?</span>
            <p>{ process }</p>
          </div>
        </div>

        <div id="inspiration-container">
          <div className="p-container">
            <span>Why?</span>
            <p id="p-inspiration">{ inspiration }</p>
          </div>
          <img className="side-img" src={ inspirationImg } alt="inspiration"/>
        </div>

        <div id="meet-the-team-container-parent">
          <span>Meet the team</span>
          <div id="meet-the-team-container-child">
            { teamMembers.map(member => 
              <div className="member-div">
                <img className="member-img" src={ member.image } alt="team-member"/>
                <span>{ member.name }</span>
                <p>This is a brief intro about the team member.</p>
              </div>
            )}
          </div>
        </div>

        <div id="contact-us-container">
          <span>How do I contact you?</span>
          <p>Whether something's broken or you've got some feedback, we'd love to hear from you! Please contact us at the email address below: </p>
          <a href="mailto:support@kitchengenie.com">support@kitchengenie.com</a>
        </div>
      </div>
    )
  }
}

export default AboutUs
