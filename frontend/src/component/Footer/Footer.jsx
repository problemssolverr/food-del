import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Footer = () => {
    const [menu, setMenu] = useState("home")
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            <div className='footer-content-left'>
            <Link to='/'><h3 className='logo'>NNEM RESTAURANT.</h3></Link>
                <p>Opposite Nepa Office, Katampe 1 Mpape Abuja, FCT.</p>
                <div className='footer-social-icons'>
                    <a href="https://www.facebook.com/profile.php?id=100084057777437"><img src={assets.facebook_icon} alt="" /></a>
                    <a href="https://x.com/problemsso45876"><img src={assets.twitter_icon} alt="" /></a>
                    <a href="https://www.linkedin.com/in/ayobami-enoch-85ab5a250/"><img src={assets.linkedin_icon} alt="" /></a>
                </div>
            </div>
            <div className='footer-content-center'>
                <h1>COMPANY</h1>
                <ul>
                    <Link to='/' onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>home</Link>
                    <li><a href="#explore-menu">Menu</a></li>
                    <li>Contact</li>
                </ul>
            </div>
            <div className='footer-content-right'>
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+2349069788240</li>
                    <li>problemssolvr@gmail.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <p className='footer-copyright'>Copyright 2024 &#169; problemssolvr.com - All Right Reserved</p>
    </div>
  )
}

export default Footer