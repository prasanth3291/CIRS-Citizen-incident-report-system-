import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './Citizens_profile.css';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessToken } from '../../features/user';
import Ad_navbar from '../../components/Ad_navbar';

const BASE_URL = 'http://localhost:8000'; 
const fetchProfileData = async (token) => {
  try { 
    const response = await axios.get(`${BASE_URL}/api/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized:', error.response);
    } else {
      console.error('Error fetching profile data:', error);
    }
    return {};
  }
};

const updateProfileData = async (token, data) => {
  try {
    await axios.put(`${BASE_URL}/api/profile/update/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

function Citizens_profile() {
  const dispatch = useDispatch();
  const { access } = useSelector(state => state.user); 
  const LatestAccessToken = async () => {
    let token = access;
    if (!token) {
      const result = await dispatch(refreshAccessToken());
      if (refreshAccessToken.fulfilled.match(result)) {
        token = result.payload.access;
      } else {
        console.error('Unable to refresh access token');
        return null;
      }
    }
    return token;
  };

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    profile_pic: null,
    address_field_1: '',
    address_field_2: '',
    phone: '',
    pin: '',
    district: '',
    state: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const DEFAULT_IMAGE = process.env.PUBLIC_URL + '/assets/images/profile-photo.webp'
  useEffect(() => {
    const loadProfileData = async () => {
      const token = await LatestAccessToken(); // Make sure to await this
      if (token) {
        const data = await fetchProfileData(token);
        setFormData({
          profile_pic: data.profile_pic ? `${BASE_URL}${data.profile_pic}` : DEFAULT_IMAGE,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          address_field_1: data.address_field_1 || '',
          address_field_2: data.address_field_2 || '',
          phone: data.phone || '',
          pin: data.pin || '',
          district: data.district || '',
          state: data.state || ''
        });
        setPreview(data.profile_pic ? `${BASE_URL}${data.profile_pic}` : DEFAULT_IMAGE);
      }
    };
    loadProfileData();
  }, [access, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        profile_pic: file
      });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = await LatestAccessToken(); // Make sure to await this
    if (!token) return; // Exit if token is not available

    const form = new FormData();
    if (formData.profile_pic && typeof formData.profile_pic !== 'string') {
      form.append('profile_pic', formData.profile_pic);
    }
    form.append('first_name', formData.first_name);
    form.append('last_name', formData.last_name);
    form.append('address_field_1', formData.address_field_1);
    form.append('address_field_2', formData.address_field_2);
    form.append('phone', formData.phone);
    form.append('pin', formData.pin);
    form.append('district', formData.district);
    form.append('state', formData.state);

    await updateProfileData(token, form); // Pass the token here
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <Container className='CPP'>
      <Row style={{ marginTop: '20px' }} className='CPP-ROW'>
        <Ad_navbar style={{ position: 'sticky' }} />

        <Col className='CPP-LEFT'>
          <Row className="CPP-L-1">
            <div className='CPR-profile'>
            {!isEditing && (
  <>
    <Image
      src={preview || 'default-image.png'}
      alt="Profile"
      fluid
      style={{ borderRadius: '50%' }}
      onError={(e) => { e.target.onerror = null; e.target.src="default-image.png"; }}
    />
    <button 
      className='btn-edit' 
      onClick={() => setIsEditing(true)}
    >
      Edit
    </button>
  </>
)}

            </div>
          </Row>
          {isEditing && (
            <Row className="CPP-L-2">
              <Form.Group className="mb-3">
                <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                  <Image
                    src={preview || 'default-image.png'}
                    fluid                    
                  />
                </label>
                <Form.Control
                  id="fileInput"
                  name="profile_pic"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleChange}
                />
                <div style={{ justifyContent: 'center', marginTop: '5px' }}>
                  <h6 style={{ color: 'white', textAlign: 'center' }}>
                    {formData.profile_pic instanceof File ? formData.profile_pic.name : "No file selected"}
                  </h6>
                </div>
              </Form.Group>
            </Row>         
          )}
        </Col>

        <Col className="CPP-RIGHT">
          <form onSubmit={handleSubmit}> 
            <Row className="CPP-R-1">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First name"
                disabled={!isEditing}
              />
            </Row>
            <Row className="CPP-R-1">
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last name"
                disabled={!isEditing}
              />
            </Row>
            <Row className="CPP-R-1">
              <input
                type="text"
                name="address_field_1"
                value={formData.address_field_1}
                onChange={handleChange}
                placeholder="Address Line 1"
                disabled={!isEditing}
              />
            </Row>
            <Row className="CPP-R-2">
              <input
                type="text"
                name="address_field_2"
                value={formData.address_field_2}
                onChange={handleChange}
                placeholder="Address Line 2"
                disabled={!isEditing}
              />
            </Row>
            <Row className="CPP-R-3">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                disabled={!isEditing}
              />
            </Row>
            <Row className="CPP-R-4">
              <input
                type="text"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                placeholder="PIN"
                disabled={!isEditing}
              />
            </Row>
            <Row className="CPP-R-5">
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="District"
                disabled={!isEditing}
              />
            </Row>
            <Row className="CPP-R-6">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                disabled={!isEditing}
              />
            </Row>
            
            {isEditing && (
              <Row className="CPP-R-7">
                <button type="submit">Save Changes</button>
              </Row>
            )}
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default Citizens_profile;
