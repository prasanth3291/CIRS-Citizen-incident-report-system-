import React, { useEffect, useState } from 'react'
import './Register.css'
import email_icon from '../../assets/email.png'
import password_icon from '../../assets/password.png'
import person_icon from '../../assets/person.png'
import {Navigate} from 'react-router-dom'
import { register } from '../../features/user'
import { useSelector, useDispatch } from 'react-redux';
function Register() {
    const [errors,setErrors] = useState({})
    const validateForm=()=>{
        const newErrors={}
        if(!formData.first_name.trim()){
            newErrors.first_name = "First_name is required"
        }
        if(!formData.password.trim()){
            newErrors.password = "Password is required"
        }
        if(!formData.last_name.trim()){
            newErrors.last_name = " Last name is required"
        }
        if(!formData.password.trim()){
            newErrors.username = "Username is required"
        }
        if(!formData.email.trim()){
            newErrors.email = "Email is required"
        }
        if(!formData.confirm_password.trim()){
            newErrors.confirm_password = "Confirm Password is required"
        }
        if(formData.password != formData.confirm_password){
            newErrors.password_error = "password mismatch"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length===0
    }


    const dispatch = useDispatch()
    const { registered, loading,error } = useSelector(state => state.user);
    const [formData, setFormData] = useState({
        first_name:"",
        last_name:"",
        username:"",
        email:"",
        password:"",
        confirm_password:""}
    )

    const handleInputChange = (e) =>{
        const{name,value}=e.target;
        setFormData({...formData,[name]:value})
    }

    const handleSubmit = async () => {
        try {
            if (validateForm()){dispatch(register({formData}));}
            
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
        }
    }
    
    if (registered) {return <Navigate to='/login' />;}
    
  return (
    <div className='reg-container'>
        <div className='reg-header'>
            <div className='text'>Register</div>
            <div className='underline'></div>
        </div>
        <div className='reg-inputs'>
            <div className="reg-input">
                <img src={person_icon} alt="" />
                <input type="text"
                 placeholder='First Name'
                 name="first_name"
                 value={formData.first_name}
                 onChange={handleInputChange}
                 />
            </div>
            {errors.first_name && <span className="error">{errors.first_name}</span>}
            <div className="reg-input">
                <img src={person_icon} alt="" />
                <input type="text"
                 placeholder='Last Name'
                 name="last_name"
                 value={formData.last_name}
                 onChange={handleInputChange}/>
            </div>
            {errors.last_name && <span className="error">{errors.last_name}</span>}
            <div className="reg-input">
                <img src={person_icon} alt="" />
                <input type="text"
                 placeholder='Username'
                 name="username"
                 value={formData.username}
                 onChange={handleInputChange}/>
            </div>
            {errors.username && <span className="error">{errors.username}</span>}
            <div className="reg-input">
                <img src={email_icon} alt="" />
                <input type="email" 
                placeholder='Email'
                name="email"
                value={formData.email}
                onChange={handleInputChange}/>
            </div>
            {errors.email && <span className="error">{errors.email}</span>}
            <div className="reg-input">
                <img src={password_icon} alt="" />
                <input type="password"
                 placeholder='Password'
                 name="password"
                 value={formData.password}
                 onChange={handleInputChange}/>
            </div>
            {errors.password && <span className="error">{errors.password}</span>}
            <div className="reg-input">

                <img src={password_icon} alt="" />
                <input type="password"
                 placeholder='Confirm Password'
                 name="confirm_password"
                 value={formData.confirm_password}
                 onChange={handleInputChange}/>
            </div>
            {errors.confirm_password && <span className="error">{errors.confirm_password}</span>}
            {errors.password_error && <span className="error">{errors.password_error}</span>}
            {error && Object.keys(error).map(key => (
            <span className="error" key={key}>{error[key]}</span>
            ))}

        </div>
        <div className="reg-forgot-password">Lost password? <span>Click here</span></div>
        <div className="reg-submit-container">
            <div className="reg-submit" onClick={handleSubmit}> Sign up</div>
            {/* <div className="reg-submit"> Login</div> */}
        
            {error && <span className="error">{error.detail}</span>}
        </div>
    </div>
   
  )
}

export default Register