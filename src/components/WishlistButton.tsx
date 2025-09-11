'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useFirebaseWishlist } from '@/hooks/useFirebaseWishlist'

interface WishlistButtonProps {
  missionId: string
  userId?: string
  variant?: 'default' | 'compact' | 'icon-only'
  className?: string
}

export default function WishlistButton({ 
  missionId, 
  userId, 
  variant = 'default',
  className = '' 
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useFirebaseWishlist(userId)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    if (!userId) {
      alert('Please log in to add to wishlist')
      return
    }

    setIsLoading(true)
    
    try {
      if (isInWishlist(missionId)) {
        await removeFromWishlist(missionId)
      } else {
        await addToWishlist(missionId)
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isWishlisted = isInWishlist(missionId)

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-colors ${
          isWishlisted 
            ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100' 
            : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
        } disabled:opacity-50 ${className}`}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>
    )
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isWishlisted 
            ? 'text-red-600 bg-red-50 hover:bg-red-100' 
            : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
        } disabled:opacity-50 ${className}`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        {isWishlisted ? 'Wishlisted' : 'Add to wishlist'}
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
        isWishlisted 
          ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200' 
          : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300'
      } disabled:opacity-50 ${className}`}
    >
      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
      {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    </button>
  )
}




