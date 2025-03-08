import React from 'react';
import './navbar.css'; 
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'; 
import Sign from './signin'
const Navbar = () => {  
    return (
    <div className='bar'>
      <header className="header">
        <a href="/" className="logo">Logo</a>
        <nav className="navbar">
          <a href = "/">Home</a>
          <a href = "/">About</a>
          <Link to="./signin">Login/Sign-up</Link>
          </nav>
      </header>
      </div>
    )
}
export default Navbar;