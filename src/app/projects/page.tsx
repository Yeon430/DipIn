'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import MissionCard from '@/components/MissionCard'
import { Search, Filter, SortAsc, SortDesc, Grid, List, Star, Clock, Users, Award } from 'lucide-react'

// 프로젝트 타입 정의
interface Project {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'E' | 'M' | 'H'
  duration: number
  rating: number
  reviewCount: number
  thumbnail: string
  evaluationType: 'CODE' | 'NUMERIC' | 'TEXT'
  price: number
  creator: {
    name: string
    avatar: string
    rating: number
  }
  completionRate: number
  medianTime: number
  tags: string[]
  createdAt: string
}

// 샘플 프로젝트 데이터
const sampleProjects: Project[] = [
  {
    id: 'react-todo-app',
    title: 'Build a React Todo App with State Management',
    description: 'Build a complete Todo web app with React hooks and state management patterns. Check accessibility and performance basics.',
    category: 'frontend',
    difficulty: 'E',
    duration: 15,
    rating: 4.8,
    reviewCount: 127,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE',
    price: 0,
    creator: { name: 'Alex Chen', avatar: '👨‍💻', rating: 4.9 },
    completionRate: 94,
    medianTime: 12,
    tags: ['React', 'JavaScript', 'State Management'],
    createdAt: '2024-01-15'
  },
  {
    id: 'restful-api-auth',
    title: 'Design RESTful API with Authentication',
    description: 'Design and implement an order API with JWT-based authentication and error contracts. Covers rate limiting and logging.',
    category: 'backend',
    difficulty: 'M',
    duration: 25,
    rating: 4.7,
    reviewCount: 89,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE',
    price: 29,
    creator: { name: 'Sarah Kim', avatar: '👩‍💻', rating: 4.8 },
    completionRate: 87,
    medianTime: 22,
    tags: ['API', 'Authentication', 'Node.js'],
    createdAt: '2024-01-10'
  },
  {
    id: 'sql-sales-analysis',
    title: 'Analyze Sales Data with SQL Queries',
    description: 'Perform daily, weekly, and monthly sales summaries and anomaly detection from transaction tables using SQL.',
    category: 'data-analytics',
    difficulty: 'M',
    duration: 20,
    rating: 4.6,
    reviewCount: 156,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'NUMERIC',
    price: 0,
    creator: { name: 'David Park', avatar: '👨‍🔬', rating: 4.7 },
    completionRate: 91,
    medianTime: 18,
    tags: ['SQL', 'Data Analysis', 'PostgreSQL'],
    createdAt: '2024-01-08'
  },
  {
    id: 'sentiment-analysis-ml',
    title: 'Train Sentiment Analysis Model',
    description: 'Train a text sentiment classification model and improve it with F1 ≥ 0.78 as the target. Document with a model card.',
    category: 'ml-ai',
    difficulty: 'H',
    duration: 45,
    rating: 4.9,
    reviewCount: 67,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE',
    price: 49,
    creator: { name: 'Dr. Lisa Wang', avatar: '👩‍🔬', rating: 4.9 },
    completionRate: 78,
    medianTime: 42,
    tags: ['Machine Learning', 'Python', 'NLP'],
    createdAt: '2024-01-05'
  },
  {
    id: 'mobile-app-flutter',
    title: 'Build Cross-Platform Mobile App with Flutter',
    description: 'Create a responsive mobile app with Flutter, implementing state management and API integration.',
    category: 'mobile',
    difficulty: 'M',
    duration: 30,
    rating: 4.5,
    reviewCount: 98,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE',
    price: 39,
    creator: { name: 'Mike Johnson', avatar: '👨‍💻', rating: 4.6 },
    completionRate: 85,
    medianTime: 28,
    tags: ['Flutter', 'Dart', 'Mobile Development'],
    createdAt: '2024-01-12'
  },
  {
    id: 'docker-kubernetes-setup',
    title: 'Containerize Application with Docker & Kubernetes',
    description: 'Learn containerization and orchestration by deploying a microservices architecture using Docker and Kubernetes.',
    category: 'devops',
    difficulty: 'H',
    duration: 35,
    rating: 4.7,
    reviewCount: 73,
    thumbnail: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&h=267&fit=crop&crop=center',
    evaluationType: 'CODE',
    price: 59,
    creator: { name: 'Emma Wilson', avatar: '👩‍💻', rating: 4.8 },
    completionRate: 82,
    medianTime: 32,
    tags: ['Docker', 'Kubernetes', 'DevOps'],
    createdAt: '2024-01-03'
  }
]

