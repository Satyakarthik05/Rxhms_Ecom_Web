import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import './WaterReminder.css';

interface Reminder {
  id: string;
  title: string;
  time: string;
  interval: string;
  amount: string;
}

const WaterReminder = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [title, setTitle] = useState('Drink Water');
  const [amount, setAmount] = useState('250');
  const [firstTime, setFirstTime] = useState(new Date());
  const [repeatEvery, setRepeatEvery] = useState('2');
  const [repeatUnit, setRepeatUnit] = useState<'hours' | 'days'>('hours');
  const [repeatCount, setRepeatCount] = useState('8');
  const [showPicker, setShowPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);

  useEffect(() => {
    const savedReminders = localStorage.getItem('waterReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  const saveRemindersToStorage = (reminders: Reminder[]) => {
    localStorage.setItem('waterReminders', JSON.stringify(reminders));
  };

  const resetForm = () => {
    setTitle('Drink Water');
    setAmount('250');
    setFirstTime(new Date());
    setRepeatEvery('2');
    setRepeatUnit('hours');
    setRepeatCount('8');
    setEditingReminderId(null);
  };

  const saveReminders = () => {
    if (!title || !amount || !repeatEvery || !repeatCount) {
      alert('Please fill all required fields');
      return;
    }

    const unitMs = repeatUnit === 'days' ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
    const intervalMs = parseInt(repeatEvery) * unitMs;
    const count = parseInt(repeatCount);
    const newReminders: Reminder[] = [];

    for (let i = 0; i < count; i++) {
      const time = new Date(firstTime.getTime() + i * intervalMs);
      const id = `water_reminder_${Date.now()}_${i}`;

      newReminders.push({
        id,
        title,
        time: time.toISOString(),
        interval: `${repeatEvery} ${repeatUnit}`,
        amount
      });
    }

    let allReminders;
    if (editingReminderId) {
      allReminders = reminders.map(r => 
        r.id === editingReminderId ? 
        { ...newReminders[0], id: editingReminderId } : r
      );
    } else {
      allReminders = [...reminders, ...newReminders];
    }

    setReminders(allReminders);
    saveRemindersToStorage(allReminders);
    resetForm();
    setShowModal(false);
    alert('Water reminders saved successfully!');
  };

  const editReminder = (reminder: Reminder) => {
    setTitle(reminder.title);
    setAmount(reminder.amount);
    setFirstTime(new Date(reminder.time));
    
    const [intervalValue, intervalUnit] = reminder.interval.split(' ');
    setRepeatEvery(intervalValue);
    setRepeatUnit(intervalUnit as 'hours' | 'days');
    
    setEditingReminderId(reminder.id);
    setShowModal(true);
  };

  const deleteReminder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      const updated = reminders.filter(r => r.id !== id);
      setReminders(updated);
      saveRemindersToStorage(updated);
    }
  };

  const markAsDone = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    saveRemindersToStorage(updated);
  };

  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDate = new Date(firstTime);
    newDate.setHours(hours, minutes);
    setFirstTime(newDate);
  };

  const renderReminderItem = (item: Reminder) => (
    <div key={item.id} className="reminder-card">
      <div className="reminder-info">
        <h3 className="reminder-title">{item.title}</h3>
        <p className="reminder-amount">{item.amount}ml</p>
        <p className="reminder-time">
          {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="reminder-details">
          Repeats every {item.interval}
        </p>
      </div>
      <div className="reminder-actions">
        <button 
          className="button edit-button"
          onClick={() => editReminder(item)}
        >
          <Icon icon="mdi:pencil" className="button-icon" />
        </button>
        <button 
          className="button delete-button"
          onClick={() => deleteReminder(item.id)}
        >
          <Icon icon="mdi:delete" className="button-icon" />
        </button>
        <button 
          className="button done-button"
          onClick={() => markAsDone(item.id)}
        >
          <Icon icon="mdi:check" className="button-icon" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="water-reminder-container">
      <div className="header">
        <h1 className="heading">Water Intake Reminder</h1>
        <p className="subtitle">Stay hydrated throughout the day</p>
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Your Reminders</h2>
          <button 
            className="button add-button"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Add Reminder
          </button>
        </div>
        
        {reminders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">💧</span>
            <p className="empty-text">No water reminders set yet</p>
          </div>
        ) : (
          <div className="reminders-list">
            {reminders.map(renderReminderItem)}
          </div>
        )}
      </div>

      {/* Reminder Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingReminderId ? 'Edit Reminder' : 'Add New Reminder'}
              </h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <label className="label">Reminder Title</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Morning Hydration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label className="label">Water Amount (ml)</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 250"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <label className="label">Reminder Time</label>
              <input
                type="time"
                className="time-input"
                value={firstTime.toTimeString().substr(0, 5)}
                onChange={onTimeChange}
              />

              <label className="label">Repeat Every</label>
              <div className="repeat-container">
                <input
                  type="number"
                  className="input repeat-input"
                  placeholder="e.g. 2"
                  value={repeatEvery}
                  onChange={(e) => setRepeatEvery(e.target.value)}
                />
                <div className="unit-row">
                  {['hours', 'days'].map(unit => (
                    <button
                      key={unit}
                      className={`unit-option ${repeatUnit === unit ? 'selected' : ''}`}
                      onClick={() => setRepeatUnit(unit as 'hours' | 'days')}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              <label className="label">Number of Times to Repeat</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 8"
                value={repeatCount}
                onChange={(e) => setRepeatCount(e.target.value)}
              />

              <button 
                className="button save-button"
                onClick={saveReminders}
              >
                {editingReminderId ? 'Update Reminder' : 'Save Reminder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterReminder;