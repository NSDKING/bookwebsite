import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  
  return (
    <div className="login-container">
      <h1>Login to Access Your Account</h1>
      <Authenticator>
        {({ user, signOut }) => {
          // If we get here, the user is authenticated
          // Redirect them to where they were trying to go
          navigate(-1);
          return null; // This won't render as we're navigating away
        }}
      </Authenticator>
    </div>
  );
}

export default LoginPage;