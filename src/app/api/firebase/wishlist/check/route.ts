import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

// GET /api/firebase/wishlist/check?userId=xxx&projectId=yyy
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const projectId = searchParams.get('projectId')

    if (!userId || !projectId) {
      return NextResponse.json({ error: 'User ID and Project ID are required' }, { status: 400 })
    }

    // 위시리스트에 있는지 확인
    const wishlistRef = collection(db, 'wishlist')
    const q = query(wishlistRef, where('userId', '==', userId), where('projectId', '==', projectId))
    const querySnapshot = await getDocs(q)

    return NextResponse.json({ 
      isInWishlist: !querySnapshot.empty 
    })
  } catch (error) {
    console.error('Error checking wishlist status:', error)
    return NextResponse.json({ error: 'Failed to check wishlist status' }, { status: 500 })
  }
}









