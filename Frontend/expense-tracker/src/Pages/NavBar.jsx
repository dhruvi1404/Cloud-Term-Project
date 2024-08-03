import React from 'react';
import { Link } from 'react-router-dom';
import '../Pages/NavBar.css'

const Navbar = () => {
    return (
      <nav className="navbar">
        <div>
          <h1>Expese Tracker</h1>
        </div>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/register" className="navbar-link">Register</Link>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
