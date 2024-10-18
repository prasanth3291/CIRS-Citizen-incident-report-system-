# Citizen Incident Reporting System (CIRS)

## Introduction
The **Citizen Incident Reporting System (CIRS)** is a web-based application designed to facilitate crime reporting by the general public. It allows citizens to easily report crimes they witness and provides a direct line of communication with law enforcement authorities. CIRS improves the efficiency of crime reporting, monitoring, and resolution through a structured workflow that involves multiple levels of users, ensuring faster response times.

## Overview
CIRS is a fully responsive web application developed using **React** for the frontend and **Django** for the backend. The application simplifies the process of submitting crime reports and ensures that every report is properly reviewed and acted upon by the relevant authorities.

### Key Features
1. **Web Application**: CIRS is accessible through a web browser, providing an intuitive and responsive user interface for users across devices.
2. **Responsive Design**: The application is optimized for both mobile and desktop users, ensuring ease of use on any device.
3. **User Roles**: CIRS involves three levels of users:
   - **State-level Admin**: Admins monitor all reports submitted by citizens, review and verify the details, and assign them to the relevant police stations based on the crime's location. Admins can accept or reject reports.
   - **Station-level Officers**: Officers at the police station level receive reports assigned by the state-level admin and are responsible for investigating the crime at the specified location. They must update the system after investigating and taking appropriate action.
   - **Citizens**: Authorized users can log in and submit reports of crimes they witness. These reports include details such as crime type, location (fetched via Google Maps API), and additional information.
4. **Real-time Notifications**: The system uses real-time notifications to ensure that station-level officers are immediately informed when a new report is assigned to them.
5. **Location-based Services**: The application uses **Google Maps API** to fetch the exact location of a crime incident, enhancing the accuracy of reports.

## Workflow

1. **Citizen**: Reports a crime by submitting details, including the crime description, location, and any supporting evidence (images, videos, etc.).
2. **State-level Admin**: Receives the report, verifies its authenticity, and assigns it to the appropriate police station based on location. The admin can either accept or reject the report.
3. **Station-level Officer**: Upon receiving a report, the officer investigates the situation on-site and updates the report status (e.g., resolved, under investigation, false alarm).

## Technologies Used

### Frontend
- **React**: A JavaScript library for building interactive and dynamic user interfaces.
- **CSS/HTML5**: Used for structuring and designing the user interface, ensuring responsiveness and accessibility.

### Backend
- **Django**: A high-level Python web framework used to manage the backend logic, including authentication, request processing, and database interactions.
- **Django Channels**: Used for handling real-time functionality, such as sending notifications to station-level officers when a new report is assigned.

### Databases
- **PostgreSQL**: Used as the primary relational database to store user data, crime reports, and other structured information.
- **MongoDB**: Utilized for handling unstructured or complex data, such as media attachments to crime reports.

### Authentication
- **JWT (JSON Web Token)**: Used for securing user sessions and verifying authorized access to different sections of the application.

### Messaging and Background Tasks
- **RabbitMQ**: A message broker used for handling communication between microservices.
- **Celery**: Employed for managing background tasks, such as sending notifications and processing crime reports.

### Docker
- **Docker**: Used to containerize the application, allowing for seamless deployment across various environments.

### Real-time Communication
- **Django Channels**: Enables real-time communication and notifications, allowing station-level officers to get instant updates about new reports.

### Google Maps API
- **Google Geo API**: Integrated to fetch and display crime locations accurately when citizens report an incident.

## Conclusion
The Citizen Incident Reporting System (CIRS) provides a comprehensive platform for crime reporting and monitoring. It offers a structured workflow with multiple levels of users, ensuring efficient handling of reports from citizens to the state-level admin and station-level officers. With modern technologies like React, Django, RabbitMQ, and Docker, CIRS is scalable, responsive, and efficient in addressing public safety concerns.
