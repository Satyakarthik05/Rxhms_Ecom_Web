import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Health Tools Types (IMPORTANT: single source of truth)
import type { UserProfile, DietPlan } from "../HealthTools/types/diet";

// Screens & Components
import WelcomeScreen from "../WelcomeScreen";
import ChatbotIndex from "../chatbot/index";
import { DietAIService } from "../HealthTools/services/dietAI";
import HealthHomeScreen from "../HealthTools/screens/HomeScreen";
import UserProfileFormProps from "../HealthTools/components/UserProfileForm";
import DietPlanDisplay from "../HealthTools/components/DietPlanDisplay";
import LoadingScreen from "../HealthTools/components/LoadingScreen";
import BMICalculator from "../HealthTools/components/BMICalculator";
import BreatheChallenge from "../HealthTools/components/BreatheChallenge";
import MedicineReminderScreen from "../HealthTools/screens/MedicineReminderScreen";
import WaterReminderScreen from "../HealthTools/screens/WaterReminderScreen";

// VoIP Calling
import LoginScreen from "../VoipCalling/screens/LoginScreen";
import RegisterScreen from "../VoipCalling/screens/RegisterScreen";
import HomeScreen from "../VoipCalling/screens/HomeScreen";
import VideoCallScreen from "../VoipCalling/components/VideoCallScreen";

// GPS Tracking
import LoginRegisterScreen from "../GpsTracking/components/LoginRegisterScreen";
import CustomerHomeScreen from "../GpsTracking/components/CustomerHomeScreen";
import ShopDetailScreen from "../GpsTracking/components/ShopDetailScreen";
import type { Customer, Shop } from "../GpsTracking/types";

const StackNavigator: React.FC = () => {
  // Health Tools state
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  // GPS Tracking state
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [detailShop, setDetailShop] = useState<Shop | null>(null);

  // ✅ Use the same type `UserProfileFormProps['onSubmit']`
  const handleProfileSubmit: UserProfileFormProps["onSubmit"] = async (
    profile
  ) => {
    try {
      const plan = await DietAIService.generateDietPlan(profile);
      setDietPlan(plan);
      return plan;
    } catch (error) {
      console.error("Error generating diet plan:", error);
      throw error;
    }
  };

  // Load GPS customer from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("customer");
    if (stored) setCustomer(JSON.parse(stored));
  }, []);

  const handleLogin = (cust: Customer) => {
    setCustomer(cust);
    localStorage.setItem("customer", JSON.stringify(cust));
  };

  const handleLogout = () => {
    localStorage.removeItem("customer");
    setCustomer(null);
    setDetailShop(null);
  };

  return (
    <Router>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Routes>
          {/* Welcome */}
          <Route path="/" element={<WelcomeScreen />} />

          {/* Chatbot */}
          <Route path="/main" element={<ChatbotIndex />} />

          {/* VoIP Calling */}
          <Route path="/patient-login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/video-call" element={<VideoCallScreen />} />

          {/* Health Tools */}
          <Route path="/health-home" element={<HealthHomeScreen />} />
          <Route
            path="/profile-form"
            element={<UserProfileForm onSubmit={handleProfileSubmit} />}
          />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/diet-plan" element={<DietPlanDisplay />} />
          <Route path="/bmi-calculator" element={<BMICalculator />} />
          <Route path="/breathe-challenge" element={<BreatheChallenge />} />
          <Route path="/water-reminder" element={<WaterReminderScreen />} />
          <Route
            path="/medicine-reminder"
            element={<MedicineReminderScreen />}
          />

          {/* GPS Tracking */}
          {!customer ? (
            <Route
              path="/gps-login"
              element={<LoginRegisterScreen onLogin={handleLogin} />}
            />
          ) : detailShop ? (
            <Route
              path="/shop-detail"
              element={
                <ShopDetailScreen
                  shop={detailShop}
                  customer={customer}
                  onBack={() => setDetailShop(null)}
                />
              }
            />
          ) : (
            <Route
              path="/customer-home"
              element={
                <CustomerHomeScreen
                  customer={customer}
                  onLogout={handleLogout}
                  onDetail={(shop) => setDetailShop(shop)}
                />
              }
            />
          )}

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default StackNavigator;
