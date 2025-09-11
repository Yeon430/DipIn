'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import Header from '@/components/Header'
import PeerBaselineWidget from '@/components/PeerBaselineWidget'
import WishlistSection from '@/components/WishlistSection'
import LearningReport from '@/components/LearningReport'
import { useAuth } from '@/contexts/AuthContext'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { user, isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  const tabs: Tab[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: <OverviewTab />
    },
    {
      id: 'activities',
      label: 'Activity',
      content: <ActivitiesTab />
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      content: <WishlistTab userId={user?.id || ''} />
    },
    {
      id: 'reports',
      label: 'Learning Report',
      content: <ReportsTab userId={user?.id || ''} />
    },
    {
      id: 'settings',
      label: 'Settings',
      content: <SettingsTab />
    }
  ]

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profile' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Profile
              </h1>
              <p className="text-gray-600">
                Check your learning progress and personalized reports
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 text-lg font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-8">
            {tabs.find(tab => tab.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  )
}

// Overview Tab
function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-blue-600 mb-2">24h</div>
          <div className="text-sm text-blue-800">Total Learning Time</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-green-600 mb-2">12</div>
          <div className="text-sm text-green-800">Completed Projects</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-yellow-600 mb-2">4.2</div>
          <div className="text-sm text-yellow-800">Average Score</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
          <div className="text-sm text-purple-800">In Progress</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { mission: 'Build a React Todo App', score: 85, date: '2 hours ago' },
            { mission: 'Analyze Sales Data with SQL', score: 92, date: '1 day ago' },
            { mission: 'Design RESTful API', score: 78, date: '2 days ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{activity.mission}</div>
                <div className="text-sm text-gray-500">{activity.date}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{activity.score}%</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Wishlist Tab
function WishlistTab({ userId }: { userId: string }) {
  return (
    <div className="space-y-6">
      <WishlistSection userId={userId} />
    </div>
  )
}

// Activity Tab
function ActivitiesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Completed Projects</h3>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option>All</option>
            <option>Completed</option>
            <option>In Progress</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option>Latest</option>
            <option>Score</option>
            <option>Title</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { 
            title: 'Build a React Todo App', 
            category: 'Frontend',
            score: 85, 
            status: 'Completed',
            completedAt: '2024-01-15',
            feedback: 'Code structure is well organized. You have a good understanding of useState usage.'
          },
          { 
            title: 'Analyze Sales Data with SQL', 
            category: 'Data Analytics',
            score: 92, 
            status: 'Completed',
            completedAt: '2024-01-14',
            feedback: 'You used JOIN and aggregate functions correctly. Excellent business insight derivation.'
          },
          { 
            title: 'Design RESTful API', 
            category: 'Backend',
            score: 78, 
            status: 'Completed',
            completedAt: '2024-01-13',
            feedback: 'You followed REST principles well. HTTP status codes could be used more accurately.'
          }
        ].map((mission, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{mission.title}</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {mission.category}
                  </span>
                </div>
                <div className="text-sm text-gray-500">Completed: {mission.completedAt}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{mission.score}%</div>
                <div className="text-sm text-green-600">{mission.status}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-700">
                <strong>Feedback:</strong> {mission.feedback}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Retry
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Report Tab
function ReportsTab({ userId }: { userId: string }) {
  return (
    <div className="space-y-8">
      {/* Learning Report Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Learning Report</h2>
        <p className="text-gray-600">My pace and next steps from the last 30 days</p>
      </div>

      {/* Learning Report Component */}
      <LearningReport userId={userId} />
    </div>
  )
}

// Peer Baseline Analysis Component
function PeerBaselineAnalysis() {
  const [selectedMission, setSelectedMission] = useState<string | null>(null)
  const [userMissions, setUserMissions] = useState([
    {
      id: 'react-todo-app',
      title: 'Build a React Todo App with State Management',
      difficulty: 'MEDIUM' as const,
      durationMin: 15,
      category: 'Frontend',
      scenes: [
        { id: '1', type: 'INFO' as const },
        { id: '2', type: 'CODE' as const },
        { id: '3', type: 'CODE' as const },
        { id: '4', type: 'MCQ' as const },
        { id: '5', type: 'CODE' as const }
      ],
      mySubmission: {
        score: 87,
        timeMinutes: 12,
        completed: true,
        createdAt: new Date().toISOString()
      }
    },
    {
      id: 'sql-data-analysis',
      title: 'Analyze Sales Data with SQL',
      difficulty: 'EASY' as const,
      durationMin: 8,
      category: 'Data Analytics',
      scenes: [
        { id: '1', type: 'INFO' as const },
        { id: '2', type: 'SQL' as const },
        { id: '3', type: 'NUMERIC' as const },
        { id: '4', type: 'SHORT_TEXT' as const }
      ],
      mySubmission: {
        score: 92,
        timeMinutes: 6,
        completed: true,
        createdAt: new Date().toISOString()
      }
    },
    {
      id: 'restful-api-design',
      title: 'Design RESTful API with Authentication',
      difficulty: 'HARD' as const,
      durationMin: 45,
      category: 'Backend',
      scenes: [
        { id: '1', type: 'INFO' as const },
        { id: '2', type: 'CODE' as const },
        { id: '3', type: 'CODE' as const },
        { id: '4', type: 'BRANCH' as const },
        { id: '5', type: 'CODE' as const },
        { id: '6', type: 'MCQ' as const }
      ],
      mySubmission: {
        score: 78,
        timeMinutes: 38,
        completed: true,
        createdAt: new Date().toISOString()
      }
    }
  ])

  const currentMission = selectedMission 
    ? userMissions.find(m => m.id === selectedMission)
    : userMissions[0]

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">동료 성과 분석</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">동료와 비교:</span>
          <select 
            value={selectedMission || userMissions[0].id}
            onChange={(e) => setSelectedMission(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {userMissions.map((mission) => (
              <option key={mission.id} value={mission.id}>
                {mission.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentMission && (
        <div className="space-y-6">
          {/* Mission Overview */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{currentMission.title}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>카테고리: {currentMission.category}</span>
                  <span>난이도: {currentMission.difficulty}</span>
                  <span>소요시간: {currentMission.durationMin}분</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{currentMission.mySubmission.score}%</div>
                <div className="text-sm text-gray-500">내 점수</div>
              </div>
            </div>
          </div>

          {/* Peer Baseline Widget */}
          <PeerBaselineWidget 
            mission={currentMission}
            mySubmission={currentMission.mySubmission}
          />

          {/* Performance Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">성과 인사이트</h5>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• 완료 시간: {currentMission.mySubmission.timeMinutes}분</p>
                <p>• 이 프로젝트에서 {currentMission.mySubmission.score}% 점수 획득</p>
                <p>• {currentMission.scenes.length}개 장면으로 구성된 다양한 콘텐츠 유형</p>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">동료 비교</h5>
              <div className="space-y-2 text-sm text-green-800">
                <p>• 최근 동료 제출물과 성과 비교</p>
                <p>• 점수와 완료 시간에서의 순위 확인</p>
                <p>• 이 프로젝트 유형의 일반적인 완료율 이해</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Settings Tab
function SettingsTab() {
  return (
    <div className="space-y-8">
      {/* Profile Settings */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Computer Science</option>
              <option>Software Engineering</option>
              <option>Data Science</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
              <option>Graduate Student</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest</label>
            <div className="flex flex-wrap gap-2">
              {['Frontend', 'Backend', 'Data Analytics', 'ML/AI'].map((field) => (
                <label key={field} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">{field}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Job Preparation</option>
              <option>Graduate School</option>
              <option>Startup</option>
              <option>Skill Development</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" />
            <span className="text-sm text-gray-700">Act anonymously</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" />
            <span className="text-sm text-gray-700">Participate in learning data analysis</span>
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Data
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  )
}
