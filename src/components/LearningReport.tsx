'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface LearningReportData {
  mode: 'real' | 'pooled' | 'design'
  windowDays: number
  sampleN?: number
  summary: {
    totalProjects: number
    completedProjects: number
    learningStreak: number
    favoriteCategory: string
  }
  interestAnalysis: {
    categories: Array<{
      name: string
      interestLevel: number // 0-100
      enjoymentScore: number // 0-100
      timeSpent: number // minutes
      projectsCompleted: number
      trend: 'increasing' | 'stable' | 'decreasing'
    }>
    topInterests: string[]
    emergingInterests: string[]
  }
  aptitudeInsights: {
    strengths: Array<{
      skill: string
      level: 'beginner' | 'intermediate' | 'advanced'
      confidence: number
      enjoyment: number
    }>
    growthAreas: Array<{
      skill: string
      potential: number
      suggestedProjects: string[]
    }>
    learningStyle: {
      preferredPace: 'slow' | 'moderate' | 'fast'
      preferredComplexity: 'simple' | 'moderate' | 'complex'
      preferredFormat: 'tutorial' | 'hands-on' | 'challenge'
    }
  }
  projectExperience: Array<{
    projectId: string
    title: string
    category: string
    enjoyment: number // 1-5 stars
    difficulty: number // 1-5 stars
    timeSpent: number // minutes
    completed: boolean
    learnedSkills: string[]
    feedback: string
  }>
  recommendations: {
    nextProjects: Array<{
      title: string
      href: string
      reason: string
      matchScore: number
    }>
    skillDevelopment: Array<{
      skill: string
      suggestedProjects: string[]
      estimatedTime: string
    }>
  }
}

interface LearningReportProps {
  userId: string
  projectId?: string
}

export default function LearningReport({ userId, projectId }: LearningReportProps) {
  const [data, setData] = useState<LearningReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchLearningReport()
  }, [userId, projectId])

  const fetchLearningReport = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ userId })
      if (projectId) params.append('projectId', projectId)
      
      const response = await fetch(`/api/report/learning?${params}`)
      if (!response.ok) throw new Error('Failed to fetch learning report')
      
      const reportData = await response.json()
      setData(reportData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleRecommendationClick = (href: string) => {
    router.push(href)
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="text-gray-500 mb-4">Failed to load learning report</div>
        <button 
          onClick={fetchLearningReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="text-gray-500 mb-4">No submission records yet. Start with a short project!</div>
        <button 
          onClick={() => router.push('/projects')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start First Project
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Learning Journey Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Your Learning Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{data.summary.completedProjects}</div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{data.summary.learningStreak}</div>
            <div className="text-sm text-gray-600">Day Learning Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{data.summary.favoriteCategory}</div>
            <div className="text-sm text-gray-600">Favorite Area</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{data.interestAnalysis.topInterests.length}</div>
            <div className="text-sm text-gray-600">Interest Areas</div>
          </div>
        </div>
      </div>

      {/* Interest Analysis */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">🌟 Your Interest Areas</h3>
        <div className="space-y-6">
          {data.interestAnalysis.categories.map((category, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    category.trend === 'increasing' ? 'bg-green-100 text-green-800' :
                    category.trend === 'stable' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {category.trend === 'increasing' ? '↗️ Growing' :
                     category.trend === 'stable' ? '→ Stable' : '↘️ Declining'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Interest Level</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${category.interestLevel}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{category.interestLevel}% interested</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Enjoyment</div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <span key={star} className={`text-lg ${
                        star <= Math.round(category.enjoymentScore / 20) ? 'text-yellow-400' : 'text-gray-300'
                      }`}>⭐</span>
                    ))}
                    <span className="text-xs text-gray-500 ml-2">{category.enjoymentScore}% fun</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {category.projectsCompleted} projects • {Math.round(category.timeSpent / 60)}h spent
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aptitude Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💪 Your Strengths</h3>
          <div className="space-y-4">
            {data.aptitudeInsights.strengths.map((strength, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{strength.skill}</div>
                  <div className="text-sm text-gray-600 capitalize">{strength.level} level</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Confidence: {strength.confidence}%</div>
                  <div className="text-sm text-gray-600">Enjoyment: {strength.enjoyment}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Areas */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🌱 Growth Opportunities</h3>
          <div className="space-y-4">
            {data.aptitudeInsights.growthAreas.map((area, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">{area.skill}</div>
                <div className="text-sm text-gray-600 mb-2">Potential: {area.potential}%</div>
                <div className="text-xs text-blue-600">
                  Try: {area.suggestedProjects.slice(0, 2).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Style & Project Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Learning Style */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎓 Your Learning Style</h3>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">Preferred Pace</div>
              <div className="text-lg text-purple-600 capitalize">{data.aptitudeInsights.learningStyle.preferredPace}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">Complexity Level</div>
              <div className="text-lg text-blue-600 capitalize">{data.aptitudeInsights.learningStyle.preferredComplexity}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">Learning Format</div>
              <div className="text-lg text-green-600 capitalize">{data.aptitudeInsights.learningStyle.preferredFormat}</div>
            </div>
          </div>
        </div>

        {/* Recent Project Experience */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Recent Projects</h3>
          <div className="space-y-3">
            {data.projectExperience.slice(0, 3).map((project, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-gray-900 text-sm">{project.title}</div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <span key={star} className={`text-sm ${
                        star <= project.enjoyment ? 'text-yellow-400' : 'text-gray-300'
                      }`}>⭐</span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-1">{project.category} • {Math.round(project.timeSpent / 60)}h</div>
                <div className="text-xs text-gray-500">
                  Learned: {project.learnedSkills.slice(0, 2).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">🚀 Your Next Steps</h3>
        
        {/* Next Projects */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Recommended Projects</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.recommendations.nextProjects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-900">{project.title}</h5>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {project.matchScore}% match
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{project.reason}</p>
                <button
                  onClick={() => handleRecommendationClick(project.href)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Start Project →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Development */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Skill Development Path</h4>
          <div className="space-y-3">
            {data.recommendations.skillDevelopment.map((skill, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-gray-900">{skill.skill}</h5>
                  <span className="text-xs text-gray-500">{skill.estimatedTime}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Try: {skill.suggestedProjects.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-sm text-gray-500 text-center bg-gray-50 rounded-lg p-4">
        💡 This report is based on your project experiences and learning patterns. Focus on what you enjoy most - that's where your passion and potential lie!
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Summary Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-32 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>

      {/* Mastery Skeleton */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Range Charts Skeleton */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="h-6 bg-gray-200 rounded mb-6 w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded mb-3 w-1/4"></div>
              <div className="h-16 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


