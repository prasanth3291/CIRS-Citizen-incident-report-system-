import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Ad_navbar from '../../../components/Ad_navbar';
import { useNavigate } from 'react-router-dom';

function Ad_notification() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8001/api/get_reports/');
        setReports(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleReportClick = (report) => {
    navigate(`/report/${report.id}`, { state: { report } });
  };

  return (
    <Container>
      <Row style={{ marginTop: '20px' }}>
        <Ad_navbar />
        <Col md={8} style={{ marginLeft: '10px' }}>
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => handleReportClick(report)}
              style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <Container key={report.id} style={styles.container}>
                <Row style={styles.row}>
                  <Col xs="3" style={styles.imageCol}>
                    <img
                      src={process.env.PUBLIC_URL + '/assets/images/profile-photo.webp'}
                      alt="Profile"
                      style={styles.image}
                    />
                  </Col>
                  <Col xs="6">
                    <div style={styles.infoRow}>
                      <div>
                        <h6>Location: {report.location}</h6>
                      </div>
                    </div>
                    <div style={styles.infoRow}>
                      <div>
                        <h6>Nearest Police Station: {report.nearest_police_station}</h6>
                      </div>
                    </div>
                    <div style={styles.infoRow}>
                      <div>
                        <h6>Accused: {report.accused}</h6>
                      </div>
                    </div>
                  </Col>
                  <Col xs="3" style={styles.crimeImageCol}>
                    <div style={{ ...styles.imageBox, ...styles.frame }}>
                      <img
                        src={`http://127.0.0.1:8001${report.image}`}
                        alt="Crime"
                        style={styles.crimeImage}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div style={styles.description}>
                      <h5>Description: {report.offence_description}</h5>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  container: {
    borderRadius: '15px',
    backgroundColor: '#f0f0f0',
    width: '100%',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '20px'
  },
  row: {
    backgroundColor: '#e0e0e0',
    borderBottom: 'solid #b3b3be 1px',
    borderRadius: '15px 15px 0 0',
    padding: '10px',
    alignItems: 'center'
  },
  imageCol: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '120px',
    height: '120px',
    borderRadius: '50%'
  },
  infoRow: {
    display: 'flex',
    marginBottom: '5px',
    alignContent: 'center',
  },
  description: {
    backgroundColor: '#fff',
    borderRadius: '0 0 15px 15px',
    padding: '15px',
    marginTop: '10px',
    boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)'
  },
  crimeImageCol: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageBox: {
    backgroundColor: 'white',
    padding: '1px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  crimeImage: {
    width: '93%',
    height: '120px',
    borderRadius: '10px'
  },
  frame: {
    border: '1px solid black'
  }
};

export default Ad_notification;
