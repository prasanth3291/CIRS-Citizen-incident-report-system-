import React, { useEffect, useState } from 'react'
import './Login.css'
import email_icon from '../../assets/email.png'
import password_icon from '../../assets/password.png'
import {Navigate} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import {login, reset_email, reset_password_reset } from '../../features/user'
import { Link } from 'react-router-dom';
function Login() {   
    // implement validation logic 
    const [errors,setErrors] = useState({})
    const validateForm=()=>{
        const newErrors={}
        if(!loginData.username.trim()){
            newErrors.username = "Username is required"
        }
        if(!loginData.password.trim()){
            newErrors.password = "Password is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length===0
    }

    const dispatch = useDispatch()
    const{user,error}=useSelector(state=>state.user)
    console.log('ok',error)
    let[auth_tokens]=useState(()=>localStorage.getItem('authTokens')?JSON.parse(localStorage.getItem('authTokens')):null)
        const [loginData, setLoginData] = useState(
        {   username:"",
            password:""}
    )

    const reachGoogle = async () => {
        console.log('1')
        const client_id = '1013654891852-1nbqppqitq2d6r1bft65grcur39lg1na.apps.googleusercontent.com';
        const callBackURI = 'http://localhost:3000';
    
        try {
            // Redirect to Google login URL
            window.location.replace(`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${callBackURI}&prompt=consent&response_type=code&client_id=${client_id}&scope=openid%20email%20profile&access_type=offline`);
    
        } catch (error) {
            console.error('Google login error:', error);
        }
    };       


    const handleInputChange = (e)=>{
        const{name,value}=e.target
        setLoginData({...loginData,[name]:value}) 
    }
    const handleSubmit =(e)=>{
        e.preventDefault();   
        if (validateForm()){dispatch(login({loginData}))  }           
    }  

    const handleResetFp=(e)=>{
        dispatch(reset_password_reset())
        
    }
    
    if (user){
        return <Navigate to="/"/>
    }
  return (
    <div className='reg-container'>
        <div className='reg-header'>
            <div className='text'>Login</div>
            <div className='underline'></div>
        </div>
        <div className='reg-inputs'>        
            <div className="reg-input">
                <img src={email_icon} alt="" />
                <input type="text"
                 placeholder='Username'
                 name='username'
                 value={loginData.username}
                 onChange={handleInputChange}/>
            </div>
            
            {errors.username && <div className="error">{errors.username}</div>}
            <div className="reg-input">
                <img src={password_icon} alt="" />
                <input type="password" 
                placeholder='Password'
                name='password'
                value={loginData.password}
                onChange={handleInputChange}
                />
            </div>
            {errors.password && <span className="error">{errors.password}</span>}
            {error && <span className="error">{error.detail}</span>}
          

        </div>
        <div className="reg-forgot-password">Lost password? <Link to='/forgot_password' onClick={handleResetFp}>Click Here</Link></div>
        <div className="reg-submit-container">            
            <div className="reg-submit" onClick={handleSubmit}> Login</div>
        </div>
        <p className="or" style={{textAlign:'center'}}>Or login using</p>
            <div className="alt-login">
                <div className="google" onClick={reachGoogle}>
                    
                </div>
        
            </div>
        </div>  
  )
}

export default Login