const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBvOkBwv1IwBw_1IwBw_1IwBw_1IwBw_1IwBw",
  authDomain: "stem-missions-v2.firebaseapp.com",
  projectId: "stem-missions-v2",
  storageBucket: "stem-missions-v2.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 누락된 프로젝트들
const missingProjects = [
  {
    id: 'sentiment-analysis-ml',
    title: 'Train Sentiment Analysis Model',
    category: 'ml-ai',
    difficulty: 'Hard',
    evaluationType: 'Code',
    duration: 45,
    medianTime: 50,
    completionRate: 0.75,
    price: 0,
    rating: 4.2,
    reviewCount: 15,
    description: 'Build and train a machine learning model to analyze sentiment in text data using Python and scikit-learn.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop&crop=center',
    creator: {
      name: 'Dr. Sarah Chen',
      avatar: '👩‍💼',
      company: 'AI Research Lab',
      rating: 4.8,
      responseTime: '< 2 hours',
      projects: 23
    },
    deliverable: {
      title: 'Trained Sentiment Analysis Model',
      description: 'A working machine learning model that can classify text as positive, negative, or neutral sentiment.',
      bullets: [
        'Preprocessed text data using NLP techniques',
        'Trained multiple ML algorithms (Naive Bayes, SVM, Random Forest)',
        'Achieved >85% accuracy on test dataset',
        'Created prediction pipeline with confidence scores'
      ],
      sampleImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
      sampleCode: 'def predict_sentiment(text):\n    # Your implementation here\n    return prediction'
    },
    itinerary: [
      { step: 1, title: 'Data Collection & Preprocessing', description: 'Gather and clean text data for training', type: 'CODE' },
      { step: 2, title: 'Feature Engineering', description: 'Extract meaningful features from text', type: 'CODE' },
      { step: 3, title: 'Model Training', description: 'Train multiple ML algorithms', type: 'CODE' },
      { step: 4, title: 'Model Evaluation', description: 'Test and compare model performance', type: 'CODE' },
      { step: 5, title: 'Deployment', description: 'Create prediction API', type: 'CODE' }
    ],
    rubric: {
      criteria: [
        { name: 'Data Preprocessing', weight: 20, description: 'Quality of text cleaning and feature extraction' },
        { name: 'Model Selection', weight: 25, description: 'Appropriate algorithm choice and justification' },
        { name: 'Training Process', weight: 25, description: 'Proper training methodology and hyperparameter tuning' },
        { name: 'Evaluation', weight: 20, description: 'Comprehensive model testing and validation' },
        { name: 'Code Quality', weight: 10, description: 'Clean, documented, and maintainable code' }
      ]
    },
    tags: ['machine-learning', 'python', 'nlp', 'sentiment-analysis', 'scikit-learn'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function seedMissingProjects() {
  try {
    console.log('🌱 Starting to seed missing projects...');
    
    for (const project of missingProjects) {
      const projectRef = doc(db, 'projects', project.id);
      await setDoc(projectRef, project);
      console.log(`✅ Added project: ${project.title} (${project.id})`);
    }
    
    console.log('🎉 Successfully seeded all missing projects!');
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
  }
}

// 스크립트 실행
seedMissingProjects();

