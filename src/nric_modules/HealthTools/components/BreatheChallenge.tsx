import React, { useState, useEffect, useRef } from 'react';
import './BreatheChallenge.css';

interface BreathRecord {
  count: number;
  time: string;
  duration: number;
}

interface SessionInfo {
  time: string;
  duration: number;
  date: string;
}

interface BreathDataMap {
  [date: string]: BreathRecord;
}

const LEVELS = [
  { label: 'Weak', max: 30, color: '#EF4444' },
  { label: 'Normal', max: 60, color: '#F59E0B' },
  { label: 'Strong', max: 120, color: '#10B981' },
  { label: 'Super', max: Infinity, color: '#3B82F6' },
];

const getLevel = (duration: number) => {
  return LEVELS.find(level => duration <= level.max)!;
};

const BreatheChallenge = () => {
  const [breathData, setBreathData] = useState<BreathDataMap>({});
  const [todayCount, setTodayCount] = useState(0);
  const [totalTodayDuration, setTotalTodayDuration] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<SessionInfo[]>([]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [duration, setDuration] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = localStorage.getItem('breatheTracker');
      const parsed: BreathDataMap = data ? JSON.parse(data) : {};
      setBreathData(parsed);

      const todayVal = parsed[today]?.count || 0;
      const todayDur = parsed[today]?.duration || 0;

      setTodayCount(todayVal);
      setTotalTodayDuration(todayDur);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const saveData = async (durationSeconds: number) => {
    const updatedDuration =
      (breathData[today]?.duration || 0) + durationSeconds;

    const updated: BreathDataMap = {
      ...breathData,
      [today]: {
        count: (breathData[today]?.count || 0) + 1,
        time: new Date().toLocaleTimeString(),
        duration: updatedDuration,
      },
    };

    localStorage.setItem('breatheTracker', JSON.stringify(updated));
    setBreathData(updated);
    setTodayCount(updated[today].count);
    setTotalTodayDuration(updatedDuration);

    setSessionHistory(prev => [
      {
        date: today,
        time: new Date().toLocaleTimeString(),
        duration: durationSeconds,
      },
      ...prev,
    ]);
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setDuration(0);

    intervalRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    saveData(duration);
  };

  const currentLevel = getLevel(duration);

  const getBarWidth = (dur: number) => {
    const maxWidth = window.innerWidth - 60;
    return (Math.min(dur, 120) / 120) * maxWidth;
  };

  return (
    <div className="container">
      <h1 className="title">Lung Strength Test</h1>
      <p className="subtitle">
        Hold as long as you can and track progress
      </p>

      <div className="level-legend">
        {LEVELS.map((level, i) => (
          <div key={i} className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: level.color }} />
            <span className="legend-text">
              {level.label} (
              {level.max === Infinity ? '120s+' : `≤ ${level.max}s`})
            </span>
          </div>
        ))}
      </div>

      <div className="bar-container">
        <div
          className="bar"
          style={{
            width: `${getBarWidth(duration)}px`,
            backgroundColor: currentLevel.color,
          }}
        />
        <span className="bar-label">
          {duration}s ({currentLevel.label})
        </span>
      </div>

      {!isBreathing ? (
        <button
          className="start-button"
          onMouseDown={startBreathing}
          onMouseUp={stopBreathing}
          onMouseLeave={stopBreathing}
        >
          <span className="button-icon">▶</span>
          <span className="button-text">Press & Hold to Breathe</span>
        </button>
      ) : (
        <button className="stop-button" onClick={stopBreathing}>
          <span className="button-icon">⏹</span>
          <span className="button-text">Stop</span>
        </button>
      )}

      {sessionHistory.length > 0 && (
        <div className="history-container">
          <h3 className="tips-title">Recent Sessions</h3>
          {sessionHistory.slice(0, 5).map((s, i) => (
            <div key={i} className="history-item">
              <span className="history-icon">🕒</span>
              <span className="history-text">
                {s.date} {s.time} — {s.duration}s ({getLevel(s.duration).label})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BreatheChallenge;