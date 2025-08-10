import { UserProfile, DietPlan, NutritionalNeeds, FoodItem, MealPlan } from '../types/diet';

export class DietAIService {
  static calculateBMR(profile: UserProfile): number {
    // Mifflin-St Jeor Equation
    const { weight, height, age, gender } = profile;
    let bmr: number;
    
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    return bmr;
  }

  static calculateTDEE(bmr: number, activityLevel: string): number {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    return bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2);
  }

  static calculateCalorieGoal(tdee: number, goal: string): number {
    switch (goal) {
      case 'lose_weight':
        return Math.round(tdee - 500); // 1 lb per week
      case 'gain_weight':
        return Math.round(tdee + 500);
      case 'muscle_gain':
        return Math.round(tdee + 300);
      default:
        return Math.round(tdee);
    }
  }

  static calculateNutritionalNeeds(profile: UserProfile): NutritionalNeeds {
    const bmr = this.calculateBMR(profile);
    const tdee = this.calculateTDEE(bmr, profile.activityLevel);
    const calories = this.calculateCalorieGoal(tdee, profile.goal);
    
    // Macronutrient calculations
    let proteinRatio = 0.25; // Default 25%
    let carbRatio = 0.45;    // Default 45%
    let fatRatio = 0.30;     // Default 30%
    
    // Adjust based on goals and conditions
    if (profile.goal === 'muscle_gain') {
      proteinRatio = 0.30;
      carbRatio = 0.40;
      fatRatio = 0.30;
    } else if (profile.dietaryRestrictions?.includes('Keto')) {
      proteinRatio = 0.25;
      carbRatio = 0.05;
      fatRatio = 0.70;
    } else if (profile.dietaryRestrictions?.includes('Low Fat')) {
      proteinRatio = 0.30;
      carbRatio = 0.55;
      fatRatio = 0.15;
    }
    
    const protein = Math.round((calories * proteinRatio) / 4); // 4 calories per gram
    const carbs = Math.round((calories * carbRatio) / 4);
    const fat = Math.round((calories * fatRatio) / 9); // 9 calories per gram
    
    return {
      calories,
      protein,
      carbs,
      fat,
      fiber: Math.round(calories / 1000 * 14), // 14g per 1000 calories
      water: Math.round(profile.weight * 0.035), // 35ml per kg body weight
      vitamins: this.getVitaminNeeds(profile),
      minerals: this.getMineralNeeds(profile)
    };
  }

  static getVitaminNeeds(profile: UserProfile): Record<string, number> {
    const baseNeeds = {
      'Vitamin A': profile.gender === 'male' ? 900 : 700, // mcg
      'Vitamin C': profile.gender === 'male' ? 90 : 75,   // mg
      'Vitamin D': 600, // IU
      'Vitamin E': 15,  // mg
      'Vitamin K': profile.gender === 'male' ? 120 : 90,  // mcg
      'Vitamin B1': profile.gender === 'male' ? 1.2 : 1.1, // mg
      'Vitamin B2': profile.gender === 'male' ? 1.3 : 1.1, // mg
      'Vitamin B3': profile.gender === 'male' ? 16 : 14,   // mg
      'Vitamin B6': 1.3, // mg
      'Vitamin B12': 2.4, // mcg
      'Folate': 400, // mcg
    };
    
    // Increase needs based on deficiencies
   type VitaminKey = keyof typeof baseNeeds;

profile.vitaminDeficiencies?.forEach(deficiency => {
  if (deficiency in baseNeeds) {
    baseNeeds[deficiency as VitaminKey] *= 1.5;
  }
});

    
    return baseNeeds;
  }

  static getMineralNeeds(profile: UserProfile): Record<string, number> {
    const baseNeeds = {
      'Calcium': profile.age > 50 ? 1200 : 1000, // mg
      'Iron': profile.gender === 'female' && profile.age < 51 ? 18 : 8, // mg
      'Magnesium': profile.gender === 'male' ? 400 : 310, // mg
      'Phosphorus': 700, // mg
      'Potassium': 4700, // mg
      'Sodium': 2300, // mg (upper limit)
      'Zinc': profile.gender === 'male' ? 11 : 8, // mg
    };
    
    // Adjust based on conditions
    if (profile.medicalConditions?.includes('Hypertension')) {
      baseNeeds['Sodium'] = 1500; // Lower sodium for hypertension
      baseNeeds['Potassium'] *= 1.2; // Increase potassium
    }
    
    if (profile.medicalConditions?.includes('Osteoporosis')) {
      baseNeeds['Calcium'] *= 1.3;
      baseNeeds['Magnesium'] *= 1.2;
    }
    
    return baseNeeds;
  }

  static getFoodDatabase(): FoodItem[] {
    return [
      // Proteins
      {
        name: 'Grilled Chicken Breast',
        category: 'Protein',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0,
        vitamins: ['Vitamin B6', 'Vitamin B3', 'Vitamin B12'],
        minerals: ['Phosphorus', 'Selenium'],
        benefits: ['High protein', 'Low fat', 'Muscle building'],
        portion: '100g'
      },
      {
        name: 'Salmon Fillet',
        category: 'Protein',
        calories: 208,
        protein: 25,
        carbs: 0,
        fat: 12,
        fiber: 0,
        vitamins: ['Vitamin D', 'Vitamin B12', 'Vitamin B6'],
        minerals: ['Potassium', 'Selenium'],
        benefits: ['Omega-3 fatty acids', 'Heart health', 'Brain function'],
        portion: '100g'
      },
      {
        name: 'Greek Yogurt',
        category: 'Protein',
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fat: 0.4,
        fiber: 0,
        vitamins: ['Vitamin B12', 'Vitamin B2'],
        minerals: ['Calcium', 'Phosphorus'],
        benefits: ['Probiotics', 'Bone health', 'High protein'],
        portion: '100g'
      },
      {
        name: 'Lentils',
        category: 'Protein',
        calories: 116,
        protein: 9,
        carbs: 20,
        fat: 0.4,
        fiber: 8,
        vitamins: ['Folate', 'Vitamin B1'],
        minerals: ['Iron', 'Potassium'],
        benefits: ['Plant protein', 'High fiber', 'Heart health'],
        portion: '100g cooked'
      },
      
      // Carbohydrates
      {
        name: 'Quinoa',
        category: 'Carbohydrate',
        calories: 120,
        protein: 4.4,
        carbs: 22,
        fat: 1.9,
        fiber: 2.8,
        vitamins: ['Folate', 'Vitamin E'],
        minerals: ['Magnesium', 'Iron'],
        benefits: ['Complete protein', 'Gluten-free', 'High fiber'],
        portion: '100g cooked'
      },
      {
        name: 'Brown Rice',
        category: 'Carbohydrate',
        calories: 111,
        protein: 2.6,
        carbs: 23,
        fat: 0.9,
        fiber: 1.8,
        vitamins: ['Vitamin B3', 'Vitamin B6'],
        minerals: ['Magnesium', 'Phosphorus'],
        benefits: ['Whole grain', 'Sustained energy', 'Heart health'],
        portion: '100g cooked'
      },
      {
        name: 'Sweet Potato',
        category: 'Carbohydrate',
        calories: 86,
        protein: 1.6,
        carbs: 20,
        fat: 0.1,
        fiber: 3,
        vitamins: ['Vitamin A', 'Vitamin C'],
        minerals: ['Potassium', 'Manganese'],
        benefits: ['High in beta-carotene', 'Antioxidants', 'Eye health'],
        portion: '100g'
      },
      
      // Vegetables
      {
        name: 'Spinach',
        category: 'Vegetable',
        calories: 23,
        protein: 2.9,
        carbs: 3.6,
        fat: 0.4,
        fiber: 2.2,
        vitamins: ['Vitamin K', 'Vitamin A', 'Folate', 'Vitamin C'],
        minerals: ['Iron', 'Calcium'],
        benefits: ['Rich in iron', 'Antioxidants', 'Eye health'],
        portion: '100g'
      },
      {
        name: 'Broccoli',
        category: 'Vegetable',
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fat: 0.4,
        fiber: 2.6,
        vitamins: ['Vitamin C', 'Vitamin K', 'Folate'],
        minerals: ['Potassium', 'Iron'],
        benefits: ['Cancer-fighting compounds', 'High in vitamin C', 'Detox support'],
        portion: '100g'
      },
      {
        name: 'Bell Peppers',
        category: 'Vegetable',
        calories: 31,
        protein: 1,
        carbs: 7,
        fat: 0.3,
        fiber: 2.5,
        vitamins: ['Vitamin C', 'Vitamin A'],
        minerals: ['Potassium'],
        benefits: ['High vitamin C', 'Antioxidants', 'Eye health'],
        portion: '100g'
      },
      
      // Fruits
      {
        name: 'Blueberries',
        category: 'Fruit',
        calories: 57,
        protein: 0.7,
        carbs: 14,
        fat: 0.3,
        fiber: 2.4,
        vitamins: ['Vitamin C', 'Vitamin K'],
        minerals: ['Manganese'],
        benefits: ['Antioxidants', 'Brain health', 'Anti-inflammatory'],
        portion: '100g'
      },
      {
        name: 'Avocado',
        category: 'Fruit',
        calories: 160,
        protein: 2,
        carbs: 9,
        fat: 15,
        fiber: 7,
        vitamins: ['Vitamin K', 'Folate', 'Vitamin C'],
        minerals: ['Potassium'],
        benefits: ['Healthy fats', 'Heart health', 'Nutrient absorption'],
        portion: '100g'
      },
      {
        name: 'Banana',
        category: 'Fruit',
        calories: 89,
        protein: 1.1,
        carbs: 23,
        fat: 0.3,
        fiber: 2.6,
        vitamins: ['Vitamin B6', 'Vitamin C'],
        minerals: ['Potassium'],
        benefits: ['Quick energy', 'Potassium for heart health', 'Natural sugars'],
        portion: '100g'
      },
      
      // Healthy Fats
      {
        name: 'Almonds',
        category: 'Nuts/Seeds',
        calories: 579,
        protein: 21,
        carbs: 22,
        fat: 50,
        fiber: 12,
        vitamins: ['Vitamin E'],
        minerals: ['Magnesium', 'Calcium'],
        benefits: ['Heart health', 'Vitamin E', 'Healthy fats'],
        portion: '100g'
      },
      {
        name: 'Chia Seeds',
        category: 'Nuts/Seeds',
        calories: 486,
        protein: 17,
        carbs: 42,
        fat: 31,
        fiber: 34,
        vitamins: ['Vitamin B3'],
        minerals: ['Calcium', 'Phosphorus'],
        benefits: ['Omega-3', 'High fiber', 'Protein'],
        portion: '100g'
      },
      
      // Dairy/Alternatives
      {
        name: 'Low-fat Milk',
        category: 'Dairy',
        calories: 42,
        protein: 3.4,
        carbs: 5,
        fat: 1,
        fiber: 0,
        vitamins: ['Vitamin D', 'Vitamin B12'],
        minerals: ['Calcium', 'Phosphorus'],
        benefits: ['Bone health', 'High quality protein', 'Calcium'],
        portion: '100ml'
      }
    ];
  }

  static generateMealPlan(profile: UserProfile, nutritionalNeeds: NutritionalNeeds): Record<string, MealPlan> {
    const foodDatabase = this.getFoodDatabase();
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyPlan: Record<string, MealPlan> = {};

    weekDays.forEach(day => {
      weeklyPlan[day] = this.createDayMealPlan(profile, nutritionalNeeds, foodDatabase);
    });

    return weeklyPlan;
  }

  static createDayMealPlan(profile: UserProfile, needs: NutritionalNeeds, foods: FoodItem[]): MealPlan {
    // Filter foods based on allergies and restrictions
    const suitableFoods = foods.filter(food => {
      // Check allergies
      if (profile.allergies?.some(allergy => 
        food.name.toLowerCase().includes(allergy.toLowerCase()) ||
        food.category.toLowerCase().includes(allergy.toLowerCase())
      )) {
        return false;
      }

      // Check dietary restrictions
      if (profile.dietaryRestrictions?.includes('Vegetarian') && 
          ['Chicken', 'Beef', 'Fish', 'Salmon'].some(meat => food.name.includes(meat))) {
        return false;
      }

      if (profile.dietaryRestrictions?.includes('Vegan') && 
          (food.category === 'Dairy' || ['Chicken', 'Beef', 'Fish', 'Salmon', 'Egg'].some(animal => food.name.includes(animal)))) {
        return false;
      }

      return true;
    });

    // Distribute calories across meals
    const calorieDistribution = {
      breakfast: Math.round(needs.calories * 0.25),
      lunch: Math.round(needs.calories * 0.35),
      dinner: Math.round(needs.calories * 0.30),
      snacks: Math.round(needs.calories * 0.10)
    };

    return {
      breakfast: this.selectFoodsForMeal(suitableFoods, calorieDistribution.breakfast, 'breakfast'),
      lunch: this.selectFoodsForMeal(suitableFoods, calorieDistribution.lunch, 'lunch'),
      dinner: this.selectFoodsForMeal(suitableFoods, calorieDistribution.dinner, 'dinner'),
      snacks: this.selectFoodsForMeal(suitableFoods, calorieDistribution.snacks, 'snacks')
    };
  }

  static selectFoodsForMeal(foods: FoodItem[], targetCalories: number, mealType: string): FoodItem[] {
    const mealFoods: FoodItem[] = [];
    let currentCalories = 0;

    // Define food preferences by meal type
    const mealPreferences = {
      breakfast: ['Greek Yogurt', 'Banana', 'Blueberries', 'Almonds', 'Low-fat Milk'],
      lunch: ['Quinoa', 'Grilled Chicken Breast', 'Spinach', 'Bell Peppers', 'Avocado'],
      dinner: ['Salmon Fillet', 'Sweet Potato', 'Broccoli', 'Brown Rice'],
      snacks: ['Almonds', 'Blueberries', 'Greek Yogurt', 'Chia Seeds']
    };

    const preferredFoods = foods.filter(food => 
      mealPreferences[mealType as keyof typeof mealPreferences]?.some(pref => 
        food.name.includes(pref)
      )
    );

    // Add preferred foods first
    preferredFoods.forEach(food => {
      if (currentCalories < targetCalories * 0.8) {
        mealFoods.push(food);
        currentCalories += food.calories;
      }
    });

    // Fill remaining calories with other suitable foods
    const remainingFoods = foods.filter(food => !mealFoods.includes(food));
    remainingFoods.forEach(food => {
      if (currentCalories < targetCalories && mealFoods.length < 4) {
        mealFoods.push(food);
        currentCalories += food.calories;
      }
    });

    return mealFoods.slice(0, 4); // Limit to 4 foods per meal
  }

  static getDeficiencyFoods(profile: UserProfile): FoodItem[] {
    const foods = this.getFoodDatabase();
    const deficiencyFoods: FoodItem[] = [];

    profile.vitaminDeficiencies?.forEach(deficiency => {
      const relevantFoods = foods.filter(food => 
        food.vitamins.includes(deficiency) || food.minerals.includes(deficiency)
      );
      deficiencyFoods.push(...relevantFoods);
    });

    // Remove duplicates
    return deficiencyFoods.filter((food, index, self) => 
      index === self.findIndex(f => f.name === food.name)
    );
  }

  static generateTips(profile: UserProfile): string[] {
    const tips: string[] = [];

    // Goal-specific tips
    if (profile.goal === 'lose_weight') {
      tips.push(
        'Eat slowly and mindfully to help with portion control',
        'Include protein in every meal to maintain muscle mass',
        'Stay hydrated - sometimes thirst is mistaken for hunger'
      );
    } else if (profile.goal === 'muscle_gain') {
      tips.push(
        'Eat protein within 30 minutes after workout',
        'Include complex carbohydrates for sustained energy',
        'Don\'t skip meals - consistent nutrition is key'
      );
    }

    // Activity-specific tips
    if (profile.activityLevel === 'very_active') {
      tips.push('Increase carbohydrate intake on heavy training days');
    }

    // Health condition tips
    if (profile.medicalConditions?.includes('Diabetes')) {
      tips.push(
        'Monitor blood sugar levels regularly',
        'Choose complex carbohydrates over simple sugars',
        'Eat at consistent times throughout the day'
      );
    }

    if (profile.medicalConditions?.includes('Hypertension')) {
      tips.push(
        'Limit sodium intake to less than 2300mg per day',
        'Include potassium-rich foods like bananas and leafy greens'
      );
    }

    // Deficiency-specific tips
    if (profile.vitaminDeficiencies?.includes('Vitamin D')) {
      tips.push('Consider getting 10-15 minutes of sunlight daily');
    }

    if (profile.vitaminDeficiencies?.includes('Iron')) {
      tips.push('Combine iron-rich foods with vitamin C for better absorption');
    }

    // General tips
    tips.push(
      'Meal prep on weekends to stay consistent during busy weekdays',
      'Keep a food diary to track your progress',
      'Listen to your body and adjust portions as needed'
    );

    return tips;
  }

  static generateWarnings(profile: UserProfile): string[] {
    const warnings: string[] = [];

    // Medical condition warnings
    if (profile.medicalConditions?.includes('Diabetes')) {
      warnings.push('Monitor blood glucose levels regularly and adjust medication as needed');
    }

    if (profile.medicalConditions?.includes('Kidney Disease')) {
      warnings.push('Limit protein intake as recommended by your healthcare provider');
    }

    if (profile.medicalConditions?.includes('Heart Disease')) {
      warnings.push('Keep sodium intake low and monitor cholesterol levels');
    }

    // Allergy warnings
    if (profile.allergies && profile.allergies.length > 0) {
      warnings.push('Always check food labels for allergens before consuming');
    }

    // General warnings
    warnings.push(
      'Consult with a healthcare provider before making significant dietary changes',
      'This plan is for educational purposes - individual needs may vary',
      'Stop any food that causes adverse reactions and consult a doctor'
    );

    return warnings;
  }

  static generateSupplementsNeeded(profile: UserProfile): string[] {
    const supplements: string[] = [];

    // Based on deficiencies
    profile.vitaminDeficiencies?.forEach(deficiency => {
      if (deficiency === 'Vitamin D') {
        supplements.push('Vitamin D3 (1000-2000 IU daily)');
      } else if (deficiency === 'Vitamin B12') {
        supplements.push('Vitamin B12 (250-500 mcg daily)');
      } else if (deficiency === 'Iron') {
        supplements.push('Iron supplement (with vitamin C for absorption)');
      } else if (deficiency === 'Omega-3') {
        supplements.push('Fish oil or algae-based omega-3 (1000mg EPA/DHA daily)');
      }
    });

    // Based on dietary restrictions
    if (profile.dietaryRestrictions?.includes('Vegan')) {
      if (!supplements.some(s => s.includes('B12'))) {
        supplements.push('Vitamin B12 (essential for vegans)');
      }
      supplements.push('Algae-based omega-3 supplement');
    }

    // Based on age and gender
    if (profile.age > 50) {
      supplements.push('Calcium and Vitamin D for bone health');
    }

    if (profile.gender === 'female' && profile.age < 51) {
      supplements.push('Iron supplement (if not getting enough from diet)');
    }

    // Based on activity level
    if (profile.activityLevel === 'very_active') {
      supplements.push('Magnesium for muscle recovery');
      supplements.push('Electrolyte replacement during intense workouts');
    }

    return supplements;
  }

  static async generateDietPlan(profile: UserProfile): Promise<DietPlan> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const nutritionalNeeds = this.calculateNutritionalNeeds(profile);
    const weeklyMealPlan = this.generateMealPlan(profile, nutritionalNeeds);
    const recommendedFoods = this.getDeficiencyFoods(profile);
    const supplementsNeeded = this.generateSupplementsNeeded(profile);
    const tips = this.generateTips(profile);
    const warnings = this.generateWarnings(profile);

    return {
      profile,
      nutritionalNeeds,
      weeklyMealPlan,
      recommendedFoods,
      supplementsNeeded,
      tips,
      warnings
    };
  }
}