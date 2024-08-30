import React, { useEffect, useState } from 'react'
import './Home.css'
import {useSelector,useDispatch} from 'react-redux'
import  {googleLogin,resetgerror} from '../../features/user'
import queryString from 'query-string';
import {useLocation} from 'react-router-dom'
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';

function Home() {
  const dispacth=useDispatch()
  const location=useLocation()
  const [cardWidth, setCardwidth] = useState('100%')
  const [cardFontH2, setCardFontH2] = useState('200%')
  const [cardFontH4, setCardFontH4] = useState('150%')
  let count=0
  useEffect (() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      const maxWidth = 50; 
      const widthPercentage = maxWidth - (screenWidth/110); 
      const cardfontpercentageH2 = (screenWidth/7);  
      const cardfontpercentageH4 = (screenWidth/9.5);   
      setCardwidth(`${widthPercentage}%`);
      setCardFontH2(`${cardfontpercentageH2}%`)
      setCardFontH4(`${cardfontpercentageH4}%`)
    };
    // Call updateWidth initially and add event listener for resizing
    updateWidth();
    window.addEventListener('resize', updateWidth);
    const values = queryString.parse(location.search);
    const code = values.code;    
    if ( code && count===0 ) {
      dispacth(googleLogin(code))
      count =count+1
      // Remove the code from the URL to clean up
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      dispacth(resetgerror()) 
    }
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
}, [location]);
  const {google_error}=useSelector(state=>state.user)  
  return (
<div>
  {google_error ? (
    Object.keys(google_error).map(key => (
      <div style={{justifyContent:'center',display:"flex", alignItems:'center',marginTop:'100px'}}><span className="error" 
      style={{margin:'30px',padding:'20px',fontSize:'30px',fontFamily:'cursive', height:'300px' ,width:'500px',backgroundColor:'white'}} key={key}>{google_error[key]}</span></div>
      
    ))
  ) : (
    <div>
       <Image src={process.env.PUBLIC_URL + '/assets/images/home1.png'} fluid style={{width:'100%' ,height:'auto', margin:'0'}} />
       <Card className='bg-image-textbox d-none d-sm-block' style={{width:cardWidth}} >
      <Card.Body ><h2 style={{fontSize:cardFontH2}}>
        We protect the state of kerakam and <br />
        uphold the indico constitution</h2>
        <br />
        <br />
        <h4 style={{fontSize:cardFontH4}}>
          You can report suspicious activaties 
          <br />
          and crime by contacting  us 24X7 at
          <br />
          cirs/report/sample.in          
        </h4></Card.Body>
      </Card>
       <div >
        </div>

    </div>
  )}
</div>

  )
}

export default Home