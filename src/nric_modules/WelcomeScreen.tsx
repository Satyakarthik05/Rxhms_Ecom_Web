import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <h1 className="welcome-title">RXHMS</h1>
        <p className="welcome-subtitle">Your Personal Health Companion</p>
      </div>

      <div className="welcome-button-container">
        <button 
          className="welcome-button"
          onClick={() => navigate('/health-tools')}
        >
          <div className="button-icon-container">
            <Icon icon="mdi:medical-bag" className="button-icon" />
          </div>
          <span className="button-text">Health Tools</span>
        </button>

        <button 
          className="welcome-button"
          onClick={() => navigate('/doctor-consultation')}
        >
          <div className="button-icon-container">
            <Icon icon="mdi:doctor" className="button-icon" />
          </div>
          <span className="button-text">Consult a Doctor</span>
        </button>

        <button 
          className="welcome-button"
          onClick={() => navigate('/gps-tracking')}
        >
          <div className="button-icon-container">
            <Icon icon="mdi:map-marker" className="button-icon" />
          </div>
          <span className="button-text">GPS Tracking</span>
        </button>
      </div>

      <div className="welcome-footer">
        <p className="footer-text">v1.0.0</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;