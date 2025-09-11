import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/wishlist?userId=... - 사용자의 위시리스트 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // 위시리스트 조회 (프로젝트 정보 포함)
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlist')
      .select(`
        id,
        created_at,
        projects!inner(
          id,
          title,
          description,
          category,
          difficulty,
          duration,
          price,
          rating,
          review_count,
          thumbnail,
          creator!inner(name, avatar)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (wishlistError) {
      return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
    }

    return NextResponse.json({
      wishlist: wishlist || [],
      count: wishlist?.length || 0
    })

  } catch (error) {
    console.error('Wishlist GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/wishlist - 위시리스트에 프로젝트 추가
export async function POST(request: NextRequest) {
  try {
    const { userId, missionId } = await request.json()

    if (!userId || !missionId) {
      return NextResponse.json({ 
        error: 'User ID and Project ID are required' 
      }, { status: 400 })
    }

    // 프로젝트 존재 확인
    const { data: mission, error: missionError } = await supabase
      .from('projects')
      .select('id, title')
      .eq('id', missionId)
      .single()

    if (missionError || !mission) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // 이미 위시리스트에 있는지 확인
    const { data: existingItem, error: existingError } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('mission_id', missionId)
      .single()

    if (existingItem) {
      return NextResponse.json({ 
        error: 'Project already in wishlist' 
      }, { status: 409 })
    }

    // 위시리스트에 추가
    const { data: newItem, error: addError } = await supabase
      .from('wishlist')
      .insert({
        user_id: userId,
        mission_id: missionId
      })
      .select(`
        id,
        created_at,
        projects!inner(
          id,
          title,
          description,
          category,
          difficulty,
          duration,
          price,
          rating,
          review_count,
          thumbnail,
          creator!inner(name, avatar)
        )
      `)
      .single()

    if (addError) {
      return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 })
    }

    return NextResponse.json({
      item: newItem,
      message: 'Project added to wishlist successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Wishlist POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/wishlist - 위시리스트에서 프로젝트 제거
export async function DELETE(request: NextRequest) {
  try {
    const { userId, missionId } = await request.json()

    if (!userId || !missionId) {
      return NextResponse.json({ 
        error: 'User ID and Project ID are required' 
      }, { status: 400 })
    }

    // 위시리스트에서 제거
    const { error: deleteError } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('mission_id', missionId)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Project removed from wishlist successfully'
    })

  } catch (error) {
    console.error('Wishlist DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
