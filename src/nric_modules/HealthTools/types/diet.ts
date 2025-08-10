export type Gender = 'male' | 'female' | 'other';

export interface UserProfile {
  // Basic Info
  name: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  
  // Activity & Goals
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'muscle_gain' | 'general_health';
  targetWeight?: number;
  
  // Health Conditions
  medicalConditions: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  
  // Vitamin Deficiencies
  vitaminDeficiencies: string[];
  
  // Preferences
  cuisinePreferences: string[];
  dislikedFoods: string[];
  mealsPerDay: number;
  waterIntake: number; // glasses per day
}

export interface NutritionalNeeds {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  water: number; // liters
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
}

export interface FoodItem {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: string[];
  minerals: string[];
  benefits: string[];
  portion: string;
}

export interface MealPlan {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snacks: FoodItem[];
}

export interface DietPlan {
  profile: UserProfile;
  nutritionalNeeds: NutritionalNeeds;
  weeklyMealPlan: Record<string, MealPlan>;
  recommendedFoods: FoodItem[];
  supplementsNeeded: string[];
  tips: string[];
  warnings: string[];
}