// Firebase에 프로젝트 데이터를 시드하는 스크립트
const projects = [
  {
    id: 'react-todo-app',
    title: 'Build a React Todo App with State Management',
    category: 'frontend',
    difficulty: 'Easy',
    evaluationType: 'Code',
    duration: 15,
    medianTime: 12,
    completionRate: 94,
    price: 0,
    rating: 4.8,
    reviewCount: 127,
    description: 'Build a complete Todo web app with React hooks and state management patterns. Check accessibility and performance basics.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop&crop=center',
    creator: {
      name: 'Alex Chen',
      avatar: '👨‍💻',
      company: 'TechCorp',
      rating: 4.9,
      responseTime: '2h',
      projects: 23
    },
    deliverable: {
      title: 'Todo app with add/complete/delete functionality (localStorage persistence)',
      description: 'A complete React Todo application with full functionality',
      bullets: [
        'Todo app with add/complete/delete functionality (localStorage persistence)',
        'Keyboard navigation & ARIA labels applied',
        'Empty state/error handling, lightweight bundling'
      ],
      sampleImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&crop=center',
      sampleCode: 'const [todos, setTodos] = useState([]);\nconst [filter, setFilter] = useState(\'all\');'
    },
    itinerary: [
      { step: 1, title: 'Component Structure Design', description: 'Tree/state placement explanation', type: 'SHORT_TEXT' },
      { step: 2, title: 'State Management Implementation', description: 'CRUD with useReducer', type: 'CODE' },
      { step: 3, title: 'Persistence', description: 'localStorage synchronization', type: 'CODE' },
      { step: 4, title: 'Accessibility Enhancement', description: 'ARIA/keyboard', type: 'CHECKLIST' },
      { step: 5, title: 'Performance Micro-optimization', description: 'Reduce unnecessary rerenders', type: 'CODE' },
      { step: 6, title: 'Final Submission', description: 'Screenshot+readme', type: 'SHORT_TEXT' }
    ],
    rubric: [
      { criteria: 'Test Pass Rate', weight: 40, description: 'Pass 8/10 tests (required)', passRate: 80 },
      { criteria: 'Accessibility', weight: 30, description: 'Meet 6+ out of 8 accessibility checklist items' },
      { criteria: 'Performance', weight: 20, description: 'Bundle size < 250KB (excluding dev mode)' },
      { criteria: 'Code Quality', weight: 10, description: 'Clean and readable code structure' }
    ],
    includes: [
      'Starter repo (component skeleton)',
      'Accessibility checklist',
      'Automated code evaluation',
      'Detailed feedback report',
      'Certificate of completion'
    ],
    requirements: [
      'Basic JS/React',
      'Node 18+',
      'Code editor (VS Code recommended)'
    ],
    targetAudience: 'Beginner',
    outcomes: [
      'State/event modeling, practical accessibility checks',
      'Understanding lightweight/rerender causes',
      'Breaking down small features into testable units'
    ],
    policies: '48-hour refund for content defects (excluding demos)',
    scenes: [
      { id: '1', type: 'INFO' },
      { id: '2', type: 'CODE' },
      { id: '3', type: 'CODE' },
      { id: '4', type: 'MCQ' },
      { id: '5', type: 'CODE' }
    ]
  },
  {
    id: 'restful-api-auth',
    title: 'Design RESTful API with Authentication',
    category: 'backend',
    difficulty: 'Medium',
    evaluationType: 'Code',
    duration: 25,
    medianTime: 22,
    completionRate: 87,
    price: 29,
    rating: 4.7,
    reviewCount: 89,
    description: 'Design and implement an order API with JWT-based authentication and error contracts. Covers rate limiting and logging.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&crop=center',
    creator: {
      name: 'Sarah Kim',
      avatar: '👩‍💻',
      company: 'DevStudio',
      rating: 4.8,
      responseTime: '1h',
      projects: 31
    },
    deliverable: {
      title: 'POST /orders, GET /orders/:id spec & implementation',
      description: 'Complete RESTful API with authentication system',
      bullets: [
        'POST /orders, GET /orders/:id spec & implementation',
        'Unified error body (code/message/details)',
        'JWT middleware and rate limiting rules'
      ],
      sampleCode: 'app.post(\'/orders\', authenticateToken, rateLimit, createOrder);\napp.get(\'/orders/:id\', authenticateToken, getOrder);'
    },
    itinerary: [
      { step: 1, title: 'API Contract Writing', description: 'OpenAPI snippets', type: 'SHORT_TEXT' },
      { step: 2, title: 'Authentication/Authorization', description: 'JWT issuance & validation', type: 'CODE' },
      { step: 3, title: 'Error Handling Standardization', description: 'Exception mapping', type: 'CODE' },
      { step: 4, title: 'Rate Limiting Policy', description: 'Strategy selection rationale', type: 'DECIDE' },
      { step: 5, title: 'Observability', description: 'Structured logs, request ID', type: 'CODE' },
      { step: 6, title: 'Contract Validation', description: 'Snapshot/boundary cases', type: 'TESTS' }
    ],
    rubric: [
      { criteria: 'Test Pass Rate', weight: 40, description: 'Pass 8+ out of 10 snapshot tests', passRate: 80 },
      { criteria: 'Authentication', weight: 30, description: '401/error schema match on auth failure' },
      { criteria: 'Rate Limiting', weight: 20, description: '429 ratio < 5% in 5req/sec limit scenario' },
      { criteria: 'Logging', weight: 10, description: 'Structured log format' }
    ],
    includes: [
      'Postman collection',
      'Sample client',
      'Automated API tests',
      'Performance monitoring tools'
    ],
    requirements: [
      'Node/Express or FastAPI',
      'JWT basics',
      'REST API concepts'
    ],
    targetAudience: 'Intermediate',
    outcomes: [
      'Standardized error/log design',
      'Authentication/rate limiting tradeoff decisions',
      'Contract-driven development flow experience'
    ],
    policies: '48-hour refund for content defects (excluding demos)',
    scenes: [
      { id: '1', type: 'INFO' },
      { id: '2', type: 'CODE' },
      { id: '3', type: 'CODE' },
      { id: '4', type: 'DECIDE' },
      { id: '5', type: 'CODE' },
      { id: '6', type: 'TESTS' }
    ]
  }
]

// 프로젝트 데이터를 Firebase에 저장
async function seedProjects() {
  for (const project of projects) {
    try {
      const response = await fetch('http://localhost:3000/api/firebase/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ Project "${project.title}" saved successfully`)
      } else {
        console.error(`❌ Failed to save project "${project.title}":`, data.error)
      }
    } catch (error) {
      console.error(`❌ Error saving project "${project.title}":`, error)
    }
  }
}

// 스크립트 실행
seedProjects()









