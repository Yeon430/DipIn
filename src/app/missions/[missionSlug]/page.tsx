import { notFound } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import PeerBaselineWidget from '@/components/PeerBaselineWidget'
import ReviewsSection from '@/components/ReviewsSection'
import WishlistButton from '@/components/WishlistButton'
import { Star, Clock, DollarSign, Zap, Shield, CheckCircle, Users, ChevronRight, Code, BarChart3, FileText, TestTube, Heart, Play, Database, Brain, TrendingUp, Target, Award, BookOpen, Settings, MessageCircle } from 'lucide-react'

interface Mission {
  id: string
  title: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  evaluationType: 'Code' | 'Numeric' | 'Text' | 'Tests'
  duration: number
  medianTime: number
  completionRate: number
  price: number
  rating: number
  reviewCount: number
  description: string
  thumbnail: string
  creator: {
    name: string
    avatar: string
    company: string
    rating: number
    responseTime: string
    missions: number
  }
  deliverable: {
    title: string
    description: string
    bullets: string[]
    sampleImage?: string
    sampleCode?: string
  }
  itinerary: {
    step: number
    title: string
    description: string
    type: 'CODE' | 'SQL' | 'NUMERIC' | 'SHORT_TEXT' | 'MCQ' | 'CHECKLIST' | 'DECIDE' | 'TESTS'
  }[]
  rubric: {
    criteria: string
    weight: number
    description: string
    tolerance?: string
    keywords?: string[]
    passRate?: number
  }[]
  includes: string[]
  requirements: string[]
  targetAudience: 'Beginner' | 'Intermediate' | 'Advanced'
  outcomes: string[]
  policies: string
  scenes: {
    id: string
    type: 'CODE' | 'SQL' | 'NUMERIC' | 'BRANCH' | 'SHORT_TEXT' | 'MCQ' | 'INFO'
    weight?: number
  }[]
}

