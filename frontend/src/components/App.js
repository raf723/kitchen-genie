import React from 'react'
import '../css/app.css'
import { setCookie, getCookie } from '../function-assets/helpers'

// Routing imports
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

// Component imports
import Navbar from './Navbar'
import Home from './Home'
import Register from './Register'
import Login from './Login'
import Results from './Results'
import About from './About'
import Recipe from './Recipe'
// V Remove V
import InputComments from './InputComments'
import Comments from './Comments'
import SavedRecipes from './SavedRecipes'

class App extends React.Component {
  initialState = {
    loggedInUser: null,
  }

  state = {...this.initialState}

  async componentDidMount(){
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
    
    if (response === 'success') {
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
        {/* Pass authentication result as a prop to toggle navigation bar buttons */}
        <Navbar userAuthenticated={ !!loggedInUser } onLogout={() => this.handleLogout()}/>

        <div id="app-container">
          <Switch>

            {/* Homepage */}
            <Route exact path='/'>
              <Home />
            </Route>

            {/* Register */}
            <Route path='/register'>
              <Register />
            </Route>

            {/* Login */}
            <Route path='/login'>
              <Login onLogin={this.loginHandler}/>
            </Route>

            {/* About us */}
            <Route path='/about'>
              <About />
            </Route>

            {/* FAQ */}
            <Route path='/faq'>
              <h1>FAQ</h1>
            </Route>

            {/* Saved recipes */}
            <Route path='/favourites'>
              <SavedRecipes onSaveRecipe={this.handleSaveRecipe}/>
            </Route>

            {/* V Remove V */}
            <Route path='/comments'>
              <InputComments recipeId={1} />
              {/* <Comments /> */}
            </Route>

            {/* Recipe results */}
            <Route path='/results' component={ Results }>
            </Route>

            {/* Single recipe */}
            <Route path='/recipe' component={ Recipe }>
            </Route>

          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
