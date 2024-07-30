import React from 'react'
import './Header.css'
import {Link, useNavigate} from 'react-router-dom'

const Header = () => {
  return (
    <div className='header'>
        <div className='header-content'>
            <h2>Order your favorite food here</h2>
            <p>Choose from diverse menu featuring a delectable array of dishes crafted with the finest</p>
            <button><a href="#explore-menu">View Menu</a></button>
        </div>
    </div>
  )
}

export default Header