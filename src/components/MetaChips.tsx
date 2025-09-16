interface MetaChipsProps {
  difficulty: 'E' | 'M' | 'H'
  duration: string
  rating: number
  reviews: number
  category?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function MetaChips({ 
  difficulty, 
  duration, 
  rating, 
  reviews, 
  category,
  size = 'md' 
}: MetaChipsProps) {
  const difficultyColors = {
    E: 'bg-green-100 text-green-800',
    M: 'bg-yellow-100 text-yellow-800',
    H: 'bg-red-100 text-red-800'
  }

  const difficultyLabels = {
    E: '쉬움',
    M: '보통',
    H: '어려움'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {category && (
        <span className={`${sizeClasses[size]} bg-blue-100 text-blue-800 rounded`}>
          {category}
        </span>
      )}
      <span className={`${sizeClasses[size]} ${difficultyColors[difficulty]} rounded`}>
        {difficultyLabels[difficulty]}
      </span>
      <span className={`${sizeClasses[size]} bg-gray-100 text-gray-700 rounded`}>
        ⏱ {duration}
      </span>
      <span className={`${sizeClasses[size]} bg-gray-100 text-gray-700 rounded`}>
        ★ {rating} · {reviews}
      </span>
    </div>
  )
}