const missions: Mission[] = [
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
      missions: 23
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
      missions: 31
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
  },
  {
    id: 'sql-sales-analysis',
    title: 'Analyze Sales Data with SQL Queries',
    category: 'data-analytics',
    difficulty: 'Medium',
    evaluationType: 'Numeric',
    duration: 20,
    medianTime: 18,
    completionRate: 91,
    price: 0,
    rating: 4.6,
    reviewCount: 156,
    description: 'Perform daily, weekly, and monthly sales summaries and anomaly detection from transaction tables using SQL.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center',
    creator: {
      name: 'David Park',
      avatar: '👨‍🔬',
      company: 'DataLab',
      rating: 4.7,
      responseTime: '3h',
      missions: 18
    },
    deliverable: {
      title: 'Monthly revenue/customer count/ARPU report',
      description: 'SQL-based data analysis report',
      bullets: [
        'Monthly revenue/customer count/ARPU report',
        'Weekly anomaly list (Top 3)',
        'Simple one-line insight summary'
      ],
      sampleCode: 'SELECT \n  DATE_TRUNC(\'month\', order_date) as month,\n  SUM(amount) as revenue,\n  COUNT(DISTINCT customer_id) as customers\nFROM orders\nGROUP BY month;'
    },
    itinerary: [
      { step: 1, title: 'Schema Understanding', description: 'Table relationship analysis', type: 'MCQ' },
      { step: 2, title: 'Aggregation Queries', description: 'Monthly revenue/customer count', type: 'SQL' },
      { step: 3, title: 'Derived Metrics', description: 'ARPU/repurchase rate', type: 'SQL' },
      { step: 4, title: 'Anomaly Detection', description: 'z-score method', type: 'NUMERIC' },
      { step: 5, title: 'Report Writing', description: 'Insight sentences', type: 'SHORT_TEXT' },
      { step: 6, title: 'Final Submission', description: 'Result review', type: 'CHECKLIST' }
    ],
    rubric: [
      { criteria: 'Aggregation Accuracy', weight: 40, description: 'Aggregation results match answer snapshot' },
      { criteria: 'Anomaly Detection', weight: 30, description: 'Match 2+ out of 3 anomalies' },
      { criteria: 'Insights', weight: 20, description: 'Summary includes required keywords ("increase/decrease/cause/next")', keywords: ['increase', 'decrease', 'cause', 'next'] },
      { criteria: 'Query Quality', weight: 10, description: 'Efficient and readable SQL' }
    ],
    includes: [
      'SQLite DB',
      'Schema diagram',
      'Sample dataset',
      'Automated result validation'
    ],
    requirements: [
      'SELECT/GROUP BY',
      'Basic statistics concepts',
      'SQLite or PostgreSQL'
    ],
    targetAudience: 'Intermediate',
    outcomes: [
      'KPI aggregation → anomaly detection → story summary chain',
      'Reproducible SQL report writing',
      'Business insight derivation skills'
    ],
    policies: '48-hour refund for content defects (excluding demos)',
    scenes: [
      { id: '1', type: 'MCQ' },
      { id: '2', type: 'SQL' },
      { id: '3', type: 'SQL' },
      { id: '4', type: 'NUMERIC' },
      { id: '5', type: 'SHORT_TEXT' },
      { id: '6', type: 'CHECKLIST' }
    ]
  },
  {
    id: 'sentiment-analysis-ml',
    title: 'Train Sentiment Analysis Model',
    category: 'ml-ai',
    difficulty: 'Hard',
    evaluationType: 'Code',
    duration: 45,
    medianTime: 42,
    completionRate: 78,
    price: 49,
    rating: 4.9,
    reviewCount: 67,
    description: 'Train a text sentiment classification model and improve it with F1 ≥ 0.78 as the target. Document with a model card.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center',
    creator: {
      name: 'Dr. Lisa Wang',
      avatar: '👩‍🔬',
      company: 'AI Research Lab',
      rating: 4.9,
      responseTime: '4h',
      missions: 12
    },
    deliverable: {
      title: 'Preprocessing pipeline + splitting strategy',
      description: 'Complete machine learning pipeline',
      bullets: [
        'Preprocessing pipeline + splitting strategy',
        'Baseline/improved model comparison report',
        '1-page model card'
      ],
      sampleCode: 'from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\n\nvectorizer = TfidfVectorizer(max_features=10000)\nX_train = vectorizer.fit_transform(train_texts)'
    },
    itinerary: [
      { step: 1, title: 'Data Cleaning', description: 'Tokenization/preprocessing', type: 'CODE' },
      { step: 2, title: 'Validation Split', description: 'Leakage prevention strategy selection', type: 'DECIDE' },
      { step: 3, title: 'Baseline Training', description: 'Logistic regression', type: 'CODE' },
      { step: 4, title: 'Improvement Experiments', description: 'TF-IDF/hyperparameters', type: 'CODE' },
      { step: 5, title: 'Performance Report', description: 'F1/confusion matrix', type: 'NUMERIC' },
      { step: 6, title: 'Model Card', description: 'Limitations/ethics/data', type: 'SHORT_TEXT' }
    ],
    rubric: [
      { criteria: 'Validation Split', weight: 30, description: 'Fixed validation split (seed) + leakage check passed' },
      { criteria: 'Performance Target', weight: 40, description: 'Public test set F1 ≥ 0.78', passRate: 78 },
      { criteria: 'Documentation', weight: 20, description: 'Meet 6/7 required model card sections' },
      { criteria: 'Reproducibility', weight: 10, description: 'Reproducible experiment code' }
    ],
    includes: [
      'Training CSV',
      'Starter Notebook',
      'Evaluation script',
      'Model card template'
    ],
    requirements: [
      'Python',
      'scikit-learn',
      'Basic ML',
      'Jupyter Notebook'
    ],
    targetAudience: 'Advanced',
    outcomes: [
      'Reproducible experiments & reports',
      'Performance/ethics balanced documentation',
      'Practical ML pipeline construction'
    ],
    policies: '48-hour refund for content defects (excluding demos)',
    scenes: [
      { id: '1', type: 'CODE' },
      { id: '2', type: 'DECIDE' },
      { id: '3', type: 'CODE' },
      { id: '4', type: 'CODE' },
      { id: '5', type: 'NUMERIC' },
      { id: '6', type: 'SHORT_TEXT' }
    ]
  }
]

interface MissionPageProps {
  params: {
    missionSlug: string
  }
}

