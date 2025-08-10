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
  amount?: string;
}

export const saveReminder = async (type: 'water' | 'medicine', data: Reminder | Reminder[]) => {
  try {
    const key = `${type}_reminders`;
    const existing = localStorage.getItem(key);
    let reminders: Reminder[] = existing ? JSON.parse(existing) : [];

    if (Array.isArray(data)) {
      reminders = [...reminders, ...data];
    } else {
      reminders.push(data);
    }

    localStorage.setItem(key, JSON.stringify(reminders));
    return true;
  } catch (error) {
    console.error('Error saving reminder:', error);
    return false;
  }
};

export const loadReminders = async (type: 'water' | 'medicine'): Promise<Reminder[]> => {
  try {
    const data = localStorage.getItem(`${type}_reminders`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading reminders:', error);
    return [];
  }
};

export const updateReminder = async (type: 'water' | 'medicine', id: string, updatedData: Partial<Reminder>) => {
  try {
    const reminders = await loadReminders(type);
    const index = reminders.findIndex(r => r.id === id);
    
    if (index !== -1) {
      reminders[index] = { ...reminders[index], ...updatedData };
      localStorage.setItem(`${type}_reminders`, JSON.stringify(reminders));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating reminder:', error);
    return false;
  }
};

export const deleteReminder = async (type: 'water' | 'medicine', id: string) => {
  try {
    const reminders = await loadReminders(type);
    const filteredReminders = reminders.filter(r => r.id !== id);
    localStorage.setItem(`${type}_reminders`, JSON.stringify(filteredReminders));
    return true;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }
};

export const saveMedicines = async (medicines: Medicine[]) => {
  try {
    localStorage.setItem('medicines', JSON.stringify(medicines));
    return true;
  } catch (error) {
    console.error('Error saving medicines:', error);
    return false;
  }
};

export const loadMedicines = async (): Promise<Medicine[]> => {
  try {
    const data = localStorage.getItem('medicines');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading medicines:', error);
    return [];
  }
};

export const deleteMedicine = async (id: string) => {
  try {
    const medicines = await loadMedicines();
    const filteredMedicines = medicines.filter(m => m.id !== id);
    await saveMedicines(filteredMedicines);
    
    // Also remove this medicine from any reminders
    const reminders = await loadReminders('medicine');
    const updatedReminders = reminders.map(reminder => ({
      ...reminder,
      medicineIds: reminder.medicineIds.filter(medId => medId !== id)
    })).filter(reminder => reminder.medicineIds.length > 0);
    
    localStorage.setItem('medicine_reminders', JSON.stringify(updatedReminders));
    
    return true;
  } catch (error) {
    console.error('Error deleting medicine:', error);
    return false;
  }
};