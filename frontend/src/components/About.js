import React from 'react'
import '../css/about.css'

function Inspiration() {
    return (
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget ipsum sagittis erat consectetur mollis in sed mi. Donec pellentesque, est non condimentum rhoncus, nunc est pharetra est, volutpat rhoncus neque massa nec velit. Sed id turpis nec nisl elementum eleifend. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris sagittis tortor sem, ac dictum metus consequat eu. Phasellus in vehicula ipsum. Praesent at dolor vestibulum, posuere orci vel, suscipit mi. Vestibulum pellentesque fringilla risus pellentesque placerat. Aenean at efficitur libero. Praesent in turpis sit amet ante condimentum placerat at et odio. Nulla facilisi. Quisque molestie vestibulum convallis. Donec hendrerit vel dui non luctus.</p>
    )
}

function MeetTheTeam() {
    return (
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet suscipit purus, non aliquet nibh. Sed diam dui, bibendum ac tempus vel, rhoncus ac nisi. Phasellus ut vulputate ex. Mauris a tristique magna. Fusce vehicula tellus vitae ornare efficitur. Sed commodo tempor tempor. Sed maximus tincidunt sapien, ac elementum felis aliquam sed. Mauris a condimentum justo. Pellentesque sodales consequat sapien ut lacinia.</p>
    )
}

function FAQ() {
    return (
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel lorem mi. Etiam eu nibh faucibus, accumsan tellus ut, mollis sem. Maecenas in lacus iaculis, gravida orci sit amet, efficitur neque. In quis dolor non lacus interdum condimentum. Integer finibus condimentum felis id faucibus. Nam quis interdum eros. Maecenas tincidunt euismod nisl nec egestas. Proin eget imperdiet purus. Sed pulvinar ac enim sed imperdiet. Cras odio leo, rhoncus in nisi quis, interdum accumsan purus. Pellentesque urna sapien, sollicitudin non lorem sed, elementum commodo tellus. Phasellus lacinia vel tellus id viverra. Praesent vitae urna at turpis tincidunt pellentesque. Proin mollis ligula libero, a dignissim arcu convallis vitae. Proin ac commodo ligula, at blandit purus. Fusce tortor nunc, sagittis eget viverra non, accumsan vitae nisl.</p>
    )
}

function ContactUs() {
    return (
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras elementum justo ut finibus pulvinar. Nam dui arcu, vulputate eu malesuada at, tincidunt quis ante. Fusce iaculis nisi ut lacus interdum, eu egestas odio dignissim. Pellentesque blandit dolor a placerat malesuada. Duis hendrerit ultrices dui a finibus. Vestibulum sed ultricies metus, nec placerat urna. Integer quis eros nunc. Pellentesque eros turpis, efficitur semper aliquet ut, tincidunt id est. Sed porta placerat lorem, eget fermentum eros mollis eget. Nam mattis tortor et ante posuere, ac malesuada enim tempus. Nullam bibendum ut erat a pharetra. Vestibulum consectetur nisi ut felis pellentesque, euismod facilisis erat convallis. Suspendisse felis mauris, lobortis non leo at, convallis laoreet dolor. Vestibulum vehicula urna eget maximus placerat. Praesent volutpat, arcu eu finibus aliquet, mauris nunc pharetra lacus, et pellentesque magna leo sit amet elit.</p>
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
                    <span onClick={ () => this.setState({currentTab: "inspiration"})} className={ currentTab === "inspiration" ? "active tab" : "tab"}>Inspiration</span>
                    <span onClick={ () => this.setState({currentTab: "team"})} className={ currentTab === "team" ? "active tab" : "tab"}>Meet The Team</span>
                    <span onClick={ () => this.setState({currentTab: "faq"})} className={ currentTab === "faq" ? "active tab" : "tab"}>FAQ</span>
                    <span onClick={ () => this.setState({currentTab: "contact"})} className={ currentTab === "contact" ? "active tab" : "tab"}>Contact Us</span>
                </nav>
                { currentTab === "inspiration" && <Inspiration />}
                { currentTab === "team" && <MeetTheTeam />}
                { currentTab === "faq" && <FAQ />}
                { currentTab === "contact" && <ContactUs />}
            </div>
        )
    }
}

export default About
