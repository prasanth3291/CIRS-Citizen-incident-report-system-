import React from 'react';
import './Detailed_report.css'; // Make sure to include your styles
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function HeaderSection({ profileImage, onReject, onSend }) {
    const location = useLocation();
    const { report } = location.state || {};  // Corrected here

    console.log(report);  // It's a good practice to remove console.logs in production

    if (!report) {
        return <div>Error: Report data is not available.</div>;  // Handle the case where report data is missing
    }

    return (
        <div className="DRM-container">
            <div className="DR-header">
                <div className='DR-header-header'>
                    
                </div>
                <div className='DRH-left'>
                    <img src={profileImage} alt="Profile" className="profile-pic" />
                </div>
                <div className='DRH-right'>                    
                    <button className="delete-btn" ><Link to='/ad_notification'>✖</Link></button>
                    <div className="row">
                        <div className="input-container">
                            <select className="custom-select">
                                <option>{report.nearest_police_station}</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                        <div className="action-buttons">
                            <button className="reject-btn" onClick={onReject}>REJECT</button>
                            <button className="send-btn" onClick={onSend}>SEND</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='DRM-main'>
                <div className='DRM-left'>
            
                <ul>
                    <li>
                        <label className="text-muted form-label">Offence Description</label>
                        <input type="text" className="input-row form-input" value={report.offence_description} readOnly />
                    </li>
                    <li>
                        <label className="text-muted form-label">Accused</label>
                        <input type="text" className="input-row form-input" value={report.accused} readOnly />
                    </li>
                    <li>
                        <label className="text-muted form-label">Vehicle Number</label>
                        <input type="text" className="input-row form-input" value={report.vehicle_number} readOnly />
                    </li>
                    <li>
                        <label className="text-muted form-label">Number of Offenders</label>
                        <input type="text" className="input-row form-input" value={report.no_of_offendents} readOnly />
                    </li>
                    <li>
                        <label className="text-muted form-label">Location</label>
                        <input type="text" className="input-row form-input" value={report.location} readOnly />
                    </li>
                    

                </ul>
 
                </div>
                <div className='DRM-right'>
                    <img src={`http://127.0.0.1:8001${report.image}`} alt="Incident" className="right-image" />
                </div>
            </div>
            <div className="DRM-bottom">
                <label className="text-muted">ADD NOTE</label>
                <input type="text" className='full-width-input' />
            </div>
        </div>
    );
}

export default HeaderSection;
