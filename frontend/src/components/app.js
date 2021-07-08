import React from 'react'
import '../css/app.css'

// Routing imports
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

// Component imports
import Navbar from './navbar'
import Home from './home'
import Register from './register'
import Login from './login'
import Results from './results'

function App() {
  return(
    <Router>
      <Navbar />

      <div id="app-container">
        <Switch>

          <Route exact path='/'>
            <Home />
          </Route>

          <Route path='/register'>
            <Register />
          </Route>

          <Route path='/login'>
            <Login />
          </Route>
          
          <Route path='/about-us'>
            <h1>About Us</h1>
          </Route>
          
          <Route path='/results' component={ Results }>
          </Route>

        </Switch>
      </div>
    </Router>
  )
}

export default App
