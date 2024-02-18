import React from 'react'
import './footer.css'
import logo from '../Navbar/logo.png'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
   <footer>
    <div className='row'>
    <div className='col'>
    <img src={logo} className='logo'></img>
    <p>Welcome to our secure and seamless payment gateway, where convenience meets confidence. We understand the importance of smooth transactions in today's fast-paced digital world, and our gateway is designed to make every payment experience swift, secure, and hassle-free .</p>
    </div>
    <div className='col'>
    <h4>Office</h4>
    <p>ABC Road</p>
    <p>XYZ Raipur</p>
    <p>Chhattishgarh, India</p>
    <p className='email-id'>fastrpay@gmail.com</p>
    <h5>+91 - 1234567890</h5>
    </div>
    <div className='col'>
    <h4>Navigations</h4>
    <p><Link to='/'>Home</Link></p>
    <p><Link to = "/services">Services</Link></p>
    <p><Link to='/about'>About</Link></p>
    <p><Link to='/contact-us'>Contact Us</Link></p>
    <p><Link to='/contact-us'>Contact Us</Link></p>
    </div>
    <div className='col'>
        <h4>Newsletter</h4>
        <form>
            <input type='email' placeholder='enter your email-id' required></input>
        </form>
    </div>
    </div>
    <hr></hr>
    <div className='copyright'>
        <p>@copyright 2024 FastrPay</p>
    </div>
   </footer>
  )
}

export default Footer
