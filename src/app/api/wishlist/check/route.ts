import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/wishlist/check?userId=...&missionId=... - 위시리스트 상태 확인
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const missionId = searchParams.get('missionId')

    if (!userId || !missionId) {
      return NextResponse.json({ 
        error: 'User ID and Project ID are required' 
      }, { status: 400 })
    }

    // 위시리스트 상태 확인
    const { data: wishlistItem, error: wishlistError } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('mission_id', missionId)
      .single()

    if (wishlistError && wishlistError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Failed to check wishlist status' }, { status: 500 })
    }

    return NextResponse.json({
      isInWishlist: !!wishlistItem,
      wishlistId: wishlistItem?.id || null
    })

  } catch (error) {
    console.error('Wishlist check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
