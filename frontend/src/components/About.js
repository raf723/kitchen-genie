import React from 'react'
import '../css/about.css'

function AboutKitchenGenie() {
    return (
        <p>KitchenGenie processes a database of recipes based on the ingredients you want to use. It also tells you the ingredients you are missing, step by step instructions on how to make the food, supported by the community to share, comment, and rate recipes and save your favourite recipes.</p>
    )
}

function Inspiration() {
    return (
        <p>
            Eating is a necessity but cooking is an art. As i got older, I started falling more in love with different foods, dishes, and recipes from all over the world. What was once a simple meal to fill me up is now filled with the intrigue of discovering whole new world, new pallet of flavours, aromas, herbs and spices. Trying new foods is easy, but cooking them can be tricky, so we came up with this wonderful website to make it easier for everyone to make all kinds of foods just from the ingredients in their kitchen (or whatever food pallet they prefer). We take pleasure in providing the world with the knowledge and art of cooking. A recipe has no soul, you as the cook must bring the dish to life. No one is born a great cook, one learns by doing.
        </p>
    )
}

function MeetTheTeam() {
    return (
        <div>
            <p>Tawab Rahmani</p>
            <p>Keano Robinson</p>
            <p>Rafiul Ansari</p>
            <p>Cengiz Ziyaeddin</p>
        </div>
    )
}

function ContactUs() {
    return (
        <div>
            <p>Any feedback is always appreciated. And if you are having any issues or would like to provide any suggestions / feedback, please contact us on:</p>
            <a href="mailto:example@email.com">example@email.com</a>
        </div>

    )
}

class About extends React.Component {
    constructor() {
        super()
        this.state = { currentTab: "inspiration"}
      }

    render() {
        const { currentTab } = this.state
        return (
            <div>
                <nav className="all-tabs">
                    <span onClick={ () => this.setState({currentTab: "about"})} className={ currentTab === "about" ? "active tab" : "tab"}>About Kitchen Genie</span>
                    <span onClick={ () => this.setState({currentTab: "inspiration"})} className={ currentTab === "inspiration" ? "active tab" : "tab"}>Inspiration</span>
                    <span onClick={ () => this.setState({currentTab: "team"})} className={ currentTab === "team" ? "active tab" : "tab"}>Meet The Team</span>
                    <span onClick={ () => this.setState({currentTab: "contact"})} className={ currentTab === "contact" ? "active tab" : "tab"}>Contact Us</span>
                </nav>
                { currentTab === "about" && <AboutKitchenGenie />}
                { currentTab === "inspiration" && <Inspiration />}
                { currentTab === "team" && <MeetTheTeam />}
                { currentTab === "contact" && <ContactUs />}
            </div>
        )
    }
}

export default About
