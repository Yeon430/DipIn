'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, Users, Award, Github, Linkedin, Twitter } from 'lucide-react'

interface Creator {
  id: string
  name: string
  avatar: string
  rating: number
  completionRate: number
  responseTime: string
  projectCount: number
  bio: string
  expertise: string[]
  experience: string
  location: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
  }
  achievements: string[]
}

interface Project {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: number
  rating: number
  reviewCount: number
  thumbnail: string
  price: number
  completionRate: number
  medianTime: number
}

interface Review {
  id: string
  projectId: string
  projectTitle: string
  rating: number
  comment: string
  userName: string
  userAvatar: string
  createdAt: string
  helpful: number
}

export default function CreatorProfile() {
  const params = useParams()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.creatorSlug) {
      fetchCreatorData(params.creatorSlug as string)
    }
  }, [params.creatorSlug])

  const fetchCreatorData = async (creatorSlug: string) => {
    try {
      setLoading(true)
      
      // Mock data - 실제로는 API에서 가져올 데이터
      const mockCreator: Creator = {
        id: creatorSlug,
        name: getCreatorName(creatorSlug),
        avatar: getCreatorAvatar(creatorSlug),
        rating: 4.9,
        completionRate: 96,
        responseTime: '2h',
        projectCount: 23,
        bio: getCreatorBio(creatorSlug),
        expertise: getCreatorExpertise(creatorSlug),
        experience: '5+ years',
        location: 'San Francisco, CA',
        socialLinks: {
          github: 'https://github.com/' + creatorSlug,
          linkedin: 'https://linkedin.com/in/' + creatorSlug,
          twitter: 'https://twitter.com/' + creatorSlug
        },
        achievements: [
          'Top 1% of creators',
          '1000+ students helped',
          'Industry expert',
          'Open source contributor'
        ]
      }

      const mockProjects: Project[] = getCreatorProjects(creatorSlug)
      const mockReviews: Review[] = getCreatorReviews(creatorSlug)

      setCreator(mockCreator)
      setProjects(mockProjects)
      setReviews(mockReviews)
    } catch (error) {
      console.error('Error fetching creator data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCreatorName = (slug: string) => {
    const names: { [key: string]: string } = {
      'alex-chen': 'Alex Chen',
      'sarah-kim': 'Sarah Kim',
      'david-park': 'David Park',
      'maria-garcia': 'Dr. Maria Garcia'
    }
    return names[slug] || 'Unknown Creator'
  }

  const getCreatorAvatar = (slug: string) => {
    const avatars: { [key: string]: string } = {
      'alex-chen': '👨‍💻',
      'sarah-kim': '👩‍💻',
      'david-park': '👨‍💼',
      'maria-garcia': '👩‍🔬'
    }
    return avatars[slug] || '👤'
  }

  const getCreatorBio = (slug: string) => {
    const bios: { [key: string]: string } = {
      'alex-chen': 'Full-stack developer with 5+ years of experience building scalable web applications. Passionate about teaching and helping students discover their potential in software development.',
      'sarah-kim': 'Frontend specialist and UI/UX enthusiast. I love creating beautiful, accessible interfaces and sharing my knowledge with the next generation of developers.',
      'david-park': 'Backend architect and DevOps expert. I focus on system design, cloud infrastructure, and helping students understand the complexities of modern software architecture.',
      'maria-garcia': 'AI/ML researcher and educator. With a PhD in Computer Science, I bridge the gap between academic research and practical applications in machine learning.'
    }
    return bios[slug] || 'Experienced creator passionate about sharing knowledge.'
  }

  const getCreatorExpertise = (slug: string) => {
    const expertise: { [key: string]: string[] } = {
      'alex-chen': ['React', 'Node.js', 'TypeScript', 'AWS'],
      'sarah-kim': ['React', 'Vue.js', 'Design Systems', 'CSS'],
      'david-park': ['Python', 'Docker', 'Kubernetes', 'Microservices'],
      'maria-garcia': ['Python', 'Machine Learning', 'TensorFlow', 'Data Science']
    }
    return expertise[slug] || ['Programming', 'Teaching']
  }

  const getCreatorProjects = (slug: string): Project[] => {
    const projectData: { [key: string]: Project[] } = {
      'alex-chen': [
        {
          id: 'react-todo-app',
          title: 'Build a React Todo App with State Management',
          description: 'Create a fully functional todo application with React hooks and state management.',
          category: 'frontend',
          difficulty: 'Medium',
          duration: 30,
          rating: 4.8,
          reviewCount: 156,
          thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=267&fit=crop&crop=center',
          price: 0,
          completionRate: 89,
          medianTime: 25
        },
        {
          id: 'fullstack-ecommerce',
          title: 'Full-Stack E-commerce Platform',
          description: 'Build a complete e-commerce solution with React frontend and Node.js backend.',
          category: 'fullstack',
          difficulty: 'Hard',
          duration: 120,
          rating: 4.9,
          reviewCount: 89,
          thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=267&fit=crop&crop=center',
          price: 49,
          completionRate: 76,
          medianTime: 95
        }
      ],
      'sarah-kim': [
        {
          id: 'design-system',
          title: 'Create a Design System with Storybook',
          description: 'Build a comprehensive design system and document it with Storybook.',
          category: 'frontend',
          difficulty: 'Medium',
          duration: 45,
          rating: 4.7,
          reviewCount: 124,
          thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=267&fit=crop&crop=center',
          price: 29,
          completionRate: 82,
          medianTime: 38
        }
      ],
      'david-park': [
        {
          id: 'microservices-architecture',
          title: 'Microservices Architecture with Docker',
          description: 'Design and implement a microservices architecture using Docker and Kubernetes.',
          category: 'backend',
          difficulty: 'Hard',
          duration: 90,
          rating: 4.8,
          reviewCount: 67,
          thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=267&fit=crop&crop=center',
          price: 59,
          completionRate: 71,
          medianTime: 85
        }
      ],
      'maria-garcia': [
        {
          id: 'sentiment-analysis-ml',
          title: 'Train Sentiment Analysis Model',
          description: 'Build and train a machine learning model for sentiment analysis.',
          category: 'ml-ai',
          difficulty: 'Hard',
          duration: 60,
          rating: 4.9,
          reviewCount: 45,
          thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=267&fit=crop&crop=center',
          price: 49,
          completionRate: 78,
          medianTime: 55
        }
      ]
    }
    return projectData[slug] || []
  }

  const getCreatorReviews = (slug: string): Review[] => {
    const reviewsData: { [key: string]: Review[] } = {
      'alex-chen': [
        {
          id: '1',
          projectId: 'react-todo-app',
          projectTitle: 'Build a React Todo App with State Management',
          rating: 5,
          comment: 'Alex is an amazing teacher! His explanations are crystal clear and he really cares about student success. The React project was perfectly structured.',
          userName: 'Emma Wilson',
          userAvatar: '👩‍💻',
          createdAt: '2024-01-15',
          helpful: 24
        },
        {
          id: '2',
          projectId: 'fullstack-ecommerce',
          projectTitle: 'Full-Stack E-commerce Platform',
          rating: 5,
          comment: 'Incredible comprehensive project! Alex breaks down complex concepts into digestible pieces. I went from beginner to confident full-stack developer.',
          userName: 'James Rodriguez',
          userAvatar: '👨‍💼',
          createdAt: '2024-01-12',
          helpful: 18
        },
        {
          id: '3',
          projectId: 'react-todo-app',
          projectTitle: 'Build a React Todo App with State Management',
          rating: 4,
          comment: 'Great project for learning React fundamentals. Alex provides excellent support and quick responses to questions.',
          userName: 'Sarah Chen',
          userAvatar: '👩‍🎓',
          createdAt: '2024-01-08',
          helpful: 12
        },
        {
          id: '4',
          projectId: 'fullstack-ecommerce',
          projectTitle: 'Full-Stack E-commerce Platform',
          rating: 5,
          comment: 'This project changed my career path! Alex\'s teaching style is engaging and practical. Highly recommend to anyone serious about web development.',
          userName: 'Michael Park',
          userAvatar: '👨‍💻',
          createdAt: '2024-01-05',
          helpful: 31
        }
      ],
      'sarah-kim': [
        {
          id: '1',
          projectId: 'design-system',
          projectTitle: 'Create a Design System with Storybook',
          rating: 5,
          comment: 'Sarah\'s design expertise is unmatched! She taught me how to think like a designer and create beautiful, scalable UI components.',
          userName: 'Lisa Zhang',
          userAvatar: '👩‍🎨',
          createdAt: '2024-01-14',
          helpful: 19
        },
        {
          id: '2',
          projectId: 'design-system',
          projectTitle: 'Create a Design System with Storybook',
          rating: 4,
          comment: 'Fantastic course on design systems! Sarah explains the why behind design decisions, not just the how. Very insightful.',
          userName: 'David Kim',
          userAvatar: '👨‍💻',
          createdAt: '2024-01-11',
          helpful: 15
        },
        {
          id: '3',
          projectId: 'design-system',
          projectTitle: 'Create a Design System with Storybook',
          rating: 5,
          comment: 'Sarah\'s attention to detail is incredible. She helped me understand accessibility and responsive design principles I never knew existed.',
          userName: 'Anna Thompson',
          userAvatar: '👩‍💼',
          createdAt: '2024-01-09',
          helpful: 22
        }
      ],
      'david-park': [
        {
          id: '1',
          projectId: 'microservices-architecture',
          projectTitle: 'Microservices Architecture with Docker',
          rating: 5,
          comment: 'David is a backend genius! His explanations of complex architecture patterns are so clear. This project gave me confidence in system design.',
          userName: 'Robert Lee',
          userAvatar: '👨‍💻',
          createdAt: '2024-01-13',
          helpful: 27
        },
        {
          id: '2',
          projectId: 'microservices-architecture',
          projectTitle: 'Microservices Architecture with Docker',
          rating: 4,
          comment: 'Excellent deep dive into microservices! David\'s real-world experience really shows. Learned Docker and Kubernetes from scratch.',
          userName: 'Jennifer Wu',
          userAvatar: '👩‍🔬',
          createdAt: '2024-01-10',
          helpful: 16
        },
        {
          id: '3',
          projectId: 'microservices-architecture',
          projectTitle: 'Microservices Architecture with Docker',
          rating: 5,
          comment: 'David\'s teaching style is perfect for complex topics. He breaks down intimidating concepts into manageable pieces. Highly recommend!',
          userName: 'Kevin Martinez',
          userAvatar: '👨‍🎓',
          createdAt: '2024-01-07',
          helpful: 21
        },
        {
          id: '4',
          projectId: 'microservices-architecture',
          projectTitle: 'Microservices Architecture with Docker',
          rating: 5,
          comment: 'This course is a game-changer! David\'s expertise in DevOps and system architecture is evident. Perfect for advancing your backend skills.',
          userName: 'Rachel Green',
          userAvatar: '👩‍💻',
          createdAt: '2024-01-04',
          helpful: 29
        }
      ],
      'maria-garcia': [
        {
          id: '1',
          projectId: 'sentiment-analysis-ml',
          projectTitle: 'Train Sentiment Analysis Model',
          rating: 5,
          comment: 'Dr. Garcia is an incredible ML educator! She makes complex AI concepts accessible and practical. This project opened my eyes to machine learning.',
          userName: 'Alex Thompson',
          userAvatar: '👨‍🔬',
          createdAt: '2024-01-16',
          helpful: 33
        },
        {
          id: '2',
          projectId: 'sentiment-analysis-ml',
          projectTitle: 'Train Sentiment Analysis Model',
          rating: 5,
          comment: 'Maria\'s academic background really shows in her teaching. She explains the theory behind ML algorithms in a way that actually makes sense.',
          userName: 'Priya Patel',
          userAvatar: '👩‍💻',
          createdAt: '2024-01-13',
          helpful: 25
        },
        {
          id: '3',
          projectId: 'sentiment-analysis-ml',
          projectTitle: 'Train Sentiment Analysis Model',
          rating: 4,
          comment: 'Great introduction to NLP! Dr. Garcia\'s step-by-step approach made machine learning less intimidating. The project was challenging but rewarding.',
          userName: 'Carlos Rodriguez',
          userAvatar: '👨‍💼',
          createdAt: '2024-01-10',
          helpful: 18
        },
        {
          id: '4',
          projectId: 'sentiment-analysis-ml',
          projectTitle: 'Train Sentiment Analysis Model',
          rating: 5,
          comment: 'Maria\'s passion for AI is contagious! She helped me understand not just how to build models, but why they work. Excellent course!',
          userName: 'Sophie Chen',
          userAvatar: '👩‍🎓',
          createdAt: '2024-01-07',
          helpful: 26
        },
        {
          id: '5',
          projectId: 'sentiment-analysis-ml',
          projectTitle: 'Train Sentiment Analysis Model',
          rating: 5,
          comment: 'This course changed my perspective on AI! Dr. Garcia\'s research experience brings real-world insights you won\'t find elsewhere.',
          userName: 'Ahmed Hassan',
          userAvatar: '👨‍💻',
          createdAt: '2024-01-04',
          helpful: 30
        }
      ]
    }
    return reviewsData[slug] || []
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg p-8">
              <div className="h-32 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Creator Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Creator Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center text-6xl">
                {creator.avatar}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{creator.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{creator.rating}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{creator.experience} experience</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{creator.location}</span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{creator.bio}</p>
              
              {/* Social Links */}
              <div className="flex gap-4 mb-6">
                {creator.socialLinks.github && (
                  <a href={creator.socialLinks.github} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-600 hover:text-gray-900">
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {creator.socialLinks.linkedin && (
                  <a href={creator.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                     className="text-gray-600 hover:text-gray-900">
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
                {creator.socialLinks.twitter && (
                  <a href={creator.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                     className="text-gray-600 hover:text-gray-900">
                    <Twitter className="w-6 h-6" />
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{creator.completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{creator.responseTime}</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{creator.projectCount}</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{creator.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Expertise & Achievements */}
          <div className="space-y-6">
            {/* Expertise */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {creator.expertise.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h3>
              <ul className="space-y-3">
                {creator.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Projects & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Projects */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Projects ({projects.length})</h3>
              <div className="space-y-4">
                {projects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex gap-4">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{project.title}</h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            {project.rating}
                          </span>
                          <span>{project.duration}m</span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">{project.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Student Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        {review.userAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{review.userName}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Project: {review.projectTitle}</span>
                          <span>•</span>
                          <span>{review.createdAt}</span>
                          <span>•</span>
                          <span>{review.helpful} helpful</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
