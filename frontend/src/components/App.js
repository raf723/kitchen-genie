import React from 'react'

// Styling imports
import '../css/app.css'

// Function imports
import { setCookie, getCookie } from '../function-assets/helpers'

// Routing imports
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

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
import FAQ from './FAQ'

class App extends React.Component {
  initialState = {
    loggedInUser: null,
  }

  state = { ...this.initialState }

  // Authenticate current user using cookies
  async componentDidMount(){
    const currentSession = getCookie('sessionId') ?? null
    if (currentSession) {
      const apiResponse = await fetch(`${process.env.REACT_APP_URL}/sessions/${currentSession}`)
      const loggedInUser = await apiResponse.json()
      this.setState({ loggedInUser })
    }
  }

  loginHandler = async ({ email, password, remember }) => {
    const apiResponse = await fetch(`${process.env.REACT_APP_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember })
    })
    
    const { response, currentUser } = await apiResponse.json()
    
    if (response) {
      this.setState({ loggedInUser: currentUser })
    } else {
      alert("Either your email or password is incorrect!") 
    }
  }
  
  handleLogout() {
    setCookie('sessionId', null, 0)
    this.props.history.push('/')
  }

  handleSaveRecipe = async (recipeId, toSave=true) => {
    const apiResponse = await fetch(`${process.env.REACT_APP_URL}/save/${recipeId}/${ toSave ? 'save' : 'unsave'}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    const { response } = await apiResponse.json()

    if (response === 'success') return toSave
    else if (window.confirm("Please log in or create an accout to save recipes!")) this.props.history.push('/login')
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
              { loggedInUser ? <Redirect to="/" /> : <Login onLogin={ this.loginHandler }/> }
            </Route>

            <Route path='/about'>
              <AboutUs/>
            </Route>

            <Route path='/faq'>
              <FAQ />
            </Route>

            <Route path='/favourites'>
              <SavedRecipes onSaveRecipe={ this.handleSaveRecipe }/>
            </Route>

            <Route path='/results' component={ Results }>
            </Route>

            <Route path='/error'>
              <Error />
            </Route>

            <Route
              path='/recipe'
              render={ (props) => <Recipe { ...props } userAuthenticated={ this.state.loggedInUser } onSaveRecipe={ this.handleSaveRecipe }/> }>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
