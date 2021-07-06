import React from 'react'
import '../css/app.css'

// Routing imports
import { BrowserRouter as Router, Switch, Route, Redirect, } from 'react-router-dom'

// Component imports
import Navbar from './navbar'
import Register from './register'
import Login from './login'
import Home from './home'

export default App

function App() {
  return(
    <Router>
      <div>
        <Navbar />

        <Switch>
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
  );
}
