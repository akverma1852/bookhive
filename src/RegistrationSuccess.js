import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegistrationSuccess.css';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const redirectTimer = setInterval(() => {
      if (countdown === 1) {
        navigate('/login');
        clearInterval(redirectTimer);
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearInterval(redirectTimer);
  }, [navigate, countdown]);

  return (
    <div className="registration-success-container">
      <div className="registration-success">
        <h1>Registration Successful</h1>
        <p>Welcome to our community! You are now a registered member.</p>
        <p>Get ready to explore all the features and benefits of our website.</p>
        <p>
          Redirecting to <Link to="/login" className="login-link">login</Link> in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
