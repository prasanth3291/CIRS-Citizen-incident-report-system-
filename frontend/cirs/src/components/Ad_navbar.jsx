import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import './Ad_navbar.css'
import { useLocation } from 'react-router-dom';


function Ad_navbar() {
  const location=useLocation()
  const IsNotificationpage=location.pathname === '/ad_notification'

  return (
    <Col md={2} xs={12} style={{ backgroundColor: '#b3b3be', height: '500px' ,position:'sticky',top:'70px' }}>
      <Container style={{ marginTop: "10px",alignContent:'center' }}>
        <img 
          src={process.env.PUBLIC_URL + '/assets/images/profile-photo.webp'} 
          className='img-fluid' 
          style={{ width: '180px', height: '180px' }} 
          alt="" 
        />
      </Container>        
      <div style={{ marginTop: '20px' }}>
        <Navbar className="bg-body-tertiary mb-1">
          <Container>
            <Navbar.Brand href="#home">Dashboard</Navbar.Brand>
          </Container>
        </Navbar>
        <Navbar className="bg-body-tertiary mb-1">
          <Container className={IsNotificationpage ? "Admin_Navbar" :"normal"}  >
            <Navbar.Brand>
              <NavLink className={'Ad_navlink'} to={"/ad_notification"}>Notification</NavLink>
            </Navbar.Brand>
          </Container>
        </Navbar>
        <Navbar className="bg-body-tertiary mb-1">
          <Container>
            <Navbar.Brand>Users</Navbar.Brand>
          </Container>
        </Navbar>
        <Navbar className="bg-body-tertiary mb-1">
          <Container>
            <Navbar.Brand>Incidents</Navbar.Brand>
          </Container>
        </Navbar>
        <Navbar className="bg-body-tertiary">
          <Container>
            <Navbar.Brand>Chats</Navbar.Brand>
          </Container>
        </Navbar>
        <br />
      </div>       
    </Col>
  );
}

export default Ad_navbar;
