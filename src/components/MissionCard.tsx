import Link from 'next/link'
import { Star, Clock, Zap, DollarSign } from 'lucide-react'

interface Mission {
  id: string
  title: string
  category: string
  difficulty: 'E' | 'M' | 'H'
  duration: number // in minutes
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
}

interface MissionCardProps {
  mission: Mission
  variant?: 'default' | 'compact'
}

export default function MissionCard({ mission, variant = 'default' }: MissionCardProps) {
  const difficultyColors = {
    E: 'bg-green-100 text-green-800',
    M: 'bg-yellow-100 text-yellow-800',
    H: 'bg-red-100 text-red-800'
  }

  const difficultyLabels = {
    E: 'Easy',
    M: 'Medium',
    H: 'Hard'
  }

  const evaluationTypeLabels = {
    CODE: 'Code',
    NUMERIC: 'Numeric',
    TEXT: 'Text',
    TESTS: 'Tests'
  }

  const evaluationTypeColors = {
    CODE: 'bg-purple-100 text-purple-800',
    NUMERIC: 'bg-green-100 text-green-800',
    TEXT: 'bg-orange-100 text-orange-800',
    TESTS: 'bg-blue-100 text-blue-800'
  }

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/projects/${mission.id}`}
        className="bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-200 p-4 group"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
            {mission.thumbnail ? (
              <img 
                src={mission.thumbnail} 
                alt={mission.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-slate-400 text-sm">Thumbnail</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-medium">
                {mission.category}
              </span>
              <span className={`text-xs px-2 py-1 rounded font-medium ${difficultyColors[mission.difficulty]}`}>
                {difficultyLabels[mission.difficulty]}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 text-sm">
              {mission.title}
            </h3>
            <p className="text-xs text-slate-600 mb-2 line-clamp-2">
              {mission.description}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mission.duration}m
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  {mission.rating}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${evaluationTypeColors[mission.evaluationType]}`}>
                  {evaluationTypeLabels[mission.evaluationType]}
                </span>
              </div>
              <span className="text-slate-600 group-hover:text-slate-900 font-medium">
                View →
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/projects/${mission.id}`}
      className="bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-200 p-4 group"
    >
      {/* Thumbnail */}
      <div className="bg-slate-100 rounded-lg h-48 mb-4 overflow-hidden">
        {mission.thumbnail ? (
          <img 
            src={mission.thumbnail} 
            alt={mission.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate-400 text-sm">Thumbnail</span>
          </div>
        )}
      </div>

      {/* Meta chips */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-medium">
          {mission.category}
        </span>
        <span className={`text-xs px-2 py-1 rounded font-medium ${difficultyColors[mission.difficulty]}`}>
          {difficultyLabels[mission.difficulty]}
        </span>
        <span className={`text-xs px-2 py-1 rounded font-medium ${evaluationTypeColors[mission.evaluationType]}`}>
          {evaluationTypeLabels[mission.evaluationType]}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 text-base leading-tight">
        {mission.title}
      </h3>

      {/* Description */}
      <p className="text-slate-600 mb-4 line-clamp-2 text-sm leading-relaxed">
        {mission.description}
      </p>

      {/* Creator */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm">
          {mission.creator.avatar}
        </div>
        <span className="text-sm text-slate-600">{mission.creator.name}</span>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs text-slate-500">{mission.creator.rating}</span>
        </div>
      </div>

      {/* Quality stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="font-semibold">{mission.rating}</span>
          </div>
          <div className="text-slate-500">Rating</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-slate-900">{mission.completionRate}%</div>
          <div className="text-slate-500">Complete</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-slate-900">{mission.medianTime}m</div>
          <div className="text-slate-500">Median</div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {mission.duration}m
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {formatPrice(mission.price)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-600 group-hover:text-slate-900 font-medium">
          <Zap className="w-4 h-4" />
          <span className="text-sm">Start now</span>
        </div>
      </div>
    </Link>
  )
}