import { DietPlan, UserProfile } from "./diet";

// types/navigation.ts
export type RootStackParamList = {
  HomeScreen: undefined;
  ProfileForm: undefined;
  BMICalculator: undefined;
  BreatheChallenge: undefined;
  WaterReminderScreen: undefined;
  MedicineReminderScreen: undefined;
  Loading: { profile: UserProfile };
  DietPlan: { dietPlan: DietPlan };
};
