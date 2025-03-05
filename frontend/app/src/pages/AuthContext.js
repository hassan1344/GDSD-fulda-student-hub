import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          setUser({
            userId: decodedToken.userId,
            userName: decodedToken.userName,
            userType: decodedToken.userType
          });
        } catch (error) {
          console.error('Invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      const decodedToken = jwtDecode(accessToken);
      console.log( decodedToken );
      setUser({
        userId: decodedToken.userId,
        userName: decodedToken.userName,
        userType: decodedToken.userType
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
