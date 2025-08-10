// src/components/reminderStore.ts
import { Reminder, Medicine } from './types';

export const saveReminder = async (type: 'water' | 'medicine', data: Reminder | Reminder[]) => {
  try {
    const key = `@${type}_reminders`;
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
    const data = localStorage.getItem(`@${type}_reminders`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading reminders:', error);
    return [];
  }
};

export const deleteReminder = async (type: 'water' | 'medicine', id: string) => {
  try {
    const reminders = await loadReminders(type);
    const filteredReminders = reminders.filter(r => r.id !== id);
    localStorage.setItem(`@${type}_reminders`, JSON.stringify(filteredReminders));
    return true;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }
};

export const saveMedicines = async (medicines: Medicine[]) => {
  try {
    localStorage.setItem('@medicines', JSON.stringify(medicines));
    return true;
  } catch (error) {
    console.error('Error saving medicines:', error);
    return false;
  }
};

export const loadMedicines = async (): Promise<Medicine[]> => {
  try {
    const data = localStorage.getItem('@medicines');
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
    return true;
  } catch (error) {
    console.error('Error deleting medicine:', error);
    return false;
  }
};
