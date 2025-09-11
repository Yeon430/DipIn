import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/reviews?missionId=... - 프로젝트별 후기 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const missionId = searchParams.get('missionId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    if (!missionId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
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

    // 후기 조회
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        helpful_count,
        created_at,
        user_id,
        user_profiles!inner(name, avatar)
      `)
      .eq('mission_id', missionId)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * limit, page * limit - 1)

    if (reviewsError) {
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    // 전체 후기 수와 평균 평점 조회
    const { count: totalReviews, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('mission_id', missionId)

    const { data: avgRating, error: avgError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('mission_id', missionId)

    if (countError || avgError) {
      return NextResponse.json({ error: 'Failed to fetch review statistics' }, { status: 500 })
    }

    const averageRating = avgRating && avgRating.length > 0 
      ? avgRating.reduce((sum, review) => sum + review.rating, 0) / avgRating.length 
      : 0

    // 평점 분포 조회
    const { data: ratingDistribution, error: distributionError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('mission_id', missionId)

    if (distributionError) {
      return NextResponse.json({ error: 'Failed to fetch rating distribution' }, { status: 500 })
    }

    const distribution = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: ratingDistribution?.filter(r => r.rating === star).length || 0
    }))

    return NextResponse.json({
      reviews: reviews || [],
      pagination: {
        page,
        limit,
        total: totalReviews || 0,
        totalPages: Math.ceil((totalReviews || 0) / limit)
      },
      statistics: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: totalReviews || 0,
        distribution
      }
    })

  } catch (error) {
    console.error('Reviews GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/reviews - 새 후기 작성
export async function POST(request: NextRequest) {
  try {
    const { missionId, rating, comment, userId } = await request.json()

    if (!missionId || !rating || !userId) {
      return NextResponse.json({ 
        error: 'Project ID, rating, and user ID are required' 
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ 
        error: 'Rating must be between 1 and 5' 
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

    // 사용자 존재 확인
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('id, name')
      .eq('user_id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 이미 해당 프로젝트에 후기를 작성했는지 확인
    const { data: existingReview, error: existingError } = await supabase
      .from('reviews')
      .select('id')
      .eq('mission_id', missionId)
      .eq('user_id', userId)
      .single()

    if (existingReview) {
      return NextResponse.json({ 
        error: 'You have already reviewed this mission' 
      }, { status: 409 })
    }

    // 후기 작성
    const { data: newReview, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        mission_id: missionId,
        user_id: userId,
        rating,
        comment: comment || '',
        helpful_count: 0
      })
      .select(`
        id,
        rating,
        comment,
        helpful_count,
        created_at,
        user_id,
        user_profiles!inner(name, avatar)
      `)
      .single()

    if (reviewError) {
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
    }

    return NextResponse.json({
      review: newReview,
      message: 'Review created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Reviews POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
