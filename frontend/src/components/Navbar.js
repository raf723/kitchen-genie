import React from 'react'
import '../css/navbar.css'
import { NavLink } from 'react-router-dom'

function Navbar( {userAuthenticated, onLogout} ) {
  return(
    <div id="nav-container">
      <nav className="page-nav">
        {/* Left: Home icon */}
        <NavLink
          className="logo-link"
          activeClassName="active"
          exact to='/'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgb(116,166,127)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-home">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        </NavLink>

        {/* Center: Navigation buttons */}
        <div className="middle-nav">
          {/* If user is authenticated, show Favourites button, else show Login and Create Account buttons */}
          {userAuthenticated === false && <NavLink className="nav-link" activeClassName="active" to='/login'>Login</NavLink>}
          {userAuthenticated === false && <NavLink className="nav-link" activeClassName="active" to='/register'>Create Account</NavLink>}
          {userAuthenticated && <NavLink className="nav-link" activeClassName="active" to='/favourites'>Favourites</NavLink>}
          
          <NavLink className="nav-link" activeClassName="active" to='/faq'>FAQ</NavLink>
          <NavLink className="nav-link" activeClassName="active" to='/about'>About Us</NavLink>
        </div>

        {/* Right: Sign out button */}
        {userAuthenticated && <NavLink className="signout-nav-link" to='/' onClick={() => onLogout()}>Sign Out</NavLink>}
      </nav>
    </div>
  )
}

export default Navbar
