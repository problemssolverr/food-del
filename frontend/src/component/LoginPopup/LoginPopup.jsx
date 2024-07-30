import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({setShowLogin}) => {
  const [currentState, setCurrentState] = useState('Login') 

  const {url, setToken} = useContext(StoreContext)

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({...data, [name]: value}))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    let newUrl = url;
    if (currentState === 'Login') {
      newUrl += '/api/user/login';
    } else {
      newUrl += '/api/user/register';
    }

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login/Register error:', error);
      alert('An error occurred. Please try again.');
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} action="" className='login-popup-container'>
        <div className='login-popop-title'>
          <h1>{currentState}</h1>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className='login-popup-input'>
          {currentState === 'Login' ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='your name' required />}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='your email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='your password' required/>
        </div>
        <button type='submit'>{currentState === 'Sign Up' ? 'Create Account' : 'Login'}</button>
        <div className='login-pop-condition'>
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currentState === "Login" 
        ?  <p>Create a new account? <span onClick={() => setCurrentState('Sign Up')}>Sign Up Here</span></p>
        : <p>Already have an account? <span onClick={() => setCurrentState('Login')}>Sign In</span></p>
        }
        
        
      </form>
    </div>
  )
}

export default LoginPopup