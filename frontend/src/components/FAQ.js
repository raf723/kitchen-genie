import React from 'react';
import '../css/faq.css'

class FAQ extends React.Component {

    collapse(e) {
        e.target.classList.toggle("active");
        var content = e.target.nextElementSibling;
        // var hasVScroll = document.body.scrollHeight > document.body.clientHeight;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center'})
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center'})
        }
    }

    collapseBottom(e) {
        this.collapse(e)
        if (e.target.className === "collapsible collapsible-bottom active") {
            document.getElementById("collapsible-bottom").className = "collapsible active";
        } else {
            document.getElementById("collapsible-bottom").className = "collapsible collapsible-bottom"
        }
    }

    render() {
        return (
            <div id="faq-container">
                <h1>Frequently Asked Questions</h1>
                <p className="faq-info">Everything you need to know to use Kitchen Genie like a pro</p>

                <div className="collapse">

                    <button className="collapsible collapsible-top" onClick={(e) => this.collapse(e)}>How long have you guys worked on this website?</button>
                    <div className="content">
                        <p>2 Weeks.</p>
                    </div>

                    <button className="collapsible" onClick={(e) => this.collapse(e)}>Can we post any suggestions we have?</button>
                    <div className="content">
                        <p>Of course, we are always welcome for new suggestions, user feedback, any glitches or bugs you may want to report etc. Please do so by contacting us on: example@email.com.</p>
                    </div>

                    <button className="collapsible" onClick={(e) => this.collapse(e)}>How do I search for recipes?</button>
                    <div className="content">
                        <ol>
                            <li>You type in the ingredients you desire and hit enter.</li>
                            <li>After each ingredient you should see the ingredient selected below the search bar.</li>
                            <li>Once satisfied click Go.</li>
                            <li>A list of recipes will show up showing the number of ingredients you have and the number of ingredients you are missing. Hovering over the number of missing ingredients will show exactly which ingredients are actually missing.</li>
                            <li>Once satisfied with a result click on it to open up the page which has step by step instructions on how to make the food.</li>
                            <li>You can also rate the recipes and save them to your favourites if you log in.</li>
                        </ol>
                    </div>

                    <button className="collapsible" onClick={(e) => this.collapse(e)}>What can I search for?</button>
                    <div className="content">
                        <p>At the moment only ingredients, but in the future we plan to allow searching for recipe names directly as well.</p>
                    </div>

                    <button className="collapsible" onClick={(e) => this.collapse(e)}>Can I search for meal types?</button>
                    <div className="content">
                        <p>Once ingredients have been selected, checkboxes for meal types / categories will be available. Just check the ones you desire and enjoy.</p>
                    </div>

                    <button className="collapsible" onClick={(e) => this.collapse(e)}>Do I have to pay for this service?</button>
                    <div className="content">
                        <p>No this service is completely free.</p>
                    </div>

                    <button className="collapsible" onClick={(e) => this.collapse(e)}>Is this website monetised?</button>
                    <div className="content">
                        <p>No, this service is not currently monetised.</p>
                    </div>

                    <button className="collapsible" onClick={(e) => this.collapse(e)}>Are there any ads on this service?</button>
                    <div className="content">
                        <p>No there is currently no ads on this website with no immediate plans to introduce any anytime soon.</p>
                    </div>

                    <button className="collapsible" onClick={(e) => this.collapse(e)}>What happens with my data?</button>
                    <div className="content">
                        <p>We comply with any international and national laws regarding data protection. Your data remains safe and protected, and we do not share this data with any other website or organisation.</p>
                    </div>

                    <button className="collapsible" onClick={(e) => this.collapse(e)}>Who are you?</button>
                    <div className="content">
                        <p>We are a team of 4 people, and as a fun project we decided to create a cooking website. To find out more about the team go to the “about us” section and click on “meet the team”.</p>
                    </div>

                    <button className="collapsible collapsible-bottom" id="collapsible-bottom" onClick={(e) => this.collapseBottom(e)}>What are some of the limitations of this website?</button>
                    <div className="content content-bottom">
                    <p>This website relies on an API called "Spoonacular" and because this service is not monetised at the moment, the base tier of the API is limited to 150 API calls per day. So if you see the error message "The system is temporarily down! Please try again later!" it is mosy likely due to the API calls running out. You can try carrying out your search the following day.</p>
                    </div>
                </div>
            </div>
        )
    }
}
    
    export default FAQ