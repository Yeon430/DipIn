'use client'

import PeerBaselineWidget from '@/components/PeerBaselineWidget'

export default function DemoBaselinePage() {
  const sampleMission = {
    id: 'demo-mission',
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
    ]
  }

  const sampleSubmission = {
    score: 87,
    timeMinutes: 12,
    completed: true,
    createdAt: new Date().toISOString()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Peer Baseline Widget Demo</h1>
          <p className="text-gray-600">
            This demonstrates the cold-start-safe Peer Baseline widget that switches between 
            Design Baseline (no users) and Real Baseline (30+ submissions) automatically.
          </p>
        </div>

        <div className="space-y-8">
          {/* Cold-start scenario */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cold-start Scenario (Design Baseline)</h2>
            <p className="text-sm text-gray-600 mb-4">
              When there are fewer than 30 submissions, the widget shows design-based estimates.
            </p>
            <PeerBaselineWidget 
              mission={sampleMission}
              mySubmission={sampleSubmission}
            />
          </div>

          {/* Different difficulty levels */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Different Difficulty Levels</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Easy Mission</h3>
                <PeerBaselineWidget 
                  mission={{
                    ...sampleMission,
                    difficulty: 'EASY',
                    durationMin: 8,
                    title: 'Simple HTML/CSS Layout'
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Hard Mission</h3>
                <PeerBaselineWidget 
                  mission={{
                    ...sampleMission,
                    difficulty: 'HARD',
                    durationMin: 45,
                    title: 'Complex Full-Stack Application'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Different scene types */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Different Scene Types</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Code-Heavy Mission</h3>
                <PeerBaselineWidget 
                  mission={{
                    ...sampleMission,
                    title: 'Build RESTful API with Authentication',
                    scenes: [
                      { id: '1', type: 'INFO' },
                      { id: '2', type: 'CODE' },
                      { id: '3', type: 'CODE' },
                      { id: '4', type: 'CODE' },
                      { id: '5', type: 'CODE' }
                    ]
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Mixed Content Mission</h3>
                <PeerBaselineWidget 
                  mission={{
                    ...sampleMission,
                    title: 'Data Analysis with SQL and Visualization',
                    scenes: [
                      { id: '1', type: 'INFO' },
                      { id: '2', type: 'SQL' },
                      { id: '3', type: 'NUMERIC' },
                      { id: '4', type: 'MCQ' },
                      { id: '5', type: 'SHORT_TEXT' }
                    ]
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}












