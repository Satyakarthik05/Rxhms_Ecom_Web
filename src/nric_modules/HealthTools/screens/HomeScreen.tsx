import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './HealthHomeScreen.css';

const HealthHomeScreen = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'mdi:food-apple',
      name: 'Diet Planner',
      description: 'Get personalized meal plans based on your profile',
      action: () => navigate('/profile-form'),
      color: '#10B981',
    },
    {
      icon: 'mdi:calculator',
      name: 'BMI Calculator',
      description: 'Calculate your Body Mass Index and health status',
      action: () => navigate('/bmi-calculator'),
      color: '#3B82F6',
    },
    {
      icon: 'mdi:meditation',
      name: 'Breathe Challenge',
      description: 'Daily breathing exercises for stress relief',
      action: () => navigate('/breathe-challenge'),
      color: '#8B5CF6',
    },
    {
      icon: 'mdi:pill',
      name: 'Medicine Reminder',
      description: 'Your personal medicine reminder',
      action: () => navigate('/medicine-reminder'),
      color: '#EC4899',
    },
    {
      icon: 'mdi:cup-water',
      name: 'Water Reminder',
      description: 'Your water reminder',
      action: () => navigate('/water-reminder'),
      color: '#06B6D4',
    },
  ];

  return (
    <div className="container">
      <h1 className="title">AI Health Companion</h1>
      <p className="subtitle">Your personalized health and wellness assistant</p>
      
      <div className="features-container">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="feature-card"
            style={{ borderLeftColor: feature.color }}
            onClick={feature.action}
          >
            <div 
              className="icon-container"
              style={{ backgroundColor: `${feature.color}20` }}
            >
              <Icon icon={feature.icon} width={24} color={feature.color} />
            </div>
            <div className="feature-text">
              <h3 className="feature-name">{feature.name}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
            <Icon icon="mdi:chevron-right" width={24} color="#9CA3AF" />
          </div>
        ))}
      </div>
      
      <div className="info-card">
        <h3 className="info-title">About This App</h3>
        <p className="info-text">
          This health companion provides personalized diet plans, BMI tracking, 
          and breathing exercises to improve your overall wellness.
        </p>
        <p className="disclaimer">
          Note: This app is for educational purposes only. Consult a healthcare professional before making significant changes.
        </p>
      </div>
    </div>
  );
};

export default HealthHomeScreen;