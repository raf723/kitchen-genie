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
    setCookie('sessionID', null, 0)
    this.setState({...this.initialState})
  }

  render() {
    return(
      <Router>
        {/* Pass authentication result as a prop to toggle navigation bar buttons */}
        <Navbar userAuthenticated={ !!this.state.loggedInUser } onLogout={() => this.handleLogout()}/>

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
              <h1>Favourites</h1>
            </Route>

            {/* Recipe results */}
            <Route path='/results' component={ Results }>
            </Route>

            {/* Single recipe */}
            <Route path='/recipe' render={(props) => <Recipe {...props} userAuthenticated={this.state.loggedInUser}/>}>
            </Route>

          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
