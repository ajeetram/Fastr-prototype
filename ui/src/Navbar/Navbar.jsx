import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './navbar.css';
import logo from './logo.png';

const Navbar = () => {
  return (
    <div className='nav-container'>
      <section className='fastr-logo'>
        <img src={logo} alt='logo'></img>
      </section>
      <section className='links'>
        <Link to='/'>Home</Link>
        <div className="dropdown">
          <Link className="dropbtn">Services</Link>
          <div className="dropdown-content">
            <Link to='/services/upi'>UPI</Link>
            {/* <Link to='/services/card'>Card</Link> */}
            <Link to='/services/multi-card'>MultiCard</Link>
            <Link to='services/card-upi'>Card-UPI</Link>
          </div>
        </div>
        <Link to='/about'>About</Link>
      </section>
    </div>
  );
};

export default Navbar;
