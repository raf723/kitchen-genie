import React from 'react';
import '../css/faq.css'



class FAQ extends React.Component {

    collapse() {
        var coll = document.getElementsByClassName("collapsible");
        var i;
        
        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight){
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                } 
            });
        }
    }

    render() {
        return (
            <div id="faq-container">
                <h1>Frequently Asked Questions</h1>
                <p className="faq-info">Everything you need to know to use KitchenGenie like a pro</p>

                <div className="collapse">

                    <button className="collapsible collapsible-top" onClick={this.collapse}>How long have you guys worked on this website?</button>
                    <div className="content">
                        <p>2 Weeks.</p>
                    </div>

                    <button className="collapsible" onClick={this.collapse}>Can we post any suggestions we have?</button>
                    <div className="content">
                        <p>Of course, we are always welcome for new suggestions, user feedback, any glitches or bugs you may want to report etc. Please do so by contacting us on: example@email.com.</p>
                    </div>

                    <button className="collapsible" onClick={this.collapse}>How do I search for recipes?</button>
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

                    <button className="collapsible" onClick={this.collapse}>What can I search for?</button>
                    <div className="content">
                        <p>At the moment only ingredients, but in the future we plan to allow searching for recipe names directly as well.</p>
                    </div>

                    <button className="collapsible" onClick={this.collapse}>Can I search for meal types?</button>
                    <div className="content">
                        <p>Once ingredients have been selected, checkboxes for meal types / categories will be available. Just check the ones you desire and enjoy.</p>
                    </div>

                    <button className="collapsible" onClick={this.collapse}>Do I have to pay for this service?</button>
                    <div className="content">
                        <p>No this service is completely free.</p>
                    </div>

                    <button className="collapsible" onClick={this.collapse}>Is this website monetised?</button>
                    <div className="content">
                        <p>No, this service is not currently monetised.</p>
                    </div>

                    <button className="collapsible" onClick={this.collapse}>Are there any ads on this service?</button>
                    <div className="content">
                        <p>No there is currently no ads on this website with no immediate plans to introduce any anytime soon.</p>
                    </div>

                    <button className="collapsible" onClick={this.collapse}>What happens with my data?</button>
                    <div className="content">
                        <p>We comply with any international and national laws regarding data protection. Your data remains safe and protected, and we do not share this data with any other website or organisation.</p>
                    </div>

                    <button className="collapsible" onClick={this.collapse}>Who are you?</button>
                    <div className="content">
                        <p>We are a team of 4 people, and as a fun project we decided to create a cooking website. To find out more about the team go to the “about us” section and click on “meet the team”.</p>
                    </div>

                    <button className="collapsible collapsible-bottom" onClick={this.collapse}>What is unique about your service?</button>
                    <div className="content">
                    </div>
                </div>
            </div>
        )
    }
}
    
    export default FAQ