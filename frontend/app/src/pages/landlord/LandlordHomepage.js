import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar';

const LandlordHomepage = () => {
  const menuItems = [
    
    { title: 'Create New Listing', path: '/create-listing', icon: '📝' },
    { title: 'My Listings', path: '/my-listings', icon: '📊' },
    { title: 'New Requests', path: '/new-requests', icon: '🔔' },
    { title: 'View Tenants', path: '/view-tenants', icon: '👁️' },
    { title: 'Register for Bidding', path: '/register-bidding', icon: '🏷️' },
    { title: 'View Past Tenants', path: '/past-tenants', icon: '👥' },
    { title: 'Documents', path: '/documents', icon: '📁' },
    { title: 'Raise an Issue', path: '/raise-issue', icon: '⚠️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome, Mr Schmidt</h1>
        <div className="bg-white shadow-2xl rounded-lg p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">What would you like to do today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <div className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg p-4 shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordHomepage;