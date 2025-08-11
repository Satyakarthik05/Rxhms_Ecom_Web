import React, { useState, useEffect } from 'react';
import './BMICalculator.css';

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
      const savedHistory = localStorage.getItem('bmiHistory');
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

    const updatedHistory = [newEntry, ...history.slice(0, 9)];

    try {
      localStorage.setItem('bmiHistory', JSON.stringify(updatedHistory));
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
    if (bmiValue < 18.5) setBmiCategory('Underweight');
    else if (bmiValue < 25) setBmiCategory('Normal weight');
    else if (bmiValue < 30) setBmiCategory('Overweight');
    else setBmiCategory('Obese');
  };

  const getBmiColor = () => {
    if (!bmi) return '#6B7280';
    if (bmi < 18.5) return '#3B82F6';
    if (bmi < 25) return '#10B981';
    if (bmi < 30) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="bmi-wrapper">
      <h4 className="bmi-subtitle">Health & Fitness</h4>
      <h1 className="bmi-title">BMI Calculator</h1>
      <p className="bmi-description">
        Calculate your Body Mass Index and track your history.
      </p>

      <div className="bmi-container">
        {/* Left Card - Input */}
        <div className="bmi-card">
          <h2 className="bmi-section-title">Enter your details</h2>

          <label className="bmi-label">Height (cm)</label>
          <input
            type="number"
            placeholder="e.g. 170"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="bmi-input"
          />

          <label className="bmi-label">Weight (kg)</label>
          <input
            type="number"
            placeholder="e.g. 65"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="bmi-input"
          />

          <button className="bmi-button" onClick={calculateBmi}>
            Calculate BMI
          </button>
        </div>

        {/* Right Card - Result */}
        <div className="bmi-card">
          <h2 className="bmi-section-title">Your Result</h2>

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
              Enter your height and weight to see your BMI.
            </p>
          )}
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="bmi-history-card">
          <h3 className="bmi-history-title">Your BMI History</h3>
          {history.map((item, index) => (
            <div key={index} className="bmi-history-item">
              <span className="bmi-history-date">{item.date}</span>
              <span
                className="bmi-history-bmi"
                style={{
                  color:
                    item.bmi < 18.5
                      ? '#3B82F6'
                      : item.bmi < 25
                      ? '#10B981'
                      : item.bmi < 30
                      ? '#F59E0B'
                      : '#EF4444',
                }}
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
