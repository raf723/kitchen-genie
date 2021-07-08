import React from 'react'
import { NavLink } from 'react-router-dom'
import '../css/navbar.css'

function Navbar( {userAuthenticated} ) {
  return(
    <div>
      <nav className="page-nav">
        <NavLink className="nav-link" activeClassName="active" exact to='/'>Home</NavLink>
        {userAuthenticated === false && <NavLink className="nav-link" activeClassName="active" to='/login'>Login</NavLink>}
        {userAuthenticated === false && <NavLink className="nav-link" activeClassName="active" to='/register'>Create Account</NavLink>}
        {userAuthenticated && <NavLink className="nav-link" activeClassName="active" to='/favourites'>Favourites</NavLink>}
        {userAuthenticated && <NavLink className="signout-nav-link" to='/'>Sign Out</NavLink>}
        <NavLink className="nav-link" activeClassName="active" to='/about-us'>About Us</NavLink>
      </nav>
    </div>
  )
}

export default Navbar
