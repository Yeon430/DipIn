import Link from 'next/link'
import Header from '@/components/Header'
import MissionCard from '@/components/MissionCard'
import { Star, Clock, Users, TrendingUp, Award, ChevronRight, Zap } from 'lucide-react'

// Sample mission data for marketplace (100% Instant)
const featuredProjects = [
  {
    id: 'react-todo-app',
    title: 'Build a React Todo App with State Management',
    description: 'Build a complete Todo web app with React hooks and state management patterns. Check accessibility and performance basics.',
    category: 'frontend',
    difficulty: 'E' as const,
    duration: 15,
    rating: 4.8,
    reviewCount: 127,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE' as const,
    price: 0,
    creator: { name: 'Alex Chen', avatar: '👨‍💻', rating: 4.9 },
    completionRate: 94,
    medianTime: 12
  },
  {
    id: 'restful-api-auth',
    title: 'Design RESTful API with Authentication',
    description: 'Design and implement an order API with JWT-based authentication and error contracts. Covers rate limiting and logging.',
    category: 'backend',
    difficulty: 'M' as const,
    duration: 25,
    rating: 4.7,
    reviewCount: 89,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE' as const,
    price: 29,
    creator: { name: 'Sarah Kim', avatar: '👩‍💻', rating: 4.8 },
    completionRate: 87,
    medianTime: 22
  },
  {
    id: 'flutter-mobile-app',
    title: 'Build Cross-Platform Mobile App with Flutter',
    description: 'Create a responsive mobile app with Flutter, implementing state management and API integration for both iOS and Android platforms.',
    category: 'mobile',
    difficulty: 'M' as const,
    duration: 30,
    rating: 4.5,
    reviewCount: 156,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE' as const,
    price: 39,
    creator: { name: 'Mike Johnson', avatar: '👨‍💻', rating: 4.6 },
    completionRate: 85,
    medianTime: 28
  },
  {
    id: 'sql-sales-analysis',
    title: 'Analyze Sales Data with SQL Queries',
    description: 'Perform daily, weekly, and monthly sales summaries and anomaly detection from transaction tables using SQL.',
    category: 'data-analytics',
    difficulty: 'M' as const,
    duration: 20,
    rating: 4.6,
    reviewCount: 203,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'NUMERIC' as const,
    price: 0,
    creator: { name: 'David Park', avatar: '👨‍🔬', rating: 4.7 },
    completionRate: 91,
    medianTime: 18
  },
  {
    id: 'sentiment-analysis-ml',
    title: 'Train Sentiment Analysis Model',
    description: 'Train a text sentiment classification model and improve it with F1 ≥ 0.78 as the target. Document with model cards.',
    category: 'ml-ai',
    difficulty: 'H' as const,
    duration: 45,
    rating: 4.9,
    reviewCount: 89,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE' as const,
    price: 49,
    creator: { name: 'Dr. Lisa Wang', avatar: '👩‍💻', rating: 4.9 },
    completionRate: 78,
    medianTime: 42
  },
  {
    id: 'docker-kubernetes-devops',
    title: 'Containerize Application with Docker & Kubernetes',
    description: 'Learn containerization and orchestration by deploying a microservices architecture with Docker and Kubernetes.',
    category: 'devops',
    difficulty: 'H' as const,
    duration: 40,
    rating: 4.7,
    reviewCount: 124,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE' as const,
    price: 59,
    creator: { name: 'Emma Wilson', avatar: '👩‍💻', rating: 4.8 },
    completionRate: 82,
    medianTime: 38
  }
]

const categories = [
  { slug: 'frontend', name: 'Frontend', icon: '🎨', description: 'UI/UX, React, Vue, Angular' },
  { slug: 'backend', name: 'Backend', icon: '⚙️', description: 'APIs, Databases, Architecture' },
  { slug: 'data-analytics', name: 'Data Analytics', icon: '📊', description: 'SQL, Python, Visualization' },
  { slug: 'ml-ai', name: 'ML/AI', icon: '🤖', description: 'Models, Training, Deployment' },
  { slug: 'mobile', name: 'Mobile', icon: '📱', description: 'iOS, Android, Cross-platform' },
  { slug: 'devops', name: 'DevOps', icon: '🔧', description: 'CI/CD, Cloud, Infrastructure' },
  { slug: 'security', name: 'Security', icon: '🔒', description: 'Auth, Encryption, Vulnerabilities' },
  { slug: 'sandbox', name: 'Sandbox', icon: '🧪', description: 'Experimental, Research, Innovation' }
]

const collections = [
  { name: 'New & Rising', icon: TrendingUp, count: 24 },
  { name: '≤20 min', icon: Clock, count: 156 },
  { name: 'Top completion rate', icon: Award, count: 89 },
  { name: 'Free projects', icon: Zap, count: 42 }
]

const topCreators = [
  { name: 'Alex Chen', avatar: '👨‍💻', rating: 4.9, completionRate: 96, responseTime: '2h', projects: 23, slug: 'alex-chen' },
  { name: 'Sarah Kim', avatar: '👩‍💻', rating: 4.8, completionRate: 94, responseTime: '1h', projects: 18, slug: 'sarah-kim' },
  { name: 'David Park', avatar: '👨‍🔬', rating: 4.9, completionRate: 98, responseTime: '3h', projects: 31, slug: 'david-park' },
  { name: 'Dr. Maria Garcia', avatar: '👩‍🔬', rating: 4.9, completionRate: 89, responseTime: '4h', projects: 15, slug: 'maria-garcia' }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Explore CS Fields Through
                <span className="text-blue-400 block">Hands-On Experience</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
                Dive into real projects and discover what excites you. Experience different CS domains and find your passion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/projects"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors text-center inline-flex items-center justify-center gap-2"
                >
                  Browse Projects
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/demo"
                  className="border border-slate-300 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-800 transition-colors text-center"
                >
                  Try 3-min Demo
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-2">
                <div className="bg-slate-100 rounded-xl h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-slate-600 text-lg font-medium">Start Instantly</p>
                    <p className="text-slate-500 text-sm">No waiting, no schedules</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose your specialization and dive into hands-on projects
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-200 p-6 text-center group"
              >
                <div className="text-4xl mb-4">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Rails */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Popular Collections
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collections.map((collection, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <collection.icon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">{collection.name}</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900">{collection.count}</p>
                <p className="text-sm text-slate-600">projects</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Featured Projects
            </h2>
            <Link href="/projects" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Creators */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Top Creators
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {topCreators.map((creator, index) => (
              <Link key={index} href={`/creators/${creator.slug}`} 
                    className="block bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                    {creator.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{creator.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-slate-600">{creator.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Completion</span>
                    <span className="font-semibold">{creator.completionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Response</span>
                    <span className="font-semibold">{creator.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Projects</span>
                    <span className="font-semibold">{creator.projects}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to explore and discover CS fields that interest you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Explore Your Interest</h3>
              <p className="text-slate-600 leading-relaxed">
                Browse through diverse CS fields and find what sparks your curiosity. Start exploring immediately.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Experience & Discover</h3>
              <p className="text-slate-600 leading-relaxed">
                Dive into hands-on projects and experience different CS domains. Discover what you truly enjoy.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Reflect & Grow</h3>
              <p className="text-slate-600 leading-relaxed">
                Get insights about your interests and strengths. Understand what areas excite you most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Explore CS Fields?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are discovering their passion through hands-on project experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              Start Exploring
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/studio"
              className="border border-slate-300 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              Create Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}