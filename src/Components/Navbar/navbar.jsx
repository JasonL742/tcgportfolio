import React from 'react';
import './navbar.css'; 

const Navbar = () => {  
    return (
      <header className="header">
        <a href="/" className="logo">Logo</a>
        <nav className="navbar"></nav>
          <a href = "/">Home</a>
          <a href = "/">About</a>
          <a href = "/">Login/Sign-up</a>
      </header>
    )
}
export default Navbar;