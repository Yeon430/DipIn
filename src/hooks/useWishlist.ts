'use client'

import { useState, useEffect } from 'react'

interface WishlistItem {
  id: string
  created_at: string
  missions: {
    id: string
    title: string
    description: string
    category: string
    difficulty: string
    duration: number
    price: number
    rating: number
    review_count: number
    thumbnail: string
    creator: {
      name: string
      avatar: string
    }
  }
}

interface UseWishlistReturn {
  wishlist: WishlistItem[]
  isLoading: boolean
  error: string | null
  addToWishlist: (missionId: string) => Promise<boolean>
  removeFromWishlist: (missionId: string) => Promise<boolean>
  isInWishlist: (missionId: string) => boolean
  refreshWishlist: () => Promise<void>
}

export function useWishlist(userId?: string): UseWishlistReturn {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWishlist = async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/wishlist?userId=${userId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch wishlist')
      }

      setWishlist(data.wishlist || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const addToWishlist = async (missionId: string): Promise<boolean> => {
    if (!userId) return false

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          missionId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to wishlist')
      }

      // 위시리스트 새로고침
      await fetchWishlist()
      return true
    } catch (err) {
      console.error('Failed to add to wishlist:', err)
      return false
    }
  }

  const removeFromWishlist = async (missionId: string): Promise<boolean> => {
    if (!userId) return false

    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          missionId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove from wishlist')
      }

      // 위시리스트 새로고침
      await fetchWishlist()
      return true
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
      return false
    }
  }

  const isInWishlist = (missionId: string): boolean => {
    return wishlist.some(item => item.missions.id === missionId)
  }

  const refreshWishlist = async () => {
    await fetchWishlist()
  }

  useEffect(() => {
    fetchWishlist()
  }, [userId])

  return {
    wishlist,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist
  }
}







