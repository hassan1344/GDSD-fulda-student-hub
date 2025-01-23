/* Lanlord Homepage */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import { jwtDecode } from 'jwt-decode';
import { getProfileByUsername } from '../../services/profileServices';

const AdminHomepage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUserName] = useState("");

/* Fetch profile data when the component mounts  */  
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    
// Decode the access token to extract the username
    const decodedToken = jwtDecode(accessToken);    
    const { userName } = decodedToken;
    setUserName(userName);


    if (userName) {
      const fetchProfile = async () => {
    try {
// Fetch profile data using the extracted username          
        const data = await getProfileByUsername(userName);
        console.log("Data in fetchProfile", data);
        setProfile(data);
    } catch (err) {
        setError("Error loading profile: " + err.message);
    } finally {
        setLoading(false);
    }
    };
    fetchProfile();
    } else {
      setError("Username is not valid.");
      setLoading(false);
    }
  }, []);

  /* Menu items for the admin dashboard */
  const menuItems = [
    { title: 'View All Properties', path: '/admin/properties', icon: '🏠' },
    { title: 'View All Listings', path: '/admin/listings', icon: '🏠' },
    // { title: 'View All Users', path: '/admin/users', icon: '👥' }
  ];

  return (
    <div className="background-container">
      <Navbar />
      <div className="container mx-auto px-4 py-8">

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome, {profile?.first_name} {profile?.last_name}</h1>
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

export default AdminHomepage;