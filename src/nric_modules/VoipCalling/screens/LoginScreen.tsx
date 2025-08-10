import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './LoginScreen.css';
import { API_URL } from '../services/service';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'patient' }),
      });

      if (res.ok) {
        const userDetails = await res.json();
        if (userDetails.role !== 'PATIENT') {
          alert('This login is for patients only.');
          return;
        }

        alert(`Welcome ${userDetails.fullName}`);
        navigate('/home', {
          state: {
            username,
            role: userDetails.role,
            id: userDetails.id,
          }
        });
      } else {
        alert('Invalid credentials or not a patient account.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong during login.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Patient Login</h1>

        <div className="input-container">
          <Icon icon="mdi:user" className="input-icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="input-container">
          <Icon icon="mdi:lock" className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button 
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} className="toggle-icon" />
          </button>
        </div>

        <div className="options-row">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="remember-checkbox"
            />
            <span>Remember me</span>
          </label>
          <button className="forgot-password">
            Forgot password?
          </button>
        </div>

        <button className="login-button" onClick={handleLogin}>
          <span className="login-button-text">Sign In</span>
        </button>

        <button 
          onClick={() => navigate('/register')}
          className="register-link"
        >
          Register as a patient
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;