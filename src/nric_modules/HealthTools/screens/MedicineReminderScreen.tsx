import React, { useState, useEffect } from 'react';
import './MedicineReminder.css';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  quantity: string;
}

interface Reminder {
  id: string;
  medicineIds: string[];
  title: string;
  time: string;
  interval: string;
}

const mockStorage = {
  reminders: [] as Reminder[],
  medicines: [] as Medicine[],

  async saveReminders(reminders: Reminder[]) {
    this.reminders = reminders;
  },
  async loadReminders() {
    return this.reminders;
  },
  async deleteReminder(id: string) {
    this.reminders = this.reminders.filter(r => r.id !== id);
  },
  async saveMedicines(medicines: Medicine[]) {
    this.medicines = medicines;
  },
  async loadMedicines() {
    return this.medicines;
  },
  async deleteMedicine(id: string) {
    this.medicines = this.medicines.filter(m => m.id !== id);
  }
};

const MedicineReminderScreen = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [currentMedicine, setCurrentMedicine] = useState<Medicine>({ 
    id: '', 
    name: '', 
    dosage: '', 
    quantity: '' 
  });
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);

  const [title, setTitle] = useState('Take Medicine');
  const [firstTime, setFirstTime] = useState(new Date());
  const [repeatEvery, setRepeatEvery] = useState('24');
  const [repeatUnit, setRepeatUnit] = useState<'minutes' | 'hours' | 'days'>('days');
  const [repeatCount, setRepeatCount] = useState('5');
  const [showPicker, setShowPicker] = useState(false);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [savedReminders, savedMedicines] = await Promise.all([
        mockStorage.loadReminders(),
        mockStorage.loadMedicines()
      ]);
      setReminders(savedReminders);
      setMedicines(savedMedicines);
    };
    loadData();
  }, []);

  const resetMedicineForm = () => {
    setCurrentMedicine({ id: '', name: '', dosage: '', quantity: '' });
    setEditingMedicineId(null);
  };

  const resetReminderForm = () => {
    setTitle('Take Medicine');
    setFirstTime(new Date());
    setRepeatEvery('24');
    setRepeatUnit('days');
    setRepeatCount('5');
    setSelectedMedicines([]);
    setEditingReminderId(null);
  };

  const toggleMedicineSelection = (id: string) => {
    setSelectedMedicines(prev => 
      prev.includes(id) 
        ? prev.filter(medId => medId !== id) 
        : [...prev, id]
    );
  };

  const addOrUpdateMedicine = async () => {
    const { name, dosage, quantity } = currentMedicine;
    if (!name || !dosage || !quantity) {
      alert('Error: Please fill all medicine fields');
      return;
    }

    let updated;
    if (editingMedicineId) {
      updated = medicines.map(m => 
        m.id === editingMedicineId ? { ...currentMedicine, id: editingMedicineId } : m
      );
    } else {
      const newMed = { ...currentMedicine, id: Date.now().toString() };
      updated = [...medicines, newMed];
    }

    setMedicines(updated);
    await mockStorage.saveMedicines(updated);
    resetMedicineForm();
    setShowMedicineModal(false);
  };

  const editMedicine = (id: string) => {
    const medicine = medicines.find(m => m.id === id);
    if (medicine) {
      setCurrentMedicine(medicine);
      setEditingMedicineId(id);
      setShowMedicineModal(true);
    }
  };

  const deleteMedicine = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      const updated = medicines.filter(m => m.id !== id);
      setMedicines(updated);
      await mockStorage.saveMedicines(updated);
    }
  };

  const saveReminders = async () => {
    if (selectedMedicines.length === 0) {
      alert('Error: Please select at least one medicine');
      return;
    }

    const unitMs =
      repeatUnit === 'days' ? 24 * 60 * 60 * 1000 :
      repeatUnit === 'hours' ? 60 * 60 * 1000 :
      60 * 1000;

    const intervalMs = parseInt(repeatEvery) * unitMs;
    const count = parseInt(repeatCount);
    const newReminders: Reminder[] = [];

    for (let i = 0; i < count; i++) {
      const time = new Date(firstTime.getTime() + i * intervalMs);
      const id = `reminder_${Date.now()}_${i}`;

      newReminders.push({
        id,
        title,
        time: time.toISOString(),
        interval: `${repeatEvery} ${repeatUnit}`,
        medicineIds: selectedMedicines
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
    await mockStorage.saveReminders(allReminders);
    resetReminderForm();
    setShowReminderModal(false);
    alert('Success: Reminders saved successfully!');
  };

  const editReminder = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      setTitle(reminder.title);
      setFirstTime(new Date(reminder.time));
      
      const [intervalValue, intervalUnit] = reminder.interval.split(' ');
      setRepeatEvery(intervalValue);
      setRepeatUnit(intervalUnit as 'minutes' | 'hours' | 'days');
      
      setSelectedMedicines(reminder.medicineIds);
      setEditingReminderId(id);
      setShowReminderModal(true);
    }
  };

  const deleteReminder = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      const updated = reminders.filter(r => r.id !== id);
      setReminders(updated);
      await mockStorage.saveReminders(updated);
    }
  };

  const markAsDone = async (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    await mockStorage.saveReminders(updated);
  };

  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value;
    const [hours, minutes] = timeString.split(':').map(Number);
    const newTime = new Date();
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    setFirstTime(newTime);
  };

  const renderMedicineItem = (item: Medicine) => (
    <div key={item.id} className="medicine-card">
      <div className="medicine-info">
        <div className="medicine-name">{item.name}</div>
        <div className="medicine-details">{item.quantity} {item.dosage}</div>
      </div>
      <div className="medicine-actions">
        <button 
          className="button edit-button"
          onClick={() => editMedicine(item.id)}
        >
          Edit
        </button>
        <button 
          className="button delete-button"
          onClick={() => deleteMedicine(item.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );

  const renderReminderItem = (item: Reminder) => (
    <div key={item.id} className="reminder-card">
      <div className="reminder-info">
        <div className="reminder-title">{item.title}</div>
        <div className="reminder-time">
          {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="reminder-details">
          Repeats every {item.interval}
        </div>
        <div className="reminder-meds">
          {item.medicineIds.map(id => {
            const med = medicines.find(m => m.id === id);
            return med ? `${med.name} (${med.quantity} ${med.dosage})` : '';
          }).join(', ')}
        </div>
      </div>
      <div className="reminder-actions">
        <button 
          className="button edit-button"
          onClick={() => editReminder(item.id)}
        >
          Edit
        </button>
        <button 
          className="button delete-button"
          onClick={() => deleteReminder(item.id)}
        >
          Delete
        </button>
        <button 
          className="button done-button"
          onClick={() => markAsDone(item.id)}
        >
          Done
        </button>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="scroll-container">
        <div className="header">
          <h1 className="heading">Medicine Reminder</h1>
          <div className="subtitle">Manage your medications and reminders</div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Your Medicines</h2>
            <button 
              className="button add-button"
              onClick={() => {
                resetMedicineForm();
                setShowMedicineModal(true);
              }}
            >
              Add Medicine
            </button>
          </div>
          
          {medicines.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💊</div>
              <div className="empty-text">No medicines added yet</div>
            </div>
          ) : (
            <div className="medicines-list">
              {medicines.map(renderMedicineItem)}
            </div>
          )}
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Your Reminders</h2>
            <button 
              className="button add-button"
              onClick={() => {
                resetReminderForm();
                setShowReminderModal(true);
              }}
              disabled={medicines.length === 0}
            >
              Add Reminder
            </button>
          </div>
          
          {reminders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⏰</div>
              <div className="empty-text">No reminders set yet</div>
            </div>
          ) : (
            <div className="reminders-list">
              {reminders.map(renderReminderItem)}
            </div>
          )}
        </div>
      </div>

      {/* Medicine Modal */}
      {showMedicineModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingMedicineId ? 'Edit Medicine' : 'Add New Medicine'}
              </h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowMedicineModal(false);
                  resetMedicineForm();
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <label className="label">Medicine Name</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. Paracetamol"
                value={currentMedicine.name}
                onChange={(e) => setCurrentMedicine({ ...currentMedicine, name: e.target.value })}
              />

              <label className="label">Dosage Type</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. tablet, mg, ml"
                value={currentMedicine.dosage}
                onChange={(e) => setCurrentMedicine({ ...currentMedicine, dosage: e.target.value })}
              />

              <label className="label">Quantity</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. 1, 2, 500"
                value={currentMedicine.quantity}
                onChange={(e) => setCurrentMedicine({ ...currentMedicine, quantity: e.target.value })}
              />

              <button 
                className="button save-button"
                onClick={addOrUpdateMedicine}
              >
                {editingMedicineId ? 'Update Medicine' : 'Add Medicine'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingReminderId ? 'Edit Reminder' : 'Add New Reminder'}
              </h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowReminderModal(false);
                  resetReminderForm();
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <label className="label">Reminder Title</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. Morning Dose"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label className="label">Reminder Time</label>
              <input
                className="input"
                type="time"
                value={firstTime.toTimeString().substring(0, 5)}
                onChange={onTimeChange}
              />

              <label className="label">Repeat Every</label>
              <div className="repeat-container">
                <input
                  className="input repeat-input"
                  type="number"
                  placeholder="e.g. 2"
                  value={repeatEvery}
                  onChange={(e) => setRepeatEvery(e.target.value)}
                />
                <div className="unit-row">
                  {['minutes', 'hours', 'days'].map(unit => (
                    <button
                      key={unit}
                      className={`unit-option ${repeatUnit === unit ? 'unit-option-selected' : ''}`}
                      onClick={() => setRepeatUnit(unit as any)}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              <label className="label">Number of Times to Repeat</label>
              <input
                className="input"
                type="number"
                placeholder="e.g. 3"
                value={repeatCount}
                onChange={(e) => setRepeatCount(e.target.value)}
              />

              <label className="label">Select Medicines</label>
              {medicines.length === 0 ? (
                <div className="warning-text">Please add medicines first</div>
              ) : (
                <div className="medicines-list">
                  {medicines.map(med => (
                    <div
                      key={med.id}
                      className={`medicine-in-reminder ${selectedMedicines.includes(med.id) ? 'selected-medicine' : ''}`}
                      onClick={() => toggleMedicineSelection(med.id)}
                    >
                      <div className="medicine-in-reminder-text">
                        {med.name} ({med.quantity} {med.dosage})
                      </div>
                      {selectedMedicines.includes(med.id) && (
                        <div className="checkmark">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button 
                className="button save-button"
                onClick={saveReminders}
                disabled={selectedMedicines.length === 0}
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

export default MedicineReminderScreen;