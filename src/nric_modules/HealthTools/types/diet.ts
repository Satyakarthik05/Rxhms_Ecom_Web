export type Gender = 'male' | 'female' | 'other';

export interface UserProfile {
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  targetWeight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
goal: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'muscle_gain'
  medicalConditions: string[];
  vitaminDeficiencies: string[];
  preferredCuisines: string[];
  mealsPerDay: number;
  waterIntake: number;
  allergies: string[];
  dietaryRestrictions: string[];
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