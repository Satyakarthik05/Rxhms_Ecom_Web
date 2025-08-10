import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './RegisterScreen.css';
import { API_URL } from '../services/service';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          username,
          password,
          role: 'PATIENT',
        }),
      });

      if (res.ok) {
        alert('Registered successfully');
        navigate('/login');
      } else {
        alert('Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Patient Registration</h1>

        <div className="input-container">
          <Icon icon="mdi:user" className="input-icon" />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="register-input"
          />
        </div>

        <div className="input-container">
          <Icon icon="mdi:user" className="input-icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="register-input"
          />
        </div>

        <div className="input-container">
          <Icon icon="mdi:lock" className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
          <button 
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} className="toggle-icon" />
          </button>
        </div>

        <button className="register-button" onClick={handleRegister}>
          <span className="register-button-text">Register</span>
        </button>

        <button 
          onClick={() => navigate('/patient-login')}
          className="login-link"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default RegisterScreen;