import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import "./index.css"

const ProtectedRoute = ({ children }) => {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  
  // Check if authStatus is still configuring
  if (authStatus === 'configuring') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  // Redirect if not authenticated
  if (authStatus !== 'authenticated') {
    console.log(authStatus);
    return <Navigate to="/login" />;
  }
  
  // Render the children if authenticated
  return children;
};

export default ProtectedRoute;