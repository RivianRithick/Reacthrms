import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './Styles/Home.css';

const Dashboard = () => {
  // Step 2: Create a state to hold the first name
  const [firstName, setFirstName] = useState('');

  // Step 3: Decode the token and set the first name
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userFirstName = decodedToken?.FirstName; // Assuming 'FirstName' is in your JWT payload
      // const userFirstName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
      if (userFirstName) {
        setFirstName(userFirstName);
      }
    }
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <div className='box-container d-flex justify-content-center'>
      <div className="card" style={{ width: "50rem" }}>
        <div className="card-body">
          {/* Step 4: Display the dynamic welcome message */}
          <h1 className="card-title text-center">Hello, {firstName}!</h1>
          <p className="card-text text-center">Welcome to HRMS Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