export default function MissionPage({ params }: MissionPageProps) {
  const mission = missions.find(m => m.id === params.missionSlug)
  
  if (!mission) {
    notFound()
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: mission.title }
  ]

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
  }

  const evaluationIcons = {
    Code: Code,
    Numeric: BarChart3,
    Text: FileText,
    Tests: TestTube
  }

  const typeIcons = {
    CODE: Code,
    SQL: Database,
    NUMERIC: BarChart3,
    SHORT_TEXT: FileText,
    MCQ: MessageCircle,
    CHECKLIST: CheckCircle,
    DECIDE: Target,
    TESTS: TestTube
  }

  const EvaluationIcon = evaluationIcons[mission.evaluationType]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header (Above the fold) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              {/* Title & Badges */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                  {mission.category}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${difficultyColors[mission.difficulty]}`}>
                  {mission.difficulty}
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {mission.evaluationType}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                {mission.title}
              </h1>
              
              {/* Creator & Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                    {mission.creator.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{mission.creator.name}</div>
                    <div className="text-sm text-slate-600">{mission.creator.company}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{mission.rating}</span>
                  <span className="text-slate-600">({mission.reviewCount})</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-8 text-sm text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>⏱ Estimated {mission.duration}m</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Median {mission.medianTime}m</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{mission.completionRate}% complete</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-slate-900">
                  💵 {mission.price === 0 ? 'Free' : `$${mission.price}`}
                </div>
                <div className="flex gap-3">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Start now
                  </button>
                  <button className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    3-min demo
                  </button>
                  <WishlistButton 
                    missionId={mission.id}
                    userId="user-123" // 실제로는 인증된 사용자 ID를 사용
                    variant="icon-only"
                  />
                </div>
              </div>
            </div>

            {/* What you'll produce */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What you'll produce</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{mission.deliverable.title}</h3>
                  <p className="text-slate-600 mb-4">{mission.deliverable.description}</p>
                </div>
                
                {/* Bullet Points */}
                <ul className="space-y-2">
                  {mission.deliverable.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {mission.deliverable.sampleImage && (
                  <div className="bg-slate-100 rounded-lg p-4">
                    <img 
                      src={mission.deliverable.sampleImage} 
                      alt="Sample output"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
                {mission.deliverable.sampleCode && (
                  <div className="bg-slate-900 rounded-lg p-4">
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{mission.deliverable.sampleCode}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Itinerary (Step-by-step Process)</h2>
              <div className="space-y-4">
                {mission.itinerary.map((step, index) => {
                  const TypeIcon = typeIcons[step.type]
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{step.title}</h3>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {step.type}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Auto-Feedback & Rubric */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Auto-Feedback & Rubric</h2>
              <div className="space-y-4">
                {mission.rubric.map((item, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2">{item.criteria}</h3>
                        <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                        {item.tolerance && (
                          <p className="text-xs text-slate-500">Tolerance: {item.tolerance}</p>
                        )}
                        {item.keywords && (
                          <p className="text-xs text-slate-500">Required keywords: {item.keywords.join(', ')}</p>
                        )}
                        {item.passRate && (
                          <p className="text-xs text-slate-500">Test pass rate: {item.passRate}%</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-slate-900">{item.weight}%</div>
                        <div className="w-24 bg-slate-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${item.weight}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Includes / Requirements */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Includes / Requirements</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Includes (Datasets, Starter Repos, Templates)</h3>
                  <div className="space-y-3">
                    {mission.includes.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Requirements (Prerequisites, Environment)</h3>
                  <ul className="space-y-2">
                    {mission.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-slate-400 mt-1">•</span>
                        <span className="text-slate-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Who is this for & Outcomes */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Who is this for & Outcomes</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Target Audience (Beginner/Intermediate/Advanced)</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      mission.targetAudience === 'Beginner' ? 'bg-green-100 text-green-800' :
                      mission.targetAudience === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {mission.targetAudience}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">What you'll be able to do after completion</h3>
                  <ul className="space-y-2">
                    {mission.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Creator */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Creator</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                  {mission.creator.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{mission.creator.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{mission.creator.rating}</span>
                    </div>
                    <span>{mission.creator.missions} projects created</span>
                    <span>Response time: {mission.creator.responseTime}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Experienced developer with expertise in React, Node.js, and modern web technologies. 
                    Passionate about teaching through hands-on projects.
                  </p>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View other projects
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Peer Baseline */}
            <PeerBaselineWidget 
              mission={{
                id: mission.id,
                title: mission.title,
                difficulty: mission.difficulty === 'E' ? 'EASY' : mission.difficulty === 'M' ? 'MEDIUM' : 'HARD',
                durationMin: mission.duration,
                category: mission.category,
                scenes: mission.scenes
              }}
              mySubmission={{
                score: 87,
                timeMinutes: 12,
                completed: true
              }}
              className="mb-8"
            />

            {/* Reviews & Q&A */}
            <ReviewsSection 
              missionId={mission.id}
              userId="user-123" // 실제로는 인증된 사용자 ID를 사용
              className="mb-8"
            />

            {/* Policies */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Policies</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-900">Satisfaction Guarantee</span>
                </div>
                <p className="text-sm text-yellow-800">
                  {mission.policies}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {mission.price === 0 ? 'Free' : `$${mission.price}`}
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{mission.duration}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{mission.completionRate}% complete</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Start now
                </button>
                <button className="w-full border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  3-min demo
                </button>
                <WishlistButton 
                  missionId={mission.id}
                  userId="user-123" // 실제로는 인증된 사용자 ID를 사용
                  variant="default"
                  className="w-full"
                />
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Demo Data</span>
                </div>
                <p className="text-sm text-blue-800">
                  Demo data badge until real connection. Will be replaced with real-time data when Submissions/Reviews API is connected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}