import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const projectId = searchParams.get('projectId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Mock data for demonstration - in production, this would fetch from Firebase
    const mockData = {
      mode: 'real' as const,
      windowDays: 30,
      sampleN: 18,
      summary: {
        totalProjects: 12,
        completedProjects: 8,
        learningStreak: 5,
        favoriteCategory: 'Frontend'
      },
      interestAnalysis: {
        categories: [
          {
            name: 'Frontend Development',
            interestLevel: 85,
            enjoymentScore: 90,
            timeSpent: 480, // 8 hours
            projectsCompleted: 4,
            trend: 'increasing' as const
          },
          {
            name: 'Machine Learning',
            interestLevel: 70,
            enjoymentScore: 75,
            timeSpent: 360, // 6 hours
            projectsCompleted: 2,
            trend: 'stable' as const
          },
          {
            name: 'Backend Development',
            interestLevel: 60,
            enjoymentScore: 65,
            timeSpent: 240, // 4 hours
            projectsCompleted: 2,
            trend: 'increasing' as const
          },
          {
            name: 'Data Analytics',
            interestLevel: 45,
            enjoymentScore: 50,
            timeSpent: 120, // 2 hours
            projectsCompleted: 1,
            trend: 'decreasing' as const
          }
        ],
        topInterests: ['Frontend Development', 'Machine Learning'],
        emergingInterests: ['Backend Development', 'Mobile Development']
      },
      aptitudeInsights: {
        strengths: [
          {
            skill: 'React',
            level: 'intermediate' as const,
            confidence: 85,
            enjoyment: 90
          },
          {
            skill: 'JavaScript',
            level: 'intermediate' as const,
            confidence: 80,
            enjoyment: 85
          },
          {
            skill: 'CSS',
            level: 'intermediate' as const,
            confidence: 75,
            enjoyment: 80
          }
        ],
        growthAreas: [
          {
            skill: 'TypeScript',
            potential: 85,
            suggestedProjects: ['TypeScript Todo App', 'Advanced TypeScript Patterns']
          },
          {
            skill: 'Node.js',
            potential: 70,
            suggestedProjects: ['REST API with Express', 'Real-time Chat App']
          },
          {
            skill: 'Database Design',
            potential: 60,
            suggestedProjects: ['E-commerce Database', 'User Management System']
          }
        ],
        learningStyle: {
          preferredPace: 'moderate' as const,
          preferredComplexity: 'moderate' as const,
          preferredFormat: 'hands-on' as const
        }
      },
      projectExperience: [
        {
          projectId: 'react-todo-app',
          title: 'Build a React Todo App',
          category: 'Frontend',
          enjoyment: 5,
          difficulty: 3,
          timeSpent: 180,
          completed: true,
          learnedSkills: ['React', 'State Management', 'Component Design'],
          feedback: 'Really enjoyed building the UI components!'
        },
        {
          projectId: 'sentiment-analysis-ml',
          title: 'Sentiment Analysis with ML',
          category: 'Machine Learning',
          enjoyment: 4,
          difficulty: 4,
          timeSpent: 240,
          completed: true,
          learnedSkills: ['Python', 'NLP', 'Machine Learning'],
          feedback: 'Challenging but very rewarding!'
        },
        {
          projectId: 'rest-api-express',
          title: 'REST API with Express',
          category: 'Backend',
          enjoyment: 3,
          difficulty: 4,
          timeSpent: 200,
          completed: false,
          learnedSkills: ['Node.js', 'Express', 'API Design'],
          feedback: 'Need more practice with backend concepts'
        }
      ],
      recommendations: {
        nextProjects: [
          {
            title: 'Advanced React Patterns',
            href: '/projects/advanced-react-patterns',
            reason: 'Build on your strong React foundation with advanced concepts',
            matchScore: 95
          },
          {
            title: 'TypeScript Fundamentals',
            href: '/projects/typescript-fundamentals',
            reason: 'Enhance your JavaScript skills with type safety',
            matchScore: 88
          },
          {
            title: 'Full-Stack E-commerce',
            href: '/projects/fullstack-ecommerce',
            reason: 'Combine your frontend skills with backend development',
            matchScore: 82
          }
        ],
        skillDevelopment: [
          {
            skill: 'TypeScript',
            suggestedProjects: ['TypeScript Todo App', 'Advanced TypeScript Patterns'],
            estimatedTime: '2-3 weeks'
          },
          {
            skill: 'Backend Development',
            suggestedProjects: ['REST API with Express', 'Database Design'],
            estimatedTime: '3-4 weeks'
          },
          {
            skill: 'Mobile Development',
            suggestedProjects: ['React Native App', 'Flutter Basics'],
            estimatedTime: '4-6 weeks'
          }
        ]
      }
    }

    // If projectId is provided, filter data for that specific project
    if (projectId) {
      // In production, this would filter the data based on the specific project
      // For now, we'll return the same mock data but with project-specific context
      return NextResponse.json({
        ...mockData,
        mode: 'real' as const,
        summary: {
          ...mockData.summary,
          completedProjects: 1 // Focus on specific project
        },
        projectExperience: mockData.projectExperience.filter(p => p.projectId === projectId)
      })
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Error fetching learning report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch learning report' },
      { status: 500 }
    )
  }
}


