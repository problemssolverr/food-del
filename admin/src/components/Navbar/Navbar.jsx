import React from 'react'
import './Navbar.css'
import {assets} from '../../admin_assets/assets'


const Navbar = () => {
  return (
    <div className='navbar'>
        <h3 className='logo'>NNEM RESTAURANT.</h3>
        <img src={assets.profile_image} alt="profile image" className='profile' />
    </div>
  )
}

export default Navbar