// src/routes/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  getAuthToken,
  saveAuthData,
  logout,
  isTokenExpired
} from '../utils/AuthUtils';

const ProtectedRoute = ({ children }) => {
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAuthToken();

    const verifyUser = async () => {
      if (!token) {
        logout();
        setVerified(false);
        setChecking(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:4000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

    
         const data = await res.json();
        if (data.statusCode!== 401 && !localStorage.getItem('user')){
          saveAuthData(data.data.data);
        }

        setVerified(true);
      } catch (err) {
        logout();
        setVerified(false);
      } finally {
        setChecking(false);
      }
    };

    verifyUser();
  }, []);

  if (checking) return <div className="text-center mt-10">Validating session...</div>;
  if (!verified) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
