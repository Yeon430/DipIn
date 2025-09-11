'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Star, Clock, DollarSign, Trash2, ExternalLink } from 'lucide-react'
import { useFirebaseWishlist } from '@/hooks/useFirebaseWishlist'

interface WishlistSectionProps {
  userId: string
  className?: string
}

export default function WishlistSection({ 
  userId, 
  className = '' 
}: WishlistSectionProps) {
  const { wishlist, isLoading, error, removeFromWishlist } = useFirebaseWishlist(userId)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleRemove = async (projectId: string) => {
    setRemovingId(projectId)
    try {
      await removeFromWishlist(projectId)
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      alert('Failed to remove from wishlist')
    } finally {
      setRemovingId(null)
    }
  }

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'E': return 'bg-green-100 text-green-800'
      case 'M': return 'bg-yellow-100 text-yellow-800'
      case 'H': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'E': return 'Easy'
      case 'M': return 'Medium'
      case 'H': return 'Hard'
      default: return difficulty
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-slate-200 pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-8 ${className}`}>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">My Wishlist</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-8 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">My Wishlist</h2>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Heart className="w-5 h-5 text-red-500" />
          <span>{wishlist.length} projects</span>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Your wishlist is empty</h3>
          <p className="text-slate-600 mb-6">Start exploring projects and add them to your wishlist!</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Projects
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.project?.thumbnail ? (
                    <img 
                      src={item.project.thumbnail} 
                      alt={item.project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-slate-400 text-xs">Thumbnail</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                          {item.project?.title || `Project: ${item.projectId}`}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                          {item.project?.description || 'This project is not available in the database. It may have been removed or the ID is incorrect.'}
                        </p>
                        {!item.project && (
                          <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded mt-1">
                            ⚠️ Project data not found
                          </div>
                        )}
                      </div>
                    <button
                      onClick={() => handleRemove(item.projectId)}
                      disabled={removingId === item.projectId}
                      className="ml-4 p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {item.project?.category || 'Unknown'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(item.project?.difficulty || 'E')}`}>
                      {getDifficultyLabel(item.project?.difficulty || 'E')}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{item.project?.rating || '0'}</span>
                      <span>({item.project?.review_count || '0'})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.project?.duration || '0'}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatPrice(item.project?.price || 0)}</span>
                    </div>
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                      {item.project?.creator?.avatar || '👤'}
                    </div>
                    <span className="text-sm text-slate-600">{item.project?.creator?.name || 'Unknown'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/projects/${item.projectId}`}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      View Project
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <span className="text-xs text-slate-500">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
