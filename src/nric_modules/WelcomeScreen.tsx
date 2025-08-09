import React from 'react';
import { Button, Dimensions } from 'web_shims/react-native-web';
from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;
const {width} = Dimensions.get('window');

const WelcomeScreen = ({navigation}: WelcomeScreenProps) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>RXHMS</span>
        <span style={styles.subtitle}>Your Personal Health Companion</span>
      </div>

      <div style={styles.buttonContainer}>
        <div role="button"
          style={styles.button}
          onClick={() => navigation.navigate('HealthHome')}
          activeOpacity={0.7}>
          <div style={styles.buttonIconContainer}>
            <Icon name="medical-services" size={28} color="#e74c3c" />
          </div>
          <span style={styles.buttonText}>Health Tools</span>
        </div>

        <div role="button"
          style={styles.button}
          onClick={() => navigation.navigate('PatientLogin')}
          activeOpacity={0.7}>
          <div style={styles.buttonIconContainer}>
            <Icon name="health-and-safety" size={28} color="#e74c3c" />
          </div>
          <span style={styles.buttonText}>Consult a Doctor</span>
        </div>

        {/* NEW GPS Tracking Button */}
        <div role="button"
          style={styles.button}
          onClick={() => navigation.navigate('GPSLogin')}
          activeOpacity={0.7}>
          <div style={styles.buttonIconContainer}>
            <Icon name="location-on" size={28} color="#e74c3c" />
          </div>
          <span style={styles.buttonText}>GPS Tracking</span>
        </div>
      </div>

      <div style={styles.footer}>
        <span style={styles.footerText}>v1.0.0</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {alignItems: 'center', marginTop: 40},
  title: {fontSize: 36, fontWeight: '700', color: '#2c3e50', marginBottom: 8},
  subtitle: {fontSize: 16, color: '#7f8c8d', textAlign: 'center'},
  buttonContainer: {alignItems: 'center', marginBottom: 100},
  button: {
    width: width * 0.7,
    height: 80,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonText: {fontSize: 18, fontWeight: '600', color: '#2c3e50'},
  footer: {alignItems: 'center'},
  footerText: {color: '#95a5a6', fontSize: 12},
});

export default WelcomeScreen;
