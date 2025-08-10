import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="container">
      {/* Animated Logo/Icon */}
      <div className="logo-container">
        <div className="animation">⏳</div>
      </div>

      {/* Loading Text */}
      <h1 className="title">AI is Analyzing Your Profile</h1>

      <div className="loading-items">
        <div className="loading-item">
          <div className="dot dot1"></div>
          <p className="loading-text">
            Processing your body metrics and health data
          </p>
        </div>
        <div className="loading-item">
          <div className="dot dot2"></div>
          <p className="loading-text">
            Calculating nutritional requirements
          </p>
        </div>
        <div className="loading-item">
          <div className="dot dot3"></div>
          <p className="loading-text">
            Searching optimal food combinations
          </p>
        </div>
        <div className="loading-item">
          <div className="dot dot4"></div>
          <p className="loading-text">
            Creating your personalized meal plan
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '75%' }}></div>
        </div>
        <p className="progress-text">This may take a few moments...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;