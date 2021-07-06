import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
    return(
        <div>
            <nav className="page-nav">
                <NavLink className="nav-link" activeClassName="active" exact to='/'>Home</NavLink>
                <NavLink className="nav-link" activeClassName="active" to='/login'>Login</NavLink>
                <NavLink className="nav-link" activeClassName="active" to='/register'>Create Account</NavLink>
            </nav>
        </div>
        )
    }

    export default Navbar