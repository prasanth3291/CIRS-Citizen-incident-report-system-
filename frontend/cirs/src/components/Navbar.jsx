import React, {useState,useEffect } from 'react'
import {NavLink} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import { FaSearch } from 'react-icons/fa';
import "./Navbar.css"
import  {logoutUser} from '../features/user'
function Navbar() { 
  const dispatch=useDispatch()
  const [menuOpen, setMenuOpen] = useState(false)
  const {user} =useSelector(state=>state.user)   
  console.log(user)
  const handlelogout=()=>{
    localStorage.removeItem('authTokens')
    dispatch(logoutUser())
    
  }
  
  return (
    <nav style={{zIndex:'100'}}>
        <ul>
          <li><NavLink to="/" >Home </NavLink></li>
          <div className='menu' onClick={()=>{setMenuOpen(!menuOpen)}}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <li className={menuOpen? 'display' : ''}><NavLink to="/about">About</NavLink></li>
          <li className={menuOpen? 'display' : ''}><NavLink to="/news">News</NavLink></li>
          <li className={menuOpen? 'display' : ''}><NavLink to="/report">Report</NavLink></li>
          <li className={menuOpen?'display'  : ''}><NavLink to='/dashboard'>Dashboard</NavLink></li>
          
        </ul>
        <ul >
        {!user && <li className={menuOpen ? 'display' : ''}><NavLink to="/register">Register</NavLink></li>}
        {user && <li className={menuOpen ? 'display' : ''} > <h6> Hai {user.user?user.user.first_name:user.first_name}</h6></li>}
        {user && <li className={menuOpen ? 'display' : ''} onClick={handlelogout}><NavLink>Logout</NavLink> </li>}
        {!user && <li className={menuOpen ? 'display' : ''}><NavLink to="/login">Login</NavLink></li>}
        
    

            <li className={menuOpen? 'display' : ''}>
            <input
                    type="text"
                    placeholder="Search..."
                  
              />
              <FaSearch  style={{position:'relative',right:'20', bottom:"2px"}}/>            
              </li>

        </ul>
       

    </nav>
  )
}

export default Navbar