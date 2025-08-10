import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Screens
import WelcomeScreen from './nric_modules/WelcomeScreen';
import ChatbotIndex from './nric_modules/chatbot/index';

// Health Tools
import { UserProfile, DietPlan } from './nric_modules/HealthTools/types/diet';
import { DietAIService } from './nric_modules/HealthTools/services/dietAI';
import HealthHomeScreen from './nric_modules/HealthTools/screens/HomeScreen';
import UserProfileForm from './nric_modules/HealthTools/components/UserProfileForm';
import DietPlanDisplay from './nric_modules/HealthTools/components/DietPlanDisplay';
import LoadingScreen from './nric_modules/HealthTools/components/LoadingScreen';
import BMICalculator from './nric_modules/HealthTools/components/BMICalculator';
import BreatheChallenge from './nric_modules/HealthTools/components/BreatheChallenge';
import MedicineReminderScreen from './nric_modules/HealthTools/screens/MedicineReminderScreen';
import WaterReminderScreen from './nric_modules/HealthTools/screens/WaterReminderScreen';

// VoIP Calling
import LoginScreen from './nric_modules/VoipCalling/screens/LoginScreen';
import RegisterScreen from './nric_modules/VoipCalling/screens/RegisterScreen';
import HomeScreen from './nric_modules/VoipCalling/screens/HomeScreen';
import VideoCallScreen from './nric_modules/VoipCalling/components/VideoCallScreen';

// GPS Tracking
import LoginRegisterScreen from './nric_modules/GpsTracking/components/LoginRegisterScreen';
import CustomerHomeScreen from './nric_modules/GpsTracking/components/CustomerHomeScreen';
import ShopDetailScreen from './nric_modules/GpsTracking/components/ShopDetailScreen';
import { Customer, Shop } from './nric_modules/GpsTracking/types';

const App: React.FC = () => {
  // Diet Plan state
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  // GPS Tracking state
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [detailShop, setDetailShop] = useState<Shop | null>(null);

  const handleProfileSubmit = async (profile: UserProfile) => {
    try {
      const plan = await DietAIService.generateDietPlan(profile);
      setDietPlan(plan);
      return plan;
    } catch (error) {
      console.error('Error generating diet plan:', error);
      throw error;
    }
  };

  // Load GPS customer from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('customer');
    if (stored) {
      setCustomer(JSON.parse(stored));
    }
  }, []);

  const handleLogin = (cust: Customer) => {
    setCustomer(cust);
    localStorage.setItem('customer', JSON.stringify(cust));
  };

  const handleLogout = () => {
    localStorage.removeItem('customer');
    setCustomer(null);
    setDetailShop(null);
  };

  return (
    <Router>
      <Routes>
        {/* Welcome Screen */}
        <Route path="/" element={<WelcomeScreen />} />

        {/* Chatbot */}
        <Route path="/main" element={<ChatbotIndex />} />

        {/* VoIP Calling */}
        <Route path="/patient-login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/video-call" element={<VideoCallScreen />} />

        {/* Health Tools */}
        <Route path="/health-tools" element={<HealthHomeScreen />} />
        <Route path="/profile-form" element={<UserProfileForm onSubmit={handleProfileSubmit} />} />
        <Route path="/loading" element={<LoadingScreen />} />
        <Route path="/diet-plan" element={<DietPlanDisplay />} />
        <Route path="/bmi-calculator" element={<BMICalculator />} />
        <Route path="/breathe-challenge" element={<BreatheChallenge />} />
        <Route path="/water-reminder" element={<WaterReminderScreen />} />
        <Route path="/medicine-reminder" element={<MedicineReminderScreen />} />

        {/* Doctor Consultation */}
        <Route path="/doctor-consultation" element={<LoginScreen />} />

        {/* GPS Tracking */}
        <Route
          path="/gps-tracking"
          element={<Navigate to="/gps-login" replace />}
        />

        <Route
          path="/gps-login"
          element={
            customer ? (
              <Navigate to="/customer-home" replace />
            ) : (
              <LoginRegisterScreen onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/customer-home"
          element={
            customer ? (
              <CustomerHomeScreen
                customer={customer}
                onLogout={handleLogout}
                onDetail={(shop) => setDetailShop(shop)}
              />
            ) : (
              <Navigate to="/gps-login" replace />
            )
          }
        />

        <Route
          path="/shop-detail"
          element={
            customer ? (
              detailShop ? (
                <ShopDetailScreen
                  shop={detailShop}
                  customer={customer}
                  onBack={() => setDetailShop(null)}
                />
              ) : (
                <Navigate to="/customer-home" replace />
              )
            ) : (
              <Navigate to="/gps-login" replace />
            )
          }
        />

        {/* Fallback 404 page */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App; //shajan
