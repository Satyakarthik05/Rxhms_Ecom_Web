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

  const loadHistory = async () => {
    try {
      const savedHistory = localStorage.getItem('bmiHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading BMI history:', error);
    }
  };

  const saveToHistory = async (newBmi: number) => {
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
    <div className="container">
      <h1 className="title">BMI Calculator</h1>

      <div className="input-container">
        <label className="label">Height (cm)</label>
        <input
          className="input"
          type="number"
          placeholder="e.g. 170"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>

      <div className="input-container">
        <label className="label">Weight (kg)</label>
        <input
          className="input"
          type="number"
          placeholder="e.g. 65"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      <button className="button" onClick={calculateBmi}>
        Calculate BMI
      </button>

      {bmi !== null && (
        <div className="result-container">
          <h2 className="result-title">Your Result</h2>
          <div className="bmi-circle" style={{ borderColor: getBmiColor() }}>
            <span className="bmi-value" style={{ color: getBmiColor() }}>{bmi}</span>
          </div>
          <p className="bmi-category" style={{ color: getBmiColor() }}>
            {bmiCategory}
          </p>

          <div className="bmi-scale">
            {[
              { label: 'Underweight', range: '< 18.5', color: '#3B82F6' },
              { label: 'Normal', range: '18.5 - 24.9', color: '#10B981' },
              { label: 'Overweight', range: '25 - 29.9', color: '#F59E0B' },
              { label: 'Obese', range: '> 30', color: '#EF4444' },
            ].map((item, i) => (
              <div key={i} className="scale-item">
                <div className="scale-indicator" style={{ backgroundColor: item.color }} />
                <span className="scale-text">{item.label}</span>
                <span className="scale-range">{item.range}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-container">
          <h3 className="history-title">Your BMI History</h3>
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <span className="history-date">{item.date}</span>
              <span
                className="history-bmi"
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