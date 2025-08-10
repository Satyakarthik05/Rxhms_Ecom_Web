import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfileForm.css';

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  targetWeight?: number;
  gender: string;
  activityLevel: string;
  goal: string;
  mealsPerDay: number;
  waterIntake: number;
  medicalConditions: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  vitaminDeficiencies: string[];
  cuisinePreferences: string[];
  dislikedFoods: string[];
}

interface DietPlan {
  // Define DietPlan interface based on your needs
}

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => Promise<DietPlan>;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    mealsPerDay: 3,
    waterIntake: 8,
    medicalConditions: [],
    allergies: [],
    dietaryRestrictions: [],
    vitaminDeficiencies: [],
    cuisinePreferences: [],
    dislikedFoods: [],
  });

  const totalSteps = 6;
  const navigate = useNavigate();

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleArrayUpdate = (
    field: keyof UserProfile,
    value: string,
    checked: boolean,
  ) => {
    const currentArray = (profile[field] as string[]) || [];
    if (checked) {
      updateProfile({ [field]: [...currentArray, value] });
    } else {
      updateProfile({ [field]: currentArray.filter(item => item !== value) });
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
          // If profile exists, skip to diet plan
          const plan = await onSubmit(JSON.parse(savedProfile) as UserProfile);
          navigate('/diet-plan', { state: { dietPlan: plan } });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, []);

  const handleSubmit = async () => {
    if (profile.name && profile.age && profile.height && profile.weight) {
      try {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        navigate('/loading', { state: { profile: profile as UserProfile } });
        const plan = await onSubmit(profile as UserProfile);
        navigate('/diet-plan', { state: { dietPlan: plan } });
      } catch (error) {
        console.error('Error generating diet plan:', error);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-container">
            <div className="step-header">
              <span className="icon">👤</span>
              <h2 className="step-title">Basic Information</h2>
            </div>

            <div className="input-group">
              <label className="label">Full Name</label>
              <input
                className="input"
                type="text"
                value={profile.name || ''}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="input-group">
              <label className="label">Age</label>
              <input
                className="input"
                type="number"
                value={profile.age?.toString() || ''}
                onChange={(e) =>
                  updateProfile({ age: parseInt(e.target.value) || 0 })
                }
                placeholder="Your age"
              />
            </div>

            <div className="input-group">
              <label className="label">Gender</label>
              <div className="radio-group">
                <button
                  className={`radio-button ${profile.gender === 'male' ? 'radio-button-selected' : ''}`}
                  onClick={() => updateProfile({ gender: 'male' })}
                >
                  <span className={`radio-text ${profile.gender === 'male' ? 'radio-text-selected' : ''}`}>
                    Male
                  </span>
                </button>
                <button
                  className={`radio-button ${profile.gender === 'female' ? 'radio-button-selected' : ''}`}
                  onClick={() => updateProfile({ gender: 'female' })}
                >
                  <span className={`radio-text ${profile.gender === 'female' ? 'radio-text-selected' : ''}`}>
                    Female
                  </span>
                </button>
                <button
                  className={`radio-button ${profile.gender === 'other' ? 'radio-button-selected' : ''}`}
                  onClick={() => updateProfile({ gender: 'other' })}
                >
                  <span className={`radio-text ${profile.gender === 'other' ? 'radio-text-selected' : ''}`}>
                    Other
                  </span>
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="label">Height (cm)</label>
              <input
                className="input"
                type="number"
                value={profile.height?.toString() || ''}
                onChange={(e) =>
                  updateProfile({ height: parseInt(e.target.value) || 0 })
                }
                placeholder="Height in centimeters"
              />
            </div>

            <div className="input-group">
              <label className="label">Current Weight (kg)</label>
              <input
                className="input"
                type="number"
                value={profile.weight?.toString() || ''}
                onChange={(e) =>
                  updateProfile({ weight: parseInt(e.target.value) || 0 })
                }
                placeholder="Current weight in kg"
              />
            </div>

            <div className="input-group">
              <label className="label">Target Weight (kg) - Optional</label>
              <input
                className="input"
                type="number"
                value={profile.targetWeight?.toString() || ''}
                onChange={(e) =>
                  updateProfile({ targetWeight: parseInt(e.target.value) || undefined })
                }
                placeholder="Target weight in kg"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-container">
            <div className="step-header">
              <span className="icon">🏃</span>
              <h2 className="step-title">Activity Level & Goals</h2>
            </div>

            <div className="input-group">
              <label className="label">Activity Level</label>
              {[
                { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
                { value: 'light', label: 'Light Activity', desc: 'Light exercise 1-3 days/week' },
                { value: 'moderate', label: 'Moderate Activity', desc: 'Moderate exercise 3-5 days/week' },
                { value: 'active', label: 'Active', desc: 'Heavy exercise 6-7 days/week' },
                { value: 'very_active', label: 'Very Active', desc: 'Very heavy exercise, physical job' },
              ].map((option) => (
                <button
                  key={option.value}
                  className={`radio-button-large ${profile.activityLevel === option.value ? 'radio-button-selected' : ''}`}
                  onClick={() => updateProfile({ activityLevel: option.value as any })}
                >
                  <div className="radio-content">
                    <span className={`radio-text-large ${profile.activityLevel === option.value ? 'radio-text-selected' : ''}`}>
                      {option.label}
                    </span>
                    <span className={`radio-desc ${profile.activityLevel === option.value ? 'radio-desc-selected' : ''}`}>
                      {option.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="input-group">
              <label className="label">Primary Goal</label>
              {[
                { value: 'lose_weight', label: 'Lose Weight', desc: 'Reduce body weight and fat' },
                { value: 'maintain_weight', label: 'Maintain Weight', desc: 'Keep current weight stable' },
                { value: 'gain_weight', label: 'Gain Weight', desc: 'Increase overall body weight' },
                { value: 'muscle_gain', label: 'Build Muscle', desc: 'Increase muscle mass and strength' },
                { value: 'general_health', label: 'General Health', desc: 'Improve overall wellness' },
              ].map((option) => (
                <button
                  key={option.value}
                  className={`radio-button-large ${profile.goal === option.value ? 'radio-button-selected' : ''}`}
                  onClick={() => updateProfile({ goal: option.value as any })}
                >
                  <div className="radio-content">
                    <span className={`radio-text-large ${profile.goal === option.value ? 'radio-text-selected' : ''}`}>
                      {option.label}
                    </span>
                    <span className={`radio-desc ${profile.goal === option.value ? 'radio-desc-selected' : ''}`}>
                      {option.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-container">
            <div className="step-header">
              <span className="icon">❤️</span>
              <h2 className="step-title">Health Conditions</h2>
            </div>

            <div className="input-group">
              <label className="label">Medical Conditions (Select all that apply)</label>
              <div className="checkbox-container">
                {[
                  'Diabetes', 'Hypertension', 'Heart Disease', 'High Cholesterol',
                  'Thyroid Issues', 'PCOS', 'Kidney Disease', 'Liver Disease',
                  'Arthritis', 'Osteoporosis', 'Anemia', 'Digestive Issues'
                ].map((condition) => (
                  <button
                    key={condition}
                    className={`checkbox-button ${profile.medicalConditions?.includes(condition) ? 'checkbox-button-selected' : ''}`}
                    onClick={() => handleArrayUpdate('medicalConditions', condition, !profile.medicalConditions?.includes(condition))}
                  >
                    <span className={`checkbox-text ${profile.medicalConditions?.includes(condition) ? 'checkbox-text-selected' : ''}`}>
                      {condition}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="label">Known Vitamin Deficiencies</label>
              <div className="checkbox-container">
                {[
                  'Vitamin D', 'Vitamin B12', 'Iron', 'Vitamin C',
                  'Folate', 'Calcium', 'Magnesium', 'Zinc',
                  'Vitamin A', 'Vitamin E', 'Omega-3', 'Potassium'
                ].map((vitamin) => (
                  <button
                    key={vitamin}
                    className={`checkbox-button ${profile.vitaminDeficiencies?.includes(vitamin) ? 'checkbox-button-selected' : ''}`}
                    onClick={() => handleArrayUpdate('vitaminDeficiencies', vitamin, !profile.vitaminDeficiencies?.includes(vitamin))}
                  >
                    <span className={`checkbox-text ${profile.vitaminDeficiencies?.includes(vitamin) ? 'checkbox-text-selected' : ''}`}>
                      {vitamin}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-container">
            <div className="step-header">
              <span className="icon">⚠️</span>
              <h2 className="step-title">Allergies & Restrictions</h2>
            </div>

            <div className="input-group">
              <label className="label">Food Allergies</label>
              <div className="checkbox-container">
                {[
                  'Nuts', 'Dairy', 'Gluten', 'Shellfish',
                  'Eggs', 'Soy', 'Fish', 'Sesame',
                  'Peanuts', 'Tree Nuts', 'Wheat', 'None'
                ].map((allergy) => (
                  <button
                    key={allergy}
                    className={`checkbox-button ${profile.allergies?.includes(allergy) ? 'checkbox-button-selected' : ''}`}
                    onClick={() => handleArrayUpdate('allergies', allergy, !profile.allergies?.includes(allergy))}
                  >
                    <span className={`checkbox-text ${profile.allergies?.includes(allergy) ? 'checkbox-text-selected' : ''}`}>
                      {allergy}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="label">Dietary Restrictions</label>
              <div className="checkbox-container">
                {[
                  'Vegetarian', 'Vegan', 'Keto', 'Paleo',
                  'Mediterranean', 'Low Carb', 'Low Fat', 'Intermittent Fasting',
                  'Halal', 'Kosher', 'Raw Food', 'None'
                ].map((restriction) => (
                  <button
                    key={restriction}
                    className={`checkbox-button ${profile.dietaryRestrictions?.includes(restriction) ? 'checkbox-button-selected' : ''}`}
                    onClick={() => handleArrayUpdate('dietaryRestrictions', restriction, !profile.dietaryRestrictions?.includes(restriction))}
                  >
                    <span className={`checkbox-text ${profile.dietaryRestrictions?.includes(restriction) ? 'checkbox-text-selected' : ''}`}>
                      {restriction}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-container">
            <div className="step-header">
              <span className="icon">🍽️</span>
              <h2 className="step-title">Food Preferences</h2>
            </div>

            <div className="input-group">
              <label className="label">Preferred Cuisines</label>
              <div className="checkbox-container">
                {[
                  'Indian', 'Mediterranean', 'Asian', 'Mexican',
                  'Italian', 'American', 'Middle Eastern', 'Japanese',
                  'Thai', 'Greek', 'French', 'Chinese'
                ].map((cuisine) => (
                  <button
                    key={cuisine}
                    className={`checkbox-button ${profile.cuisinePreferences?.includes(cuisine) ? 'checkbox-button-selected' : ''}`}
                    onClick={() => handleArrayUpdate('cuisinePreferences', cuisine, !profile.cuisinePreferences?.includes(cuisine))}
                  >
                    <span className={`checkbox-text ${profile.cuisinePreferences?.includes(cuisine) ? 'checkbox-text-selected' : ''}`}>
                      {cuisine}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="double-input-group">
              <div className="half-input-group">
                <label className="label">Preferred Meals per Day</label>
                <div className="select-container">
                  <input
                    className="select-input"
                    type="number"
                    value={profile.mealsPerDay?.toString() || '3'}
                    onChange={(e) => updateProfile({ mealsPerDay: parseInt(e.target.value) || 3 })}
                  />
                </div>
              </div>

              <div className="half-input-group">
                <label className="label">Daily Water Intake (glasses)</label>
                <div className="select-container">
                  <input
                    className="select-input"
                    type="number"
                    value={profile.waterIntake?.toString() || '8'}
                    onChange={(e) => updateProfile({ waterIntake: parseInt(e.target.value) || 8 })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-container">
            <div className="step-header">
              <span className="icon">✅</span>
              <h2 className="step-title">Review & Submit</h2>
            </div>

            <div className="review-container">
              <h3 className="review-title">Profile Summary</h3>

              <div className="review-item">
                <span className="review-label">Name:</span>
                <span className="review-value">{profile.name}</span>
              </div>

              <div className="review-item">
                <span className="review-label">Age:</span>
                <span className="review-value">{profile.age} years</span>
              </div>

              <div className="review-item">
                <span className="review-label">Height:</span>
                <span className="review-value">{profile.height} cm</span>
              </div>

              <div className="review-item">
                <span className="review-label">Weight:</span>
                <span className="review-value">{profile.weight} kg</span>
              </div>

              {profile.targetWeight && (
                <div className="review-item">
                  <span className="review-label">Target Weight:</span>
                  <span className="review-value">
                    {profile.targetWeight} kg
                  </span>
                </div>
              )}

              <div className="review-item">
                <span className="review-label">Gender:</span>
                <span className="review-value">{profile.gender}</span>
              </div>

              <div className="review-item">
                <span className="review-label">Activity Level:</span>
                <span className="review-value">
                  {profile.activityLevel?.replace('_', ' ')}
                </span>
              </div>

              <div className="review-item">
                <span className="review-label">Goal:</span>
                <span className="review-value">
                  {profile.goal?.replace('_', ' ')}
                </span>
              </div>

              {profile.medicalConditions &&
                profile.medicalConditions.length > 0 && (
                  <div className="review-item">
                    <span className="review-label">Conditions:</span>
                    <span className="review-value">
                      {profile.medicalConditions.join(', ')}
                    </span>
                  </div>
                )}

              {profile.vitaminDeficiencies &&
                profile.vitaminDeficiencies.length > 0 && (
                  <div className="review-item">
                    <span className="review-label">Vitamin Deficiencies:</span>
                    <span className="review-value">
                      {profile.vitaminDeficiencies.join(', ')}
                    </span>
                  </div>
                )}

              {profile.allergies && profile.allergies.length > 0 && (
                <div className="review-item">
                  <span className="review-label">Allergies:</span>
                  <span className="review-value">
                    {profile.allergies.join(', ')}
                  </span>
                </div>
              )}

              {profile.dietaryRestrictions &&
                profile.dietaryRestrictions.length > 0 && (
                  <div className="review-item">
                    <span className="review-label">Dietary Restrictions:</span>
                    <span className="review-value">
                      {profile.dietaryRestrictions.join(', ')}
                    </span>
                  </div>
                )}

              {profile.cuisinePreferences &&
                profile.cuisinePreferences.length > 0 && (
                  <div className="review-item">
                    <span className="review-label">Preferred Cuisines:</span>
                    <span className="review-value">
                      {profile.cuisinePreferences.join(', ')}
                    </span>
                  </div>
                )}

              <div className="review-item">
                <span className="review-label">Meals per Day:</span>
                <span className="review-value">{profile.mealsPerDay}</span>
              </div>

              <div className="review-item">
                <span className="review-label">Water Intake:</span>
                <span className="review-value">
                  {profile.waterIntake} glasses/day
                </span>
              </div>
            </div>

            <div className="note-box">
              <span className="icon">💡</span>
              <p className="note-text">
                Our AI will analyze your profile and create a comprehensive diet
                plan tailored to your specific needs.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-header">
          <span className="progress-text">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="progress-percent">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="form-container">
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="button-container">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`button button-secondary ${currentStep === 1 ? 'button-disabled' : ''}`}
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={() =>
                setCurrentStep(Math.min(totalSteps, currentStep + 1))
              }
              className="button button-primary"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="button button-submit"
            >
              Generate Diet Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;