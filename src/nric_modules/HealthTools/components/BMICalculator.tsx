import React, { useState, useEffect } from 'react';
import './BMICalculator.css';

// Constants for text and values
const TEXT = {
  TITLE: 'BMI Calculator',
  SUBTITLE: 'Health & Fitness',
  DESCRIPTION: 'Calculate your Body Mass Index and track your history.',
  INPUT_SECTION_TITLE: 'Enter your details',
  RESULT_SECTION_TITLE: 'Your Result',
  HEIGHT_LABEL: 'Height (cm)',
  WEIGHT_LABEL: 'Weight (kg)',
  HEIGHT_PLACEHOLDER: 'e.g. 170',
  WEIGHT_PLACEHOLDER: 'e.g. 65',
  CALCULATE_BUTTON: 'Calculate BMI',
  PLACEHOLDER_TEXT: 'Enter your height and weight to see your BMI.',
  HISTORY_TITLE: 'Your BMI History',
};

const BMI_CATEGORIES = {
  UNDERWEIGHT: 'Underweight',
  NORMAL: 'Normal weight',
  OVERWEIGHT: 'Overweight',
  OBESE: 'Obese',
};

const BMI_THRESHOLDS = {
  UNDERWEIGHT: 18.5,
  NORMAL: 25,
  OVERWEIGHT: 30,
};

const COLORS = {
  DEFAULT: '#6B7280',
  UNDERWEIGHT: '#3B82F6',
  NORMAL: '#10B981',
  OVERWEIGHT: '#F59E0B',
  OBESE: '#EF4444',
};

const STORAGE_KEY = 'bmiHistory';
const HISTORY_LIMIT = 10;

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [history, setHistory] = useState<Array<{ date: string; bmi: number }>>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading BMI history:', error);
    }
  };

  const saveToHistory = (newBmi: number) => {
    const newEntry = {
      date: new Date().toLocaleDateString(),
      bmi: newBmi,
    };

    const updatedHistory = [newEntry, ...history.slice(0, HISTORY_LIMIT - 1)];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving BMI history:', error);
    }
  };

  const calculateBmi = () => {
    if (!height || !weight) return;

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    const roundedBmi = Math.round(bmiValue * 10) / 10;

    setBmi(roundedBmi);
    determineBmiCategory(roundedBmi);
    saveToHistory(roundedBmi);
  };

  const determineBmiCategory = (bmiValue: number) => {
    if (bmiValue < BMI_THRESHOLDS.UNDERWEIGHT) setBmiCategory(BMI_CATEGORIES.UNDERWEIGHT);
    else if (bmiValue < BMI_THRESHOLDS.NORMAL) setBmiCategory(BMI_CATEGORIES.NORMAL);
    else if (bmiValue < BMI_THRESHOLDS.OVERWEIGHT) setBmiCategory(BMI_CATEGORIES.OVERWEIGHT);
    else setBmiCategory(BMI_CATEGORIES.OBESE);
  };

  const getBmiColor = () => {
    if (!bmi) return COLORS.DEFAULT;
    if (bmi < BMI_THRESHOLDS.UNDERWEIGHT) return COLORS.UNDERWEIGHT;
    if (bmi < BMI_THRESHOLDS.NORMAL) return COLORS.NORMAL;
    if (bmi < BMI_THRESHOLDS.OVERWEIGHT) return COLORS.OVERWEIGHT;
    return COLORS.OBESE;
  };

  const getHistoryItemColor = (bmiValue: number) => {
    if (bmiValue < BMI_THRESHOLDS.UNDERWEIGHT) return COLORS.UNDERWEIGHT;
    if (bmiValue < BMI_THRESHOLDS.NORMAL) return COLORS.NORMAL;
    if (bmiValue < BMI_THRESHOLDS.OVERWEIGHT) return COLORS.OVERWEIGHT;
    return COLORS.OBESE;
  };

  return (
    <div className="bmi-wrapper">
      <h4 className="bmi-subtitle">{TEXT.SUBTITLE}</h4>
      <h1 className="bmi-title">{TEXT.TITLE}</h1>
      <p className="bmi-description">{TEXT.DESCRIPTION}</p>

      <div className="bmi-container">
        {/* Left Card - Input */}
        <div className="bmi-card">
          <h2 className="bmi-section-title">{TEXT.INPUT_SECTION_TITLE}</h2>

          <label className="bmi-label">{TEXT.HEIGHT_LABEL}</label>
          <input
            type="number"
            placeholder={TEXT.HEIGHT_PLACEHOLDER}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="bmi-input"
          />

          <label className="bmi-label">{TEXT.WEIGHT_LABEL}</label>
          <input
            type="number"
            placeholder={TEXT.WEIGHT_PLACEHOLDER}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="bmi-input"
          />

          <button className="bmi-button" onClick={calculateBmi}>
            {TEXT.CALCULATE_BUTTON}
          </button>
        </div>

        {/* Right Card - Result */}
        <div className="bmi-card">
          <h2 className="bmi-section-title">{TEXT.RESULT_SECTION_TITLE}</h2>

          {bmi !== null ? (
            <>
              <p className="bmi-result-value" style={{ color: getBmiColor() }}>
                {bmi}
              </p>
              <p className="bmi-result-category" style={{ color: getBmiColor() }}>
                {bmiCategory}
              </p>
            </>
          ) : (
            <p className="bmi-placeholder">
              {TEXT.PLACEHOLDER_TEXT}
            </p>
          )}
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="bmi-history-card">
          <h3 className="bmi-history-title">{TEXT.HISTORY_TITLE}</h3>
          {history.map((item, index) => (
            <div key={index} className="bmi-history-item">
              <span className="bmi-history-date">{item.date}</span>
              <span
                className="bmi-history-bmi"
                style={{ color: getHistoryItemColor(item.bmi) }}
              >
                {item.bmi}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BMICalculator;