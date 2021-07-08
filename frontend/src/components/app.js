import React from 'react'
import '../css/app.css'

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
  constructor() {
    super()
    this.state = { userAuthenticated: false}
  }

  render() {
    return(
      <Router>
        {/* Pass authentication result as a prop to toggle navigation bar buttons */}
        <Navbar userAuthenticated={ this.state.userAuthenticated }/>

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
              <Login />
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
            <Route path='/recipe' component={ Recipe }>
            </Route>

          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
