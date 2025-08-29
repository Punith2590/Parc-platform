
import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

const AuthPage: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  if (showSignUp) {
    return <SignUp onLoginClick={() => setShowSignUp(false)} />;
  }

  return <Login onSignUpClick={() => setShowSignUp(true)} />;
};

export default AuthPage;
