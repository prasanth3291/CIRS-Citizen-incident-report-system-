import React, { useState } from 'react'
import './Station_login.css'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../features/user'

function Station_login() {
  // Here get the username and passwords
  const [loginData, setLoginData] = useState({username:'',password:'',user_type:'staff'})
  const handleInputChange=(e)=>{
    const {name,value}=e.target
    setLoginData({...loginData,[name]:value})
  }
  //Here set a function for submitting user data
    // use usedispatch to xr details to the store for authentication
  const dispatch=useDispatch()
  const handleSubmit=(e)=>{
      e.preventDefault()
      if (validateForm()){
      dispatch(login({loginData}))
      }
    }
  // validate forms before submitting
  const [errors, setErrors] = useState({})
  const validateForm=()=>{
    const newErrors={};
    if(!loginData.username.trim()){
        newErrors.username="username is Required"
    }
    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;


  }


  return (
    <div className="login-container">
      <div className="login-box">
        <h2>STAFF LOGIN</h2>
        <form>
          <div className="input-field">
            <i className="fa fa-user"></i>
            <input 
            type="text" 
            placeholder="Username" 
            name='username'
            value={loginData.username}
            onChange={handleInputChange}
            required />
          </div>
          {errors.username && <div className="error">{errors.username}</div>}
          <div className="input-field">
            <i className="fa fa-lock"></i>
            <input 
            type="password"
            placeholder="Password" 
            name='password'
            value={loginData.password}
            onChange={handleInputChange}
            required />
          </div>
          {errors.password && <div className="error">{errors.password}</div>}
          <button type="submit" className="login-button" onClick={handleSubmit}>LOGIN</button>
          <div className="forgot-password">
            <a href="#">Forgot Password? <span>Click Here</span></a>
          </div>
        
        </form>
      </div>
    </div>
  )
}

export default Station_login
