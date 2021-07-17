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
const cengizBio = `It’s been my dream role to become a software developer, and this project has been the best way to conclude a challenging but extremely fun bootcamp at Sigmalabs.\nI have loved iterating, testing and building with the Kitchen Genie team, we have all pushed ourselves to apply our newly learnt knowledge, designing a product that we think tackles the important problem of food waste. I am proud to call it my first software development team project.\nTo the future! `
const teamMembers = [
  { name: 'Cengiz Ziyaeddin',
    image: cengiz,
    desc: cengizBio },
  { name: 'Keano Robinson',
    image: keano,
    desc: 'Chemical Engineer turned Software! Coding or non-coding, I love making things.' },
  { name: 'Rafiul Ansari',
    image: rafiul,
    desc: 'Chemical Engineer turned Software! Coding or non-coding, I just love making things.' },
  { name: 'Tawab Rahmani',
    image: tawab,
    desc: 'Chemical Engineer turned Software! Coding or non-coding, I love making things.' }
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
                <p>{ member.desc }</p>
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
