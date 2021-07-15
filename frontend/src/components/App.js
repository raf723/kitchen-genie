import React from 'react'

// Styling imports
import '../css/app.css'

// Function imports
import { setCookie, getCookie } from '../function-assets/helpers'

// Routing imports
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// Component imports
import Navbar from './Navbar'
import Home from './Home'
import Register from './Register'
import Login from './Login'
import Results from './Results'
import AboutUs from './AboutUs'
import Recipe from './Recipe'
import SavedRecipes from './SavedRecipes'
import Error from './Error'

class App extends React.Component {
  initialState = {
    loggedInUser: null,
  }

  state = { ...this.initialState }

  // Authenticate current user using cookies
  async componentWillMount(){
    const currentSession = getCookie('sessionId') ?? null
    if (currentSession) {
      const apiResponse = await fetch(`http://localhost:8080/sessions/${currentSession}`)
      const loggedInUser = await apiResponse.json()
      this.setState({ loggedInUser })
    }
  }

  loginHandler = async ({ email, password, remember }) => {
    const apiResponse = await fetch(`http://localhost:8080/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember })
    })
    
    const { response, currentUser } = await apiResponse.json()
    
    if (response) {
      this.setState({ loggedInUser: currentUser })
      window.location.replace('/')
    } else {
      alert("Either your email or password is incorrect!") 
    }
  }
  
  handleLogout() {
    setCookie('sessionId', null, 0)
    window.location.replace('/')
  }

  handleSaveRecipe = async (recipeId, toSave=true) => {
    const apiResponse = await fetch(`http://localhost:8080/save/${recipeId}/${ toSave ? 'save' : 'unsave'}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    const { response } = await apiResponse.json()

    if (response === 'success') {
      return toSave
    } else if (response === 'bad credential') {
        alert("Unauthorized access!\nYou must log in to access saved recipes!")
        window.location.replace('/login')
    } else {
        window.location.replace('/error')
    }
  }
  
  

  render() {
    const { loggedInUser } = this.state

    return(
      <Router>
        { /* Pass authentication result as a prop to toggle navigation bar buttons */ }
        <Navbar userAuthenticated={ !!loggedInUser } onLogout={ () => this.handleLogout() }/>

        <div id="app-container">
          <Switch>
            <Route exact path='/'>
              <Home/>
            </Route>

            <Route path='/register'>
              <Register/>
            </Route>

            <Route path='/login'>
              <Login onLogin={ this.loginHandler }/>
            </Route>

            <Route path='/about'>
              <AboutUs/>
            </Route>

            <Route path='/faq'>
              <h1>FAQ</h1>
              <p>How long have you guys worked on this website?</p>
              <p>2 Weeks.</p>
              <br />
              <p>Can we post any suggestions we have?</p>
              <p>Of course, we are always welcome for new suggestions, user feedback, any glitches or bugs you may want to report etc. Please do so by contacting us on: example@email.com.</p>
              <br />
              <p>How do I search / find recipes?</p>
              <ol>
                <li>You type in the ingredients you desire and hit enter.</li>
                <li>After each ingredient you should see the ingredient selected below the search bar.</li>
                <li>Once satisfied click Go.</li>
                <li>A list of recipes will show up showing the number of ingredients you have and the number of ingredients you are missing. Hovering over the number of missing ingredients will show exactly which ingredients are actually missing.</li>
                <li>Once satisfied with a result click on it to open up the page which has step by step instructions on how to make the food.</li>
                <li>You can also rate the recipes and save them to your favourites if you log in.</li>
              </ol>
              <br />
              <p>What can I search for?</p>
              <p>At the moment only ingredients, but in the future we plan to allow searching for recipe names directly as well.</p>
              <br />
              <p>Can I search for meal types?</p>
              <p>Once ingredients have been selected, checkboxes for meal types / categories will be available. Just check the ones you desire and enjoy.</p>
              <br />
              <p>Do I have to pay for this service?</p>
              <p>No this service is completely free.</p>
              <br />
              <p>Is this website monetised?</p>
              <p>No, this service is not currently monetised.</p>
              <br />
              <p>Are there any ads on this service?</p>
              <p>No there is currently no ads on this website with no immediate plans to introduce any anytime soon.</p>
              <br />
              <p>What happens with my data?</p>
              <p>We comply with any international and national laws regarding data protection. Your data remains safe and protected, and we do not share this data with any other website or organisation.</p>
              <br />
              <p>Who are you?</p>
              <p>We are a team of 4 people, and as a fun project we decided to create a cooking website. To find out more about the team go to the “about us” section and click on “meet the team”.</p>
              <br />
              <p>What is unique about your service?</p>
            </Route>

            <Route path='/favourites'>
              <SavedRecipes onSaveRecipe={ this.handleSaveRecipe }/>
            </Route>

            <Route path='/results' component={ Results }>
            </Route>

            <Route path='/recipe' component={ Recipe }>
            </Route>

            <Route path='/error'>
              <Error />
            </Route>

            <Route path='/recipe'
              render={ (props) => (
                <Recipe { ...props } 
                  userAuthenticated={this.state.loggedInUser} 
                  onSaveRecipe={this.handleSaveRecipe}
                /> )}>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
