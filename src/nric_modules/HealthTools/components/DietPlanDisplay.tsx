import React, { useState } from 'react';
import { User, Activity, Heart, Utensils, CheckCircle, ArrowLeft, ArrowRight, Download, Share2, RotateCcw } from 'lucide-react';
import { DietAIService } from '../services/dietAI';
import { UserProfile, DietPlan } from '../types/diet';
import './DietPlanDisplay.css';

const DietPlanDisplay: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDietPlan, setShowDietPlan] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    age: 0,
    gender: 'male',
    height: 0,
    weight: 0,
    targetWeight: 0,
    activityLevel: 'sedentary',
    goal: 'maintain_weight',
    medicalConditions: [],
    vitaminDeficiencies: [],
    preferredCuisines: [],
    mealsPerDay: 3,
    waterIntake: 8,
    allergies: [],
    dietaryRestrictions: []
  });

  const totalSteps = 6;

  const updateFormData = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof UserProfile, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.age && formData.gender && formData.height && formData.weight);
      case 2:
        return !!(formData.activityLevel && formData.goal);
      case 3:
        return true; // Optional step
      case 4:
        return formData.preferredCuisines.length > 0;
      case 5:
        return true; // Optional step
      case 6:
        return true; // Review step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateDietPlan = async () => {
    setIsGenerating(true);
    try {
      const generatedPlan = await DietAIService.generateDietPlan(formData);
      setDietPlan(generatedPlan);
      setShowDietPlan(true);
    } catch (error) {
      console.error('Error generating diet plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setShowDietPlan(false);
    setDietPlan(null);
    setFormData({
      fullName: '',
      age: 0,
      gender: 'male',
      height: 0,
      weight: 0,
      targetWeight: 0,
      activityLevel: 'sedentary',
      goal: 'maintain_weight',
      medicalConditions: [],
      vitaminDeficiencies: [],
      preferredCuisines: [],
      mealsPerDay: 3,
      waterIntake: 8,
      allergies: [],
      dietaryRestrictions: []
    });
  };

  const getProgressPercentage = () => {
    return Math.round((currentStep / totalSteps) * 100);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header">
              <User className="step-icon" />
              <h2>Basic Information</h2>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                placeholder="Your age"
                value={formData.age || ''}
                onChange={(e) => updateFormData('age', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <div className="button-group">
                {['male', 'female', 'other'].map(gender => (
                  <button
                    key={gender}
                    type="button"
                    className={`option-button ${formData.gender === gender ? 'selected' : ''}`}
                    onClick={() => updateFormData('gender', gender)}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                placeholder="Height in centimeters"
                value={formData.height || ''}
                onChange={(e) => updateFormData('height', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Current Weight (kg)</label>
              <input
                type="number"
                placeholder="Current weight in kg"
                value={formData.weight || ''}
                onChange={(e) => updateFormData('weight', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Target Weight (kg) - Optional</label>
              <input
                type="number"
                placeholder="Target weight in kg"
                value={formData.targetWeight || ''}
                onChange={(e) => updateFormData('targetWeight', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-header">
              <Activity className="step-icon" />
              <h2>Activity Level & Goals</h2>
            </div>

            <div className="form-group">
              <label>Activity Level</label>
              <div className="selection-grid">
                {[
                  { value: 'sedentary', description: 'Little to no exercise' },
                  { value: 'light', description: 'Light exercise 1-3 days/week' },
                  { value: 'moderate', description: 'Moderate exercise 3-5 days/week' },
                  { value: 'active', description: 'Heavy exercise 6-7 days/week' },
                  { value: 'very_active', description: 'Very heavy exercise, physical job' }
                ].map(activity => (
                  <div
                    key={activity.value}
                    className={`selection-card ${formData.activityLevel === activity.value ? 'selected' : ''}`}
                    onClick={() => updateFormData('activityLevel', activity.value)}
                  >
                    <h4>{activity.value.charAt(0).toUpperCase() + activity.value.slice(1)}</h4>
                    <p>{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Primary Goal</label>
              <div className="selection-grid">
                {[
                  { value: 'lose_weight', description: 'Reduce body weight and fat' },
                  { value: 'maintain_weight', description: 'Keep current weight stable' },
                  { value: 'gain_weight', description: 'Increase body weight and muscle' },
                  { value: 'muscle_gain', description: 'Focus on muscle development' }
                ].map(goal => (
                  <div
                    key={goal.value}
                    className={`selection-card ${formData.goal === goal.value ? 'selected' : ''}`}
                    onClick={() => updateFormData('goal', goal.value)}
                  >
                    <h4>{goal.value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h4>
                    <p>{goal.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-header">
              <Heart className="step-icon" />
              <h2>Health Conditions</h2>
            </div>

            <div className="form-group">
              <label>Medical Conditions (Select all that apply)</label>
              <div className="checkbox-grid">
                {[
                  'Diabetes', 'Hypertension', 'Heart Disease', 'High Cholesterol',
                  'Thyroid Issues', 'PCOS', 'Kidney Disease', 'Liver Disease',
                  'Arthritis', 'Osteoporosis', 'Anemia', 'Digestive Issues'
                ].map(condition => (
                  <label key={condition} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.medicalConditions.includes(condition)}
                      onChange={() => toggleArrayItem('medicalConditions', condition)}
                    />
                    <span>{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Known Vitamin Deficiencies</label>
              <div className="checkbox-grid">
                {[
                  'Vitamin D', 'Vitamin B12', 'Iron', 'Vitamin C',
                  'Folate', 'Calcium', 'Magnesium', 'Zinc',
                  'Vitamin A', 'Vitamin E'
                ].map(vitamin => (
                  <label key={vitamin} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.vitaminDeficiencies.includes(vitamin)}
                      onChange={() => toggleArrayItem('vitaminDeficiencies', vitamin)}
                    />
                    <span>{vitamin}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="step-header">
              <Utensils className="step-icon" />
              <h2>Food Preferences</h2>
            </div>

            <div className="form-group">
              <label>Preferred Cuisines</label>
              <div className="checkbox-grid">
                {[
                  'Indian', 'Mediterranean', 'Asian', 'Mexican',
                  'Italian', 'American', 'Middle Eastern', 'Japanese',
                  'Thai', 'Greek', 'French', 'Chinese'
                ].map(cuisine => (
                  <label key={cuisine} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.preferredCuisines.includes(cuisine)}
                      onChange={() => toggleArrayItem('preferredCuisines', cuisine)}
                    />
                    <span>{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preferred Meals per Day</label>
                <input
                  type="number"
                  min="2"
                  max="6"
                  value={formData.mealsPerDay}
                  onChange={(e) => updateFormData('mealsPerDay', parseInt(e.target.value) || 3)}
                />
              </div>

              <div className="form-group">
                <label>Daily Water Intake (glasses)</label>
                <input
                  type="number"
                  min="4"
                  max="15"
                  value={formData.waterIntake}
                  onChange={(e) => updateFormData('waterIntake', parseInt(e.target.value) || 8)}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <div className="step-header">
              <Heart className="step-icon" />
              <h2>Allergies & Restrictions</h2>
            </div>

            <div className="form-group">
              <label>Food Allergies (Select all that apply)</label>
              <div className="checkbox-grid">
                {[
                  'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs',
                  'Fish', 'Shellfish', 'Soy', 'Wheat/Gluten',
                  'Sesame', 'Corn', 'Sulfites', 'Mustard'
                ].map(allergy => (
                  <label key={allergy} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.allergies.includes(allergy)}
                      onChange={() => toggleArrayItem('allergies', allergy)}
                    />
                    <span>{allergy}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Dietary Restrictions & Preferences</label>
              <div className="checkbox-grid">
                {[
                  'Vegetarian', 'Vegan', 'Keto', 'Paleo',
                  'Low Carb', 'Low Fat', 'Low Sodium', 'Diabetic',
                  'Halal', 'Kosher', 'Raw Food', 'Intermittent Fasting',
                  'Mediterranean', 'DASH Diet', 'Whole30', 'Carnivore'
                ].map(restriction => (
                  <label key={restriction} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.dietaryRestrictions.includes(restriction)}
                      onChange={() => toggleArrayItem('dietaryRestrictions', restriction)}
                    />
                    <span>{restriction}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-content">
            <div className="step-header">
              <CheckCircle className="step-icon" />
              <h2>Review & Submit</h2>
            </div>

            <div className="profile-summary">
              <h3>Profile Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Name:</span>
                  <span className="value">{formData.fullName}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Age:</span>
                  <span className="value">{formData.age} years</span>
                </div>
                <div className="summary-item">
                  <span className="label">Height:</span>
                  <span className="value">{formData.height} cm</span>
                </div>
                <div className="summary-item">
                  <span className="label">Weight:</span>
                  <span className="value">{formData.weight} kg</span>
                </div>
                <div className="summary-item">
                  <span className="label">Gender:</span>
                  <span className="value">{formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Activity Level:</span>
                  <span className="value">{formData.activityLevel.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Goal:</span>
                  <span className="value">{formData.goal.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Meals per Day:</span>
                  <span className="value">{formData.mealsPerDay}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Water Intake:</span>
                  <span className="value">{formData.waterIntake} glasses/day</span>
                </div>
                {formData.preferredCuisines.length > 0 && (
                  <div className="summary-item full-width">
                    <span className="label">Preferred Cuisines:</span>
                    <span className="value">{formData.preferredCuisines.join(', ')}</span>
                  </div>
                )}
                {formData.allergies.length > 0 && (
                  <div className="summary-item full-width">
                    <span className="label">Allergies:</span>
                    <span className="value">{formData.allergies.join(', ')}</span>
                  </div>
                )}
                {formData.dietaryRestrictions.length > 0 && (
                  <div className="summary-item full-width">
                    <span className="label">Dietary Restrictions:</span>
                    <span className="value">{formData.dietaryRestrictions.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="ai-notice">
              <div className="ai-icon">🤖</div>
              <p>Our AI will analyze your profile and create a comprehensive diet plan tailored to your specific needs.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDietPlan = () => {
    if (!dietPlan) return null;

    const formatFoodList = (foods: any[]) => {
      return foods.map(food => food.name).join(', ');
    };

    return (
      <div className="diet-plan-result">
        <div className="diet-plan-content">
          <div className="diet-plan-header">
            <div className="success-animation">
              <CheckCircle className="success-icon" />
            </div>
            <h1>Your Personalized Diet Plan</h1>
            <p>Hello {dietPlan.profile.fullName}! Here's your customized nutrition plan.</p>
          </div>

          <div className="plan-overview">
            <div className="overview-card">
              <h3>Daily Calorie Target</h3>
              <div className="calorie-number">{dietPlan.nutritionalNeeds.calories}</div>
              <p>calories per day</p>
            </div>
            <div className="overview-card">
              <h3>Macronutrient Breakdown</h3>
              <div className="macro-breakdown">
                <div className="macro-item">
                  <span className="macro-label">Protein</span>
                  <span className="macro-value">{Math.round((dietPlan.nutritionalNeeds.protein * 4 / dietPlan.nutritionalNeeds.calories) * 100)}%</span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Carbs</span>
                  <span className="macro-value">{Math.round((dietPlan.nutritionalNeeds.carbs * 4 / dietPlan.nutritionalNeeds.calories) * 100)}%</span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Fats</span>
                  <span className="macro-value">{Math.round((dietPlan.nutritionalNeeds.fat * 9 / dietPlan.nutritionalNeeds.calories) * 100)}%</span>
                </div>
              </div>
              <div className="macro-grams">
                <div>Protein: {dietPlan.nutritionalNeeds.protein}g</div>
                <div>Carbs: {dietPlan.nutritionalNeeds.carbs}g</div>
                <div>Fats: {dietPlan.nutritionalNeeds.fat}g</div>
              </div>
            </div>
          </div>

          <div className="meal-plan-section">
            <h2>7-Day Meal Plan</h2>
            <div className="meal-plan-grid">
              {Object.entries(dietPlan.weeklyMealPlan).map(([day, meals]) => (
                <div key={day} className="day-card">
                  <h3>{day}</h3>
                  <div className="meals">
                    <div className="meal">
                      <strong>Breakfast:</strong> {formatFoodList(meals.breakfast)}
                    </div>
                    <div className="meal">
                      <strong>Lunch:</strong> {formatFoodList(meals.lunch)}
                    </div>
                    <div className="meal">
                      <strong>Dinner:</strong> {formatFoodList(meals.dinner)}
                    </div>
                    <div className="meal">
                      <strong>Snack:</strong> {formatFoodList(meals.snacks)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="recommended-foods">
            <h2>Recommended Foods</h2>
            <div className="food-grid">
              {dietPlan.recommendedFoods.map((food: any) => (
                <div key={food.name} className="food-card">
                  <h4>{food.name}</h4>
                  <p>{food.benefits.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tips-section">
            <h2>Personalized Tips</h2>
            <div className="tips-grid">
              {dietPlan.tips.map((tip, index) => (
                <div key={index} className="tip-card">
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {dietPlan.supplementsNeeded.length > 0 && (
            <div className="supplements-section">
              <h2>Recommended Supplements</h2>
              <ul>
                {dietPlan.supplementsNeeded.map((supplement, index) => (
                  <li key={index}>{supplement}</li>
                ))}
              </ul>
            </div>
          )}

          {dietPlan.warnings.length > 0 && (
            <div className="warnings-section">
              <h2>Important Warnings</h2>
              <ul>
                {dietPlan.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="action-buttons">
            <button className="action-btn primary">
              <Download size={20} />
              Download PDF
            </button>
            <button className="action-btn secondary">
              <Share2 size={20} />
              Share Plan
            </button>
            <button className="action-btn tertiary" onClick={resetForm}>
              <RotateCcw size={20} />
              Create New Plan
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (showDietPlan) {
    return renderDietPlan();
  }

  return (
    <div className="diet-plan-container">
      <div className="form-wrapper">
        <div className="progress-header">
          <div className="progress-info">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{getProgressPercentage()}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        <div className="main-content">
          {renderStep()}
        </div>

        <div className="navigation-buttons">
          <button 
            className="nav-button secondary" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft size={20} />
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button 
              className={`nav-button primary ${!isStepValid(currentStep) ? 'disabled' : ''}`}
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
            >
              Next
              <ArrowRight size={20} />
            </button>
          ) : (
            <button 
              className="nav-button primary generate-btn"
              onClick={generateDietPlan}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Diet Plan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlanDisplay;