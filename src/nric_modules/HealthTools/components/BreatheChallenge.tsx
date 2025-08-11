import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Trophy, Target, X } from 'lucide-react';
import './BreatheChallenge.css';

interface Level {
  level: number;
  name: string;
  minDuration: number;
  color: string;
  icon: string;
}

const LEVELS: Level[] = [
  { level: 1, name: "Beginner", minDuration: 0, color: "#10b981", icon: "🫁" },
  { level: 2, name: "Learner", minDuration: 10, color: "#059669", icon: "💨" },
  { level: 3, name: "Apprentice", minDuration: 20, color: "#047857", icon: "🌊" },
  { level: 4, name: "Skilled", minDuration: 35, color: "#065f46", icon: "⭐" },
  { level: 5, name: "Expert", minDuration: 50, color: "#064e3b", icon: "🔥" },
  { level: 6, name: "Master", minDuration: 70, color: "#1e40af", icon: "💎" }
];

const BreatheChallenge: React.FC = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [duration, setDuration] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBreathingOut, setIsBreathingOut] = useState(false);
  const [isBreathingIn, setIsBreathingIn] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const breatheOutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const breatheInTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved data on component mount
  useEffect(() => {
    const savedBestTime = localStorage.getItem('breathChallengeBest');
    const savedAttempts = localStorage.getItem('breathChallengeAttempts');
    
    if (savedBestTime) {
      const best = parseInt(savedBestTime);
      setBestTime(best);
      updateLevel(best);
    }
    
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
  }, []);

  const updateLevel = (time: number) => {
    const newLevel = [...LEVELS].reverse().find(level => time >= level.minDuration) || LEVELS[0];
    
    if (newLevel.level > currentLevel.level) {
      setCurrentLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const startTimer = () => {
    if (!isHolding && !isBreathingIn && !isBreathingOut) {
      // Start breathe in phase first
      setIsBreathingIn(true);
      
      breatheInTimeoutRef.current = setTimeout(() => {
        setIsBreathingIn(false);
        // Now start the actual breath holding
        startBreathHolding();
      }, 3000); // 3 seconds to breathe in
    }
  };

  const startBreathHolding = () => {
      setIsHolding(true);
      setDuration(0);
      startTimeRef.current = Date.now();
      
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        setDuration(elapsed);
      }, 100);
  };

  const stopTimer = () => {
    if (isBreathingIn) {
      // Cancel breathe in phase if user releases early
      setIsBreathingIn(false);
      if (breatheInTimeoutRef.current) {
        clearTimeout(breatheInTimeoutRef.current);
      }
    } else if (isHolding) {
      setIsHolding(false);
      setIsBreathingOut(true);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      const finalDuration = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      setDuration(finalDuration);
      
      // Start breathe out phase
      breatheOutTimeoutRef.current = setTimeout(() => {
        setIsBreathingOut(false);
      }, 3000); // 3 seconds to breathe out
      
      // Update best time and attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('breathChallengeAttempts', newAttempts.toString());
      
      if (finalDuration > bestTime) {
        setBestTime(finalDuration);
        localStorage.setItem('breathChallengeBest', finalDuration.toString());
        updateLevel(finalDuration);
      }
    }
  };

  const resetStats = () => {
    setBestTime(0);
    setAttempts(0);
    setCurrentLevel(LEVELS[0]);
    setDuration(0);
    setIsBreathingOut(false);
    setIsBreathingIn(false);
    localStorage.removeItem('breathChallengeBest');
    localStorage.removeItem('breathChallengeAttempts');
    
    // Clear any active timeouts
    if (breatheOutTimeoutRef.current) {
      clearTimeout(breatheOutTimeoutRef.current);
    }
    if (breatheInTimeoutRef.current) {
      clearTimeout(breatheInTimeoutRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getNextLevel = () => {
    return LEVELS.find(level => level.level > currentLevel.level);
  };

  const getProgressToNextLevel = () => {
    const nextLevel = getNextLevel();
    if (!nextLevel) return 100;
    
    const current = Math.max(bestTime, currentLevel.minDuration);
    const progress = ((current - currentLevel.minDuration) / (nextLevel.minDuration - currentLevel.minDuration)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  return (
    <div className="breath-challenge">
      <div className="breath-container">
        {/* Header */}
        <div className="header">
          <h1 className="title">Breath Challenge</h1>
          <p className="subtitle">Test your breath control and unlock new levels</p>
        </div>

        {/* Cool Bar Chart */}
        <div className="bar-chart-section">
          <div className="bar-chart-container">
            {LEVELS.map((level, index) => (
              <div key={level.level} className="chart-bar-wrapper">
                <div 
                  className={`chart-bar ${
                    level.level < currentLevel.level ? 'completed' : 
                    level.level === currentLevel.level ? 'current' : 'locked'
                  }`}
                  style={{ 
                    height: `${20 + (level.minDuration / 2)}px`,
                    backgroundColor: level.level <= currentLevel.level ? level.color : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: level.level <= currentLevel.level ? `0 0 20px ${level.color}40` : 'none'
                  }}
                >
                  {level.level <= currentLevel.level && (
                    <div className="chart-bar-glow" style={{ backgroundColor: level.color }}></div>
                  )}
                </div>
                <div className="chart-bar-label">
                  <div className="chart-bar-icon">{level.icon}</div>
                  <div className="chart-bar-time">{level.minDuration}s</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Level Display */}
        <div className="level-display" style={{ borderColor: currentLevel.color }}>
          <div className="level-icon">{currentLevel.icon}</div>
          <div className="level-info">
            <h2 className="level-title">Level {currentLevel.level}</h2>
            <p className="level-name" style={{ color: currentLevel.color }}>{currentLevel.name}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {getNextLevel() && (
          <div className="progress-container">
            <div className="progress-label">
              <span>Progress to {getNextLevel()?.name}</span>
              <span>{getNextLevel()?.minDuration}s target</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${getProgressToNextLevel()}%`,
                  backgroundColor: currentLevel.color 
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="timer-section">
          <div className="current-time">
            <span className="time-label">Current</span>
            <span className="time-value">{formatTime(duration)}</span>
          </div>
          
          <div className="breath-button-container">
            <button
              className={`breath-button ${isHolding ? 'holding' : ''} ${isBreathingOut ? 'breathing-out' : ''} ${isBreathingIn ? 'breathing-in' : ''}`}
              onMouseDown={startTimer}
              onMouseUp={stopTimer}
              onMouseLeave={stopTimer}
              onTouchStart={startTimer}
              onTouchEnd={stopTimer}
              disabled={isBreathingOut || isBreathingIn}
              style={{ borderColor: currentLevel.color }}
            >
              <div className="button-content">
                {isHolding ? <Pause size={32} /> : 
                 isBreathingIn ? <div className="breathe-in-icon">🫁</div> :
                 isBreathingOut ? <div className="breathe-out-icon">💨</div> : <Play size={32} />}
                <span>
                  {isHolding ? 'Hold your breath...' : 
                   isBreathingIn ? 'Take a deep breath in...' :
                   isBreathingOut ? 'Now breathe out...' : 'Press & Hold'}
                </span>
              </div>
              
              {isHolding && (
                <div className="pulse-ring" style={{ borderColor: currentLevel.color }}></div>
              )}
              
              {isBreathingIn && (
                <div className="breathe-in-ring" style={{ borderColor: currentLevel.color }}></div>
              )}
              
              {isBreathingOut && (
                <div className="breathe-out-ring" style={{ borderColor: currentLevel.color }}></div>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-section">
          <div className="stat-card">
            <Trophy size={24} />
            <div className="stat-content">
              <span className="stat-label">Best Time</span>
              <span className="stat-value">{formatTime(bestTime)}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <Target size={24} />
            <div className="stat-content">
              <span className="stat-label">Attempts</span>
              <span className="stat-value">{attempts}</span>
            </div>
          </div>
        </div>

        {/* Level Up Animation */}
        {showLevelUp && (
          <div className="level-up-overlay">
            <div className="level-up-content">
              <button 
                className="level-up-close"
                onClick={() => setShowLevelUp(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="level-up-icon">{currentLevel.icon}</div>
              <h2>Level Up!</h2>
              <p>You've reached <span style={{ color: currentLevel.color }}>{currentLevel.name}</span></p>
            </div>
          </div>
        )}

        {/* Achievement Graph */}
        <div className="achievement-graph">
          <h3 className="graph-title">Achievement Path</h3>
          <div className="graph-container">
            <div className="graph-grid">
              {LEVELS.map((level, index) => (
                <div 
                  key={level.level}
                  className={`achievement-bar ${
                    level.level < currentLevel.level ? 'completed' : 
                    level.level === currentLevel.level ? 'current' : 'locked'
                  }`}
                  style={{ 
                    '--level-color': level.color,
                    '--level-glow': `${level.color}40`,
                    '--level-color-rgb': hexToRgb(level.color) ? `${hexToRgb(level.color)!.r}, ${hexToRgb(level.color)!.g}, ${hexToRgb(level.color)!.b}` : '255, 255, 255'
                  } as React.CSSProperties}
                >
                  <div className="bar-header">
                    <div className="bar-icon">{level.icon}</div>
                    <div className="bar-info">
                      <div className="bar-level">Level {level.level}</div>
                      <div className="bar-name">{level.name}</div>
                    </div>
                    <div className="bar-requirement">
                      {level.minDuration > 0 ? `${level.minDuration}s` : 'Start'}
                    </div>
                    {level.level < currentLevel.level && (
                      <div className="achievement-check">✓</div>
                    )}
                    {level.level === currentLevel.level && (
                      <div className="current-indicator">NOW</div>
                    )}
                  </div>
                  
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill"
                      style={{
                        width: level.level <= currentLevel.level ? '100%' : 
                               level.level === currentLevel.level + 1 ? `${Math.min(100, (bestTime / level.minDuration) * 100)}%` : '0%'
                      }}
                    ></div>
                  </div>
                  
                  {level.level === currentLevel.level + 1 && bestTime > 0 && (
                    <div className="progress-text">
                      {bestTime}/{level.minDuration}s ({Math.round((bestTime / level.minDuration) * 100)}%)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="reset-button" onClick={resetStats}>
          Reset Progress
        </button>
      </div>
    </div>
  );
};

export default BreatheChallenge;