const categories = [
  { slug: 'all', name: 'All Categories', count: sampleProjects.length },
  { slug: 'frontend', name: 'Frontend', count: sampleProjects.filter(p => p.category === 'frontend').length },
  { slug: 'backend', name: 'Backend', count: sampleProjects.filter(p => p.category === 'backend').length },
  { slug: 'data-analytics', name: 'Data Analytics', count: sampleProjects.filter(p => p.category === 'data-analytics').length },
  { slug: 'ml-ai', name: 'ML/AI', count: sampleProjects.filter(p => p.category === 'ml-ai').length },
  { slug: 'mobile', name: 'Mobile', count: sampleProjects.filter(p => p.category === 'mobile').length },
  { slug: 'devops', name: 'DevOps', count: sampleProjects.filter(p => p.category === 'devops').length }
]

const sortOptions = [
  { value: 'newest', label: 'Newest First', icon: SortDesc },
  { value: 'oldest', label: 'Oldest First', icon: SortAsc },
  { value: 'rating', label: 'Highest Rated', icon: Star },
  { value: 'duration', label: 'Shortest Duration', icon: Clock },
  { value: 'completion', label: 'Highest Completion Rate', icon: Award },
  { value: 'price-low', label: 'Price: Low to High', icon: SortAsc },
  { value: 'price-high', label: 'Price: High to Low', icon: SortDesc }
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(sampleProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // 검색 및 필터링 로직
  useEffect(() => {
    let filtered = [...projects]

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    // 검색 쿼리 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query)) ||
        project.creator.name.toLowerCase().includes(query)
      )
    }

    // 정렬
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration)
        break
      case 'completion':
        filtered.sort((a, b) => b.completionRate - a.completionRate)
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
    }

    setFilteredProjects(filtered)
  }, [projects, searchQuery, selectedCategory, sortBy])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'E': return 'text-green-600 bg-green-100'
      case 'M': return 'text-yellow-600 bg-yellow-100'
      case 'H': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'E': return 'Easy'
      case 'M': return 'Medium'
      case 'H': return 'Hard'
      default: return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Browse Projects</h1>
          <p className="text-lg text-slate-600">
            Discover and explore {sampleProjects.length} hands-on projects across different categories
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects, tags, or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-slate-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-slate-600">
            Showing {filteredProjects.length} of {sampleProjects.length} projects
            {searchQuery && (
              <span className="ml-2">
                for "<span className="font-semibold text-slate-900">{searchQuery}</span>"
              </span>
            )}
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {filteredProjects.map((project) => (
              <div key={project.id} className={viewMode === 'list' ? 'bg-white rounded-xl shadow-sm border border-slate-200 p-6' : ''}>
                {viewMode === 'grid' ? (
                  <MissionCard mission={project} />
                ) : (
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 truncate">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                            {getDifficultyLabel(project.difficulty)}
                          </span>
                          <span className="text-lg font-bold text-slate-900">
                            {project.price === 0 ? 'Free' : `$${project.price}`}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{project.rating}</span>
                          <span>({project.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{project.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.completionRate}% completion</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm">
                            {project.creator.avatar}
                          </div>
                          <span className="text-sm text-slate-600">{project.creator.name}</span>
                        </div>
                        <Link
                          href={`/project/${project.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-600 mb-4">
              {searchQuery 
                ? `No projects match your search for "${searchQuery}"`
                : 'No projects available in this category'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}





