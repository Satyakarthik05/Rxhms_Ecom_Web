import { Question } from '../types/Question';

export const initialPharmacyQuestions: Question[] = [
  {
    id: 'root-1',
    text: '🩺 Medical Consultation & Doctor Services',
    parentId: null,
    level: 0,
    isRoot: true,
    children: [
      {
        id: 'consult-1',
        text: 'Book Online Consultation',
        parentId: 'root-1',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'online-1',
            text: 'General Physician Consultation',
            parentId: 'consult-1',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'gp-1',
                text: 'Immediate Consultation (Within 15 mins)',
                parentId: 'online-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'gp-2',
                text: 'Schedule for Later Today',
                parentId: 'online-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'gp-3',
                text: 'Book for Tomorrow',
                parentId: 'online-1',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          },
          {
            id: 'online-2',
            text: 'Specialist Consultation',
            parentId: 'consult-1',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'spec-1',
                text: 'Cardiologist',
                parentId: 'online-2',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'spec-2',
                text: 'Dermatologist',
                parentId: 'online-2',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'spec-3',
                text: 'Pediatrician',
                parentId: 'online-2',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'spec-4',
                text: 'Gynecologist',
                parentId: 'online-2',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          },
          {
            id: 'online-3',
            text: 'Mental Health Consultation',
            parentId: 'consult-1',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'mental-1',
                text: 'Psychiatrist',
                parentId: 'online-3',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'mental-2',
                text: 'Psychologist/Counselor',
                parentId: 'online-3',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 'consult-2',
        text: 'Emergency Medical Help',
        parentId: 'root-1',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'emergency-1',
            text: 'Connect to Emergency Doctor Now',
            parentId: 'consult-2',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'emergency-2',
            text: 'Find Nearest Hospital',
            parentId: 'consult-2',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'emergency-3',
            text: 'Ambulance Service',
            parentId: 'consult-2',
            level: 2,
            isRoot: false,
            children: []
          }
        ]
      },
      {
        id: 'consult-3',
        text: 'Health Checkup Packages',
        parentId: 'root-1',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'checkup-1',
            text: 'Basic Health Checkup',
            parentId: 'consult-3',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'checkup-2',
            text: 'Comprehensive Health Checkup',
            parentId: 'consult-3',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'checkup-3',
            text: 'Senior Citizen Health Package',
            parentId: 'consult-3',
            level: 2,
            isRoot: false,
            children: []
          }
        ]
      }
    ]
  },
  {
    id: 'root-2',
    text: '💊 Medicine Orders & Pharmacy',
    parentId: null,
    level: 0,
    isRoot: true,
    children: [
      {
        id: 'medicine-1',
        text: 'Order Prescription Medicines',
        parentId: 'root-2',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'prescription-1',
            text: 'Upload Prescription & Order',
            parentId: 'medicine-1',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'upload-1',
                text: 'Express Delivery (2-4 hours)',
                parentId: 'prescription-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'upload-2',
                text: 'Standard Delivery (Next Day)',
                parentId: 'prescription-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'upload-3',
                text: 'Schedule Delivery',
                parentId: 'prescription-1',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          },
          {
            id: 'prescription-2',
            text: 'Refill Previous Order',
            parentId: 'medicine-1',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'refill-1',
                text: 'View Order History',
                parentId: 'prescription-2',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'refill-2',
                text: 'Auto-Refill Subscription',
                parentId: 'prescription-2',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          },
          {
            id: 'prescription-3',
            text: 'Search Medicine by Name',
            parentId: 'medicine-1',
            level: 2,
            isRoot: false,
            children: []
          }
        ]
      },
      {
        id: 'medicine-2',
        text: 'Over-the-Counter (OTC) Products',
        parentId: 'root-2',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'otc-1',
            text: 'Cold & Flu Medicines',
            parentId: 'medicine-2',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'cold-1',
                text: 'Cough Syrups',
                parentId: 'otc-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'cold-2',
                text: 'Fever Reducers',
                parentId: 'otc-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'cold-3',
                text: 'Throat Lozenges',
                parentId: 'otc-1',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          },
          {
            id: 'otc-2',
            text: 'Pain Relief & Anti-inflammatory',
            parentId: 'medicine-2',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'pain-1',
                text: 'Headache Relief',
                parentId: 'otc-2',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'pain-2',
                text: 'Muscle Pain Relief',
                parentId: 'otc-2',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'pain-3',
                text: 'Joint Pain Relief',
                parentId: 'otc-2',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          },
          {
            id: 'otc-3',
            text: 'Digestive Health',
            parentId: 'medicine-2',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'digest-1',
                text: 'Antacids',
                parentId: 'otc-3',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'digest-2',
                text: 'Probiotics',
                parentId: 'otc-3',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'digest-3',
                text: 'Anti-diarrheal',
                parentId: 'otc-3',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 'medicine-3',
        text: 'Health Supplements & Vitamins',
        parentId: 'root-2',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'supplement-1',
            text: 'Daily Vitamins',
            parentId: 'medicine-3',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'vitamin-1',
                text: 'Multivitamins',
                parentId: 'supplement-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'vitamin-2',
                text: 'Vitamin D3',
                parentId: 'supplement-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'vitamin-3',
                text: 'Vitamin B Complex',
                parentId: 'supplement-1',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          },
          {
            id: 'supplement-2',
            text: 'Immunity Boosters',
            parentId: 'medicine-3',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'supplement-3',
            text: 'Protein Supplements',
            parentId: 'medicine-3',
            level: 2,
            isRoot: false,
            children: []
          }
        ]
      }
    ]
  },
  {
    id: 'root-3',
    text: '🏥 Health Services & Lab Tests',
    parentId: null,
    level: 0,
    isRoot: true,
    children: [
      {
        id: 'lab-1',
        text: 'Book Lab Tests',
        parentId: 'root-3',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'test-1',
            text: 'Blood Tests',
            parentId: 'lab-1',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'blood-1',
                text: 'Complete Blood Count (CBC)',
                parentId: 'test-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'blood-2',
                text: 'Blood Sugar Tests',
                parentId: 'test-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'blood-3',
                text: 'Lipid Profile',
                parentId: 'test-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'blood-4',
                text: 'Thyroid Function Tests',
                parentId: 'test-1',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          },
          {
            id: 'test-2',
            text: 'Imaging Tests',
            parentId: 'lab-1',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'imaging-1',
                text: 'X-Ray',
                parentId: 'test-2',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'imaging-2',
                text: 'Ultrasound',
                parentId: 'test-2',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'imaging-3',
                text: 'CT Scan',
                parentId: 'test-2',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'imaging-4',
                text: 'MRI',
                parentId: 'test-2',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          },
          {
            id: 'test-3',
            text: 'Home Sample Collection',
            parentId: 'lab-1',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'home-1',
                text: 'Same Day Collection',
                parentId: 'test-3',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'home-2',
                text: 'Schedule for Tomorrow',
                parentId: 'test-3',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 'lab-2',
        text: 'Vaccination Services',
        parentId: 'root-3',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'vaccine-1',
            text: 'COVID-19 Vaccination',
            parentId: 'lab-2',
            level: 2,
            isRoot: false,
            children: [
              {
                id: 'covid-1',
                text: 'First Dose',
                parentId: 'vaccine-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'covid-2',
                text: 'Second Dose',
                parentId: 'vaccine-1',
                level: 3,
                isRoot: false,
                children: []
              },
              {
                id: 'covid-3',
                text: 'Booster Dose',
                parentId: 'vaccine-1',
                level: 3,
                isRoot: false,
                children: []
              }
            ]
          },
          {
            id: 'vaccine-2',
            text: 'Flu Vaccination',
            parentId: 'lab-2',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'vaccine-3',
            text: 'Travel Vaccinations',
            parentId: 'lab-2',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'vaccine-4',
            text: 'Child Immunization',
            parentId: 'lab-2',
            level: 2,
            isRoot: false,
            children: []
          }
        ]
      },
      {
        id: 'lab-3',
        text: 'Health Monitoring Services',
        parentId: 'root-3',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'monitor-1',
            text: 'Blood Pressure Monitoring',
            parentId: 'lab-3',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'monitor-2',
            text: 'Diabetes Management',
            parentId: 'lab-3',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'monitor-3',
            text: 'Weight Management Program',
            parentId: 'lab-3',
            level: 2,
            isRoot: false,
            children: []
          }
        ]
      }
    ]
  },
  {
    id: 'root-4',
    text: '📱 Account & Support Services',
    parentId: null,
    level: 0,
    isRoot: true,
    children: [
      {
        id: 'account-1',
        text: 'My Account & Orders',
        parentId: 'root-4',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'myaccount-1',
            text: 'View Order History',
            parentId: 'account-1',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'myaccount-2',
            text: 'Track Current Orders',
            parentId: 'account-1',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'myaccount-3',
            text: 'Manage Prescriptions',
            parentId: 'account-1',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'myaccount-4',
            text: 'Update Profile Information',
            parentId: 'account-1',
            level: 2,
            isRoot: false,
            children: []
          }
        ]
      },
      {
        id: 'account-2',
        text: 'Customer Support',
        parentId: 'root-4',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'support-1',
            text: 'Chat with Support Agent',
            parentId: 'account-2',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'support-2',
            text: 'Report an Issue',
            parentId: 'account-2',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'support-3',
            text: 'Return/Refund Request',
            parentId: 'account-2',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'support-4',
            text: 'FAQ & Help Center',
            parentId: 'account-2',
            level: 2,
            isRoot: false,
            children: []
          }
        ]
      },
      {
        id: 'account-3',
        text: 'Insurance & Payment',
        parentId: 'root-4',
        level: 1,
        isRoot: false,
        children: [
          {
            id: 'insurance-1',
            text: 'Check Insurance Coverage',
            parentId: 'account-3',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'insurance-2',
            text: 'Add Payment Method',
            parentId: 'account-3',
            level: 2,
            isRoot: false,
            children: []
          },
          {
            id: 'insurance-3',
            text: 'View Bills & Receipts',
            parentId: 'account-3',
            level: 2,
            isRoot: false,
            children: []
          }
        ]
      }
    ]
  }
];