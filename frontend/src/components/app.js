import React from 'react'
import '../css/app.css'

// Routing imports
import { BrowserRouter as Router, Switch, Route, Redirect, } from 'react-router-dom'

// Component imports
import Navbar from './navbar'
import Register from './register'
import Login from './login'
import Home from './home'
import About from './About-us'

class App extends React.Component {
  constructor() {
    super()
    this.state = { userAuthenticated: false}
  }

  render() {
    return(
      <Router>
        <div>
          <Navbar userAuthenticated={ this.state.userAuthenticated }/>

          <Switch>
            <Route path='/about-us'>
              <About />
            </Route>
            <Route path='/favourites'>
              <h1>Favourites</h1>
            </Route>
            <Route path='/register'>
              <Register />
            </Route>
            <Route path='/login'>
              <Login />
            </Route>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
