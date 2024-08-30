import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import Ad_navbar from '../../../components/Ad_navbar';

function Ad_dashboard() {
  return (
    <Container>
        <Row style={{marginTop:'20px'}}>
            <Ad_navbar style={{ position:'sticky'}}/>

            <Col md={9} style={{marginLeft:"10px"}}>

                <Row style={{ backgroundColor:"white",height:'100px', borderBottom:'solid #b3b3be'}}>
                    <Col style={{borderRight:'solid #b3b3be'}}>
                    <div style={{marginTop:"5px"}}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/total.webp'} fluid style={{width:'80px' ,height:'80px',padding:'5px'}} alt="" />
                    </div> 
                    </Col>
                    <Col style={{}}>
                    <div style={{marginTop:"5px"}}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/disposed.webp'} fluid style={{width:'80px' ,height:'80px'}} alt="" />
                    </div> 
                    </Col>
                </Row>
                <Row style={{height:'100px',backgroundColor:'white'}}>
                    <Col style={{borderRight:'solid #b3b3be'}}>
                    <div style={{marginTop:"5px"}}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/pending.webp'} fluid style={{width:'80px' ,height:'80px'}} alt="" />
                    </div> </Col>
                    <Col style={{}}>
                    <div style={{marginTop:"5px"}}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/rejected.webp'} fluid style={{width:'80px' ,height:'80px'}} alt="" />
                    </div> 
                    </Col>
                </Row>
                <Row style={{backgroundColor:'white ',height:'300px',marginTop:"10px"}}></Row>

            </Col>
            

        </Row>
    </Container>
      
 
  )
}

export default Ad_dashboard
