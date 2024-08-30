import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {useSelector,useDispatch} from 'react-redux'
import {Navigate} from 'react-router-dom'
import { forgot_password_email_verification, reset_password } from '../features/user';
function Forgot_password() {
  const dispatch = useDispatch()
  const {email_verified,verified_email,password_reset,password_reset_error}=useSelector(state=>state.user)
  const [email, setEmail] = useState('')
  const [formData, setFormData] = useState({
    otp:"",
    password:"",
    confirm_password:""
  })
  console.log('error',password_reset_error)
  const [errors,setErrors] = useState({})
    const validateForm=()=>{
        const newErrors={}
        if(!formData.otp.trim()){
          newErrors.otp = "Enter OTP"
        }
        if(!formData.password.trim()){
            newErrors.password = "Enter new password"
        }
        if(!formData.confirm_password.trim()){
            newErrors.confirm_password = "Password is required"
        }
        if(formData.password != formData.confirm_password){
          newErrors.password = "Password mismatch"
          newErrors.confirm_password="Password mismatch"
        }
            setErrors(newErrors)
            return Object.keys(newErrors).length===0
        
      }
    
  const handleEmailchange=(event)=>{
    setEmail(event.target.value)
  }
  const handleSubmit=(e)=>{
    e.preventDefault(); 
    dispatch(forgot_password_email_verification(email))
  } 
  const handleInputChange=(e)=>{
    const {name,value}=e.target
    setFormData({...formData,[name]:value})
  }
  const handleOtpSubmit=(e)=>{
    e.preventDefault(); 
    console.log('ve',verified_email)
    if (validateForm()){dispatch(reset_password({formData,verified_email}))}
    
  } 
  if (password_reset) {return <Navigate to='/login' />;}
  return (
    <Container  style={{width:'50%',height:'500px'}}>
      <Row>            
        <Col className='bg-white m-4 p-4' style={{width:'250px'}}>
          <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={verified_email? verified_email: email} onChange={handleEmailchange} />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>        

        {!email_verified && <div className='text-center'>    
          <div>
          {password_reset_error && <Form.Text className="text-danger" style={{fontWeight:'600'}}>
              {password_reset_error}
            </Form.Text> }  
            </div>    
          <Button variant="primary" type="submit" >
            Submit
          </Button>
          </div> }
          

        </Form> 
        {email_verified && (
        <Form onSubmit={handleOtpSubmit}>
          <Form.Group className="mb-3" controlId="formBasicOtp">
            {/* <Form.Label>Enter OTP</Form.Label> */}
            <Form.Control type="text" placeholder="Enter OTP" name='otp' value={formData.otp} onChange={handleInputChange} />
            {!errors.otp &&
            <Form.Text className="text-muted">
              Type 6 digit otp recieved on your email.
            </Form.Text>
            }
            {errors.otp &&<Form.Text className="text-danger" style={{fontWeight:'600'}}>
              {errors.otp}
            </Form.Text>
            }
          </Form.Group>
          <Form.Group className='mb-3' controlId="formBasicResetPassword">
          {/* <Form.Label>Enter New Password</Form.Label> */}
            <Form.Control type="password" placeholder="Enter New Passowrd" name='password' value={formData.password} onChange={handleInputChange} />
            {errors.password &&<Form.Text className="text-danger" style={{fontWeight:'600'}}>
              {errors.password}
            </Form.Text>
            }
          </Form.Group>
          <Form.Group className='mb-3' controlId="formBasicConfirmResetPassword">
          {/* <Form.Label>Re enter New Password</Form.Label> */}
            <Form.Control type="password" placeholder="Re enter New Passowrd" name='confirm_password' value={formData.confirm_password} onChange={handleInputChange} />
            {errors.confirm_password &&<Form.Text className="text-danger" style={{fontWeight:'600'}}>
              {errors.confirm_password}
            </Form.Text>
            }
          </Form.Group>          
          <div className='text-center'>
          <div style={{margin:'5px'}}>
          {password_reset_error && <Form.Text className="text-danger" style={{fontWeight:'600'}}>
              {password_reset_error.error}
            </Form.Text> }  
            </div>  
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      )}
                </Col>          

          </Row>
    </Container>
  )
}

export default Forgot_password


