import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css'

const Navbar = () => {

    return (
        <React.Fragment>
            <nav className="nav-container">
                <div className="heading">
                    <Link to='/' >Tasks</Link>
                </div>
            </nav>
        </React.Fragment>
    )
}

export default Navbar