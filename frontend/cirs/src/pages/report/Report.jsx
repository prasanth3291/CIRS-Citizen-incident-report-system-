import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import { GeoAltFill } from 'react-bootstrap-icons';
import axios from 'axios'
function Report() {
  const [formData, setformData] = useState({
    offence:'',
    location:'',
    policeStation:'',
    vehicleNumber:'',
    offendents:'',
    accused:'',
    file:null
  })
  const [userLocation, setUserLocation] = useState(null)
  const [nearPoliceStaion,setnearPoliceStaion] = useState(null)
  const [latLong,setLatLong] = useState(null)
  const [error, setError] = useState('');  
  const handleInputChange=(e)=>{
    const{name,value}=e.target
    setformData({...formData,[name]:value})
      }
  const handleFileChange = (e) => {
        const file = e.target.files[0];
        setformData({ ...formData, file: file });
      };    

  const handleSubmit=(e)=>{
    e.preventDefault();
        console.log('form data',formData)
  }
// Function to call the backend endpoint
const getNearbyPoliceStation = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/get_nearby_police_station/', {
      params: {
        latitude: latLong.latitude,
        longitude: latLong.longitude
      }
    });
    const data = response.data;
    if (data.results && data.results.length > 0){
      setnearPoliceStaion(data.results[0].name)
      console.log(data.results)
    }
    // Process the data further as needed
  } catch (error) {
    console.error('Error fetching nearby police station:', error);
  }
};

  const getUserLocation = async (e) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatLong({ latitude, longitude });          
          try {
            console.log(latitude, longitude);
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBO-nV5HV1DgG1I44RclYGd9PwUKJSjnwo`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              setUserLocation(data.results[0].formatted_address);
              getNearbyPoliceStation( )
                        
            } else {
              console.log('no data');
              setError('Location not found');
            }
          } catch (error) {
            console.error('Error getting location:', error);
            setError('Error getting location');
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
};


  return (
    <Container>
      <Row style={{ width:'100%',marginBottom:'0'}}>
            <Col></Col>
            <Col>
              <Card className='mt-4 mb-2'>
                <Card.Body className='text-center'><h4>Report an offence</h4></Card.Body>
              </Card>
            </Col>
            <Col></Col>
      </Row>
      <Row style={{ width:'100%'}}>
          <Col md={3}>
            <Card style={{margin:'20px'}}>
              <Card.Body>
                <div>
                <h4 style={{textAlign:'center'}}>CIRs (Citizen Incident Reporting System) empowers communities by providing a platform for citizens to report offenses, submit evidence, and engage with law enforcement. With user-friendly interfaces and robust features, CIRs fosters collaboration between citizens and officials, promoting safety and accountability within neighborhoods.</h4>
                </div>
                
              </Card.Body>
            </Card>
          </Col>
          <Col md={8} style={{margin:'20px'}}>
              <Form onSubmit={handleSubmit} >
                <Row style={{backgroundColor:'grey', width:'100%'}}>
                    <Col style={{marginTop:'30px'}}>
                      <Card>
                        <Card.Body>
                          <h4 style={{textAlign:'center'}}>Upload an image of <br /> the offence you witnessed</h4>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col>
                    <div style={{ display: 'flex', justifyContent: 'center',
                     alignItems: 'center',margin:'10px'}}>
                    <Form.Group className="mb-3">
                          <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                            <Image src={process.env.PUBLIC_URL + '/assets/images/image-icon.jpg'} fluid style={{ width: '250px',borderRadius:"50%", height: '150px', margin: '0' }} />
                          </label>
                        <Form.Control id="fileInput" name='file' type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                     </Form.Group>
                     </div>
                     
                    </Col>
                </Row>
                <Row style={{backgroundColor:'black', width:'100%',padding:'10px'}}>
                      <Col className="d-flex align-items-center justify-content-center">
                        <div>
                            <h2 style={{textAlign:'center',color:'white'}}>
                                Fill the Form <br />and <br />
                            </h2>
                            <Button variant="primary" type="submit"  style={{marginLeft:'35px'}}>
                              <h4>Submit</h4>
                            </Button>
                        </div>
                      </Col>
                    <Col>   
                          <Form.Group className="mb-3" >
                            <Form.Control type="text" placeholder="Offence description" name='offence' value={formData.offence} onChange={handleInputChange} />                        
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Location"
                                    name='location'
                                    value={userLocation? userLocation: formData.location}
                                    onChange={handleInputChange}
                                    style={{ marginRight: '10px' }}
                                />
                                <Button variant="secondary" onClick={getUserLocation}>
                                <GeoAltFill></GeoAltFill>
                                </Button>
                            </div>
                            </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Control type="text"
                             placeholder="Nearest Police Station" 
                             name='policeStation' 
                             value={nearPoliceStaion? nearPoliceStaion: formData.policeStation} 
                             onChange={handleInputChange} />                        
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Control type="text" placeholder="Vehicle Number(if any)" name='vehicleNumber' value={formData.vehicleNumber} onChange={handleInputChange} />                        
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Control type="text" placeholder="No of offendents" name='offendents' value={formData.offendents} onChange={handleInputChange} />                        
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Control type="text" placeholder="Accused (if knows)" name='accused' value={formData.accused} onChange={handleInputChange} />                        
                        </Form.Group>
                      </Col>  
                </Row>
              </Form>
          </Col>
      </Row>

    </Container>
  
  )
}

export default Report