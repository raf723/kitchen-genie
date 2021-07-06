import React from 'react'
import '../css/app.css'

// Routing imports
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

// Component imports
import Navbar from './navbar'
import Register from './register'
import Login from './login'
import Home from './home'

class App extends React.Component {
  render() {
    return (
      <div id="app-container">
        <Router>
          <Switch>
            { /* Login */ }
            <Route exact path="/login">
              <Login/>
            </Route>

            { /* Register */ }
            <Route exact path="/register">
              <Register/>
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
