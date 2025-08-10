import axios from 'axios';
import { Question } from '../types/Question';

const API_URL = 'http://10.195.252.105:9999/rxhms-api/api/questions';

export const saveQuestionsToBackend = async (questions: Question[]) => {
  try {
    const response = await axios.post(`${API_URL}/save`, questions);
    return response.data;
  } catch (error) {
    console.error('Error saving questions:', error);
    throw error;
  }
};

export const loadQuestionsFromBackend = async (): Promise<Question[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error loading questions:', error);
    throw error;
  }
};