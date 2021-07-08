import React from 'react'
import '../css/app.css'
import { setCookie, getCookie } from '../function-assets/helpers'

// Routing imports
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

// Component imports
import Navbar from './navbar'
import Home from './home'
import Register from './register'
import Login from './login'
import Results from './results'
import About from './about'

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
      this.setState({loggedInUser})
    }
  }
  
  handleLogout() {
    setCookie('sessionID', null, 0)
    this.setState(this.initialState)
    window.location.replace("/")
  }

  render() {
    return(
      <Router>
        {/* Pass authentication result as a prop to toggle navigation bar buttons */}
        <Navbar userAuthenticated={ !!this.state.loggedInUser }/>

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

            {/* Login page */}
            <Route path='/login'>
              <Login />
            </Route>

            {/* About us */}
            <Route path='/about'>
              <About />
            </Route>

            {/* Saved recipes */}
            <Route path='/favourites'>
              <h1>Favourites</h1>
            </Route>

            {/* Recipe results */}
            <Route path='/results' component={ Results }>
            </Route>

          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
