// src/types.ts
export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  quantity: string;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  interval: string;
  amount?: string; // For water reminders
  medicineIds?: string[]; // For medicine reminders
}