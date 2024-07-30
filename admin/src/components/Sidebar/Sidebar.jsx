import React from 'react'
import './Sidebar.css'
import { assets } from '../../admin_assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className='sidebar-options'>
        <NavLink to='/add' className='sidebar-option'>
            <img src={assets.add_icon} alt="add icon image" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className='sidebar-option'>
            <img src={assets.order_icon} alt="add icon image" />
            <p>List Items</p>
        </NavLink>
        <NavLink to='/order' className='sidebar-option'>
            <img src={assets.order_icon} alt="add icon image" />
            <p>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar