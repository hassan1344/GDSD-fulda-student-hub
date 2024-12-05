import React from 'react';
import { Link } from 'react-router-dom';
import { mockLandlordData } from '../../mockData';
import NavBar from '../../components/NavBar'; // Adjusted path to Navbar component
import './LandlordHomepage.css'; 



const LandlordHomepage = () => {
  const { landlord, stats } = mockLandlordData;

  return (
    <div>
      <NavBar /> {}
      <h1 className="welcome-message">Welcome, {landlord.name}</h1>
      <div className="homepage-container">
        
        <div className="stats-container">
        <Link to="/landlord/create-listing">
         <button className="action-button">Create New Ads</button>
        </Link>
      
        <Link to="/landlord/my-listings">
          <button className="action-button">Edit Ads</button>
        </Link>
            <button className="action-button">Raise Issue</button>
            <button className="action-button">Resgister Bidding</button>
            <button className="action-button">New Requests</button>
            <button className="action-button">View tenants</button>
            <button className="action-button">Documents</button>
            <button className="action-button">View past tenants</button>          
          </div>
        </div>
      </div>
  );
};

export default LandlordHomepage;
