import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from '../WelcomeScreen';
import index from '../chatbot/index';

// Health Tools
import {UserProfile, DietPlan} from '../HealthTools/types/diet';
import {DietAIService} from '../HealthTools/services/dietAI';
import HealthHomeScreen from '../HealthTools/screens/HomeScreen';
import UserProfileForm from '../HealthTools/components/UserProfileForm';
import DietPlanDisplay from '../HealthTools/components/DietPlanDisplay';
import LoadingScreen from '../HealthTools/components/LoadingScreen';
import BMICalculator from '../HealthTools/components/BMICalculator';
import BreatheChallenge from '../HealthTools/components/BreatheChallenge';
import MedicineReminderScreen from '../HealthTools/screens/MedicineReminderScreen';
import WaterReminderScreen from '../HealthTools/screens/WaterReminderScreen';

// VoIP Calling
import CallSetupScreen from '../VoipCalling/components/CallSetupScreen';
import LoginScreen from '../VoipCalling/screens/LoginScreen';
import RegisterScreen from '../VoipCalling/screens/RegisterScreen';
import HomeScreen from '../VoipCalling/screens/HomeScreen';
import VideoCallScreen from '../VoipCalling/components/VideoCallScreen';

// GPS Tracking
import LoginRegisterScreen from '../GpsTracking/components/LoginRegisterScreen';
import CustomerHomeScreen from '../GpsTracking/components/CustomerHomeScreen';
import ShopDetailScreen from '../GpsTracking/components/ShopDetailScreen';
import {Customer, Shop} from '../GpsTracking/types';

export type RootStackParamList = {
  Welcome: undefined;
  PatientLogin: undefined;
  Register: undefined;
  Home: undefined;
  CallSetup: undefined;
  VideoCallScreen: undefined;
  HealthHome: undefined;
  ProfileForm: undefined;
  Loading: undefined;
  DietPlan: undefined;
  BMICalculator: undefined;
  BreatheChallenge: undefined;
  WaterReminderScreen: undefined;
  MedicineReminderScreen: undefined;

  // GPS Tracking routes
  GPSLogin: undefined;
  CustomerHome: undefined;
  ShopDetail: {shop: Shop};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  // Diet Plan State
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  // GPS Tracking State
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

  // Load GPS customer from storage
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const stored = await AsyncStorage.getItem('customer');
        if (stored) setCustomer(JSON.parse(stored));
      } catch (err) {
        console.error('Error loading stored customer:', err);
      }
    };
    loadCustomer();
  }, []);

  const handleLogin = async (cust: Customer) => {
    setCustomer(cust);
    await AsyncStorage.setItem('customer', JSON.stringify(cust));
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('customer');
    setCustomer(null);
    setDetailShop(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{headerShown: false}}>
        {/* Welcome Screen */}
        <Stack.Screen name="Welcome">
          {({navigation}) => <WelcomeScreen navigation={navigation} />}
        </Stack.Screen>

        {/* Chatbot entry */}
        <Stack.Screen name="Main Screen" component={index} />

        {/* VoIP Calling */}
        <Stack.Screen name="PatientLogin" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CallSetup" component={CallSetupScreen} />
        <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />

        {/* Health Tools */}
        <Stack.Screen name="HealthHome" component={HealthHomeScreen} />
        <Stack.Screen name="ProfileForm">
          {() => <UserProfileForm onSubmit={handleProfileSubmit} />}
        </Stack.Screen>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="DietPlan" component={DietPlanDisplay} />
        <Stack.Screen name="BMICalculator" component={BMICalculator} />
        <Stack.Screen name="BreatheChallenge" component={BreatheChallenge} />
        <Stack.Screen
          name="WaterReminderScreen"
          component={WaterReminderScreen}
        />
        <Stack.Screen
          name="MedicineReminderScreen"
          component={MedicineReminderScreen}
        />

        {/* GPS Tracking */}
        {!customer ? (
          <Stack.Screen name="GPSLogin">
            {() => <LoginRegisterScreen onLogin={handleLogin} />}
          </Stack.Screen>
        ) : detailShop ? (
          <Stack.Screen name="ShopDetail">
            {() => (
              <ShopDetailScreen
                shop={detailShop}
                customer={customer}
                onBack={() => setDetailShop(null)}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="CustomerHome">
            {() => (
              <CustomerHomeScreen
                customer={customer}
                onLogout={handleLogout}
                onDetail={shop => setDetailShop(shop)}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({
  container: {flex: 1},
});
