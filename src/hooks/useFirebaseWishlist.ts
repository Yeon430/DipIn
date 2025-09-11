'use client'

import { useState, useEffect } from 'react'

interface WishlistItem {
  id: string
  projectId: string
  userId: string
  addedAt: string
  project?: any
}

export function useFirebaseWishlist(userId?: string) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchWishlist()
    }
  }, [userId])

  const fetchWishlist = async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/firebase/wishlist?userId=${userId}`)
      const data = await response.json()

      if (!response.ok) {
        // 오프라인 상태이거나 네트워크 에러인 경우 로컬 스토리지에서 가져오기
        if (data.error?.includes('offline') || data.error?.includes('Failed to get document')) {
          console.log('📱 Offline mode: Loading from local storage')
          const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
          const userWishlist = localWishlist.filter((item: any) => item.userId === userId)
          setWishlist(userWishlist)
          return
        }
        throw new Error(data.error || 'Failed to fetch wishlist')
      }

      const wishlistData = data.wishlist || []
      console.log('📥 Fetched wishlist:', { count: wishlistData.length, items: wishlistData.map(item => item.projectId) })
      setWishlist(wishlistData)
    } catch (err) {
      // 네트워크 에러 시 로컬 스토리지에서 가져오기
      console.log('📱 Network error: Loading from local storage')
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      const userWishlist = localWishlist.filter((item: any) => item.userId === userId)
      setWishlist(userWishlist)
      setError(null) // 오프라인 모드에서는 에러로 처리하지 않음
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (projectId: string) => {
    console.log('🚀 addToWishlist called:', { projectId, userId })
    
    if (!userId) {
      console.log('❌ No user ID for wishlist')
      return
    }

    // 이미 위시리스트에 있는지 먼저 확인
    if (isInWishlist(projectId)) {
      console.log('⚠️ Project already in wishlist, skipping...')
      return
    }

    console.log('➕ Adding to wishlist:', { projectId, userId })

    try {
      const response = await fetch('/api/firebase/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          userId
        })
      })

      const data = await response.json()
      console.log('📡 Wishlist API response:', { status: response.status, data })

      if (!response.ok) {
        // 이미 위시리스트에 있는 경우 에러로 처리하지 않음
        if (data.error?.includes('Project already in wishlist') || response.status === 409) {
          console.log('⚠️ Project already in wishlist, refreshing state...')
          // 위시리스트 상태를 강제로 새로고침
          await fetchWishlist()
          // 로컬 상태도 즉시 업데이트
          const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
          const userWishlist = localWishlist.filter((item: any) => item.userId === userId)
          setWishlist(userWishlist)
          return
        }
        
        // 오프라인 상태이거나 네트워크 에러인 경우 로컬 스토리지에 저장
        if (data.error?.includes('offline') || data.error?.includes('Failed to get document')) {
          console.log('📱 Offline mode: Saving to local storage')
          const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
          const newItem = { 
            id: `local_${Date.now()}`, 
            projectId, 
            userId, 
            addedAt: new Date().toISOString() 
          }
          localWishlist.push(newItem)
          localStorage.setItem('wishlist', JSON.stringify(localWishlist))
          setWishlist(prev => [...prev, newItem])
          return
        }
        throw new Error(data.error || 'Failed to add to wishlist')
      }

      console.log('✅ Successfully added to wishlist, refreshing...')
      // 위시리스트 새로고침
      await fetchWishlist()
    } catch (error) {
      console.error('❌ Failed to add to wishlist:', error)
      // 네트워크 에러 시 로컬 스토리지에 저장
      console.log('📱 Network error: Saving to local storage')
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      const newItem = { 
        id: `local_${Date.now()}`, 
        projectId, 
        userId, 
        addedAt: new Date().toISOString() 
      }
      localWishlist.push(newItem)
      localStorage.setItem('wishlist', JSON.stringify(localWishlist))
      setWishlist(prev => [...prev, newItem])
    }
  }

  const removeFromWishlist = async (projectId: string) => {
    if (!userId) return

    try {
      const response = await fetch('/api/firebase/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          userId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove from wishlist')
      }

      // 위시리스트 새로고침
      await fetchWishlist()
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      throw error
    }
  }

  const isInWishlist = (projectId: string) => {
    const result = wishlist.some(item => item.projectId === projectId)
    console.log('🔍 isInWishlist check:', { 
      projectId, 
      result, 
      wishlistCount: wishlist.length,
      wishlistProjectIds: wishlist.map(item => item.projectId),
      exactMatch: wishlist.filter(item => item.projectId === projectId),
      allProjectIds: wishlist.map(item => `"${item.projectId}"`).join(', '),
      // 디버깅을 위한 상세 비교
      comparison: wishlist.map(item => ({
        stored: item.projectId,
        lookingFor: projectId,
        match: item.projectId === projectId,
        length: { stored: item.projectId.length, lookingFor: projectId.length }
      }))
    })
    return result
  }

  const checkWishlistStatus = async (projectId: string) => {
    if (!userId) return false

    try {
      const response = await fetch(`/api/firebase/wishlist/check?userId=${userId}&projectId=${projectId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check wishlist status')
      }

      return data.isInWishlist
    } catch (error) {
      console.error('Failed to check wishlist status:', error)
      return false
    }
  }

  return {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    checkWishlistStatus,
    refetch: fetchWishlist
  }
}
