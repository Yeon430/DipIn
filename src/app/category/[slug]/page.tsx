import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import MissionCard from '@/components/MissionCard'
import { Filter, Search, Clock, DollarSign, Zap, Star } from 'lucide-react'

interface Category {
  slug: string
  name: string
  icon: string
  description: string
}

interface Mission {
  id: string
  title: string
  category: string
  difficulty: 'E' | 'M' | 'H'
  duration: number
  rating: number
  reviewCount: number
  description: string
  thumbnail?: string
  evaluationType: 'CODE' | 'NUMERIC' | 'TEXT' | 'TESTS'
  price: number
  creator: {
    name: string
    avatar: string
    rating: number
  }
  completionRate: number
  medianTime: number
  type: 'Build' | 'Debug' | 'Design' | 'Decide' | 'Review'
}

const categories: Category[] = [
  { slug: 'frontend', name: 'Frontend', icon: '🎨', description: 'UI/UX, React, Vue, Angular development' },
  { slug: 'backend', name: 'Backend', icon: '⚙️', description: 'APIs, Databases, Architecture design' },
  { slug: 'data-analytics', name: 'Data Analytics', icon: '📊', description: 'SQL, Python, Data visualization' },
  { slug: 'ml-ai', name: 'ML/AI', icon: '🤖', description: 'Machine learning, Deep learning models' },
  { slug: 'mobile', name: 'Mobile', icon: '📱', description: 'iOS, Android, Cross-platform development' },
  { slug: 'devops', name: 'DevOps', icon: '🔧', description: 'CI/CD, Cloud, Infrastructure automation' },
  { slug: 'security', name: 'Security', icon: '🔒', description: 'Authentication, Encryption, Vulnerabilities' },
  { slug: 'sandbox', name: 'Sandbox', icon: '🧪', description: 'Experimental, Research, Innovation' }
]

const missions: Mission[] = [
  {
    id: 'react-todo-app',
    title: 'Build a React Todo App with State Management',
    category: 'Frontend',
    difficulty: 'E',
    duration: 15,
    rating: 4.8,
    reviewCount: 127,
    description: 'Create a fully functional todo application using React hooks and context API',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE',
    price: 0,
    creator: { name: 'Alex Chen', avatar: '👨‍💻', rating: 4.9 },
    completionRate: 94,
    medianTime: 12,
    type: 'Build'
  },
  {
    id: 'vue-dashboard',
    title: 'Design Vue.js Dashboard with Charts',
    category: 'Frontend',
    difficulty: 'M',
    duration: 25,
    rating: 4.6,
    reviewCount: 89,
    description: 'Build a responsive dashboard with Vue 3 Composition API and Chart.js',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE',
    price: 29,
    creator: { name: 'Sarah Kim', avatar: '👩‍💻', rating: 4.8 },
    completionRate: 87,
    medianTime: 22,
    type: 'Design'
  },
  {
    id: 'node-api-server',
    title: 'Build RESTful API with Authentication',
    category: 'Backend',
    difficulty: 'M',
    duration: 30,
    rating: 4.7,
    reviewCount: 156,
    description: 'Create a secure API with Express.js, MongoDB, and JWT authentication',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE',
    price: 39,
    creator: { name: 'David Park', avatar: '👨‍🔬', rating: 4.9 },
    completionRate: 91,
    medianTime: 28,
    type: 'Build'
  },
  {
    id: 'python-data-pipeline',
    title: 'Debug Python ETL Pipeline Performance',
    category: 'Backend',
    difficulty: 'H',
    duration: 35,
    rating: 4.9,
    reviewCount: 73,
    description: 'Optimize and debug a slow-running data pipeline using profiling tools',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'NUMERIC',
    price: 49,
    creator: { name: 'Dr. Maria Garcia', avatar: '👩‍🔬', rating: 4.9 },
    completionRate: 78,
    medianTime: 32,
    type: 'Debug'
  },
  {
    id: 'sql-sales-analysis',
    title: 'Analyze Sales Data with Advanced SQL',
    category: 'Data Analytics',
    difficulty: 'M',
    duration: 20,
    rating: 4.6,
    reviewCount: 89,
    description: 'Extract business insights from sales database using complex SQL queries',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'NUMERIC',
    price: 0,
    creator: { name: 'David Park', avatar: '👨‍🔬', rating: 4.9 },
    completionRate: 91,
    medianTime: 18,
    type: 'Decide'
  },
  {
    id: 'r-statistical-model',
    title: 'Review Statistical Model for Bias',
    category: 'Data Analytics',
    difficulty: 'H',
    duration: 40,
    rating: 4.8,
    reviewCount: 45,
    description: 'Audit a machine learning model for fairness and bias using R',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'TESTS',
    price: 59,
    creator: { name: 'Dr. Maria Garcia', avatar: '👩‍🔬', rating: 4.9 },
    completionRate: 82,
    medianTime: 38,
    type: 'Review'
  }
]

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find(cat => cat.slug === params.slug)
  
  if (!category) {
    notFound()
  }

  const categoryMissions = missions.filter(mission => 
    mission.category === category.name
  )

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: category.name }
  ]

  const missionTypes = ['Build', 'Debug', 'Design', 'Decide', 'Review']
  const difficulties = ['E', 'M', 'H']
  const durations = ['≤15', '≤30', '≤45']
  const evaluationTypes = ['CODE', 'NUMERIC', 'TEXT', 'TESTS']
  const priceRanges = ['Free', '$1-25', '$26-50', '$50+']

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{category.icon}</div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {category.name}
              </h1>
              <p className="text-xl text-slate-600">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="space-y-6">
            {/* Type Toggles */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Mission Type</h3>
              <div className="flex flex-wrap gap-2">
                {missionTypes.map((type) => (
                  <button
                    key={type}
                    className="px-4 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Other Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Difficulty</h3>
                <div className="flex gap-2">
                  {difficulties.map((level) => (
                    <button
                      key={level}
                      className="px-3 py-1 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
                    >
                      {level === 'E' ? 'Easy' : level === 'M' ? 'Medium' : 'Hard'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Duration</h3>
                <div className="flex gap-2">
                  {durations.map((duration) => (
                    <button
                      key={duration}
                      className="px-3 py-1 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
                    >
                      {duration}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Evaluation</h3>
                <div className="flex gap-2">
                  {evaluationTypes.map((type) => (
                    <button
                      key={type}
                      className="px-3 py-1 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Price</h3>
                <div className="flex gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range}
                      className="px-3 py-1 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search missions by title, description, or tags..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700">Sort by:</span>
                <select className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Rating</option>
                  <option>Newest</option>
                  <option>Duration (Shortest)</option>
                  <option>Price (Low to High)</option>
                  <option>Completion Rate</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Zap className="w-4 h-4" />
                <span>All missions start instantly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            Showing {categoryMissions.length} missions in {category.name}
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Filter className="w-4 h-4" />
            <span>Filters applied</span>
          </div>
        </div>

        {/* Mission Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {categoryMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>

        {/* Empty State */}
        {categoryMissions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No missions found
            </h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {categoryMissions.length > 0 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                2
              </button>
              <button className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                3
              </button>
              <button className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}