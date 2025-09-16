import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/reviews/[reviewId]/helpful - 후기 도움됨 표시/해제
export async function POST(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { reviewId } = params
    const { userId, isHelpful } = await request.json()

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 })
    }

    // 후기 존재 확인
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('id, helpful_count')
      .eq('id', reviewId)
      .single()

    if (reviewError || !review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // 기존 도움됨 기록 확인
    const { data: existingHelpful, error: existingError } = await supabase
      .from('review_helpful')
      .select('id, is_helpful')
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .single()

    if (existingError && existingError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Failed to check existing helpful status' }, { status: 500 })
    }

    let newHelpfulCount = review.helpful_count

    if (existingHelpful) {
      // 기존 기록이 있는 경우
      if (existingHelpful.is_helpful === isHelpful) {
        // 같은 상태로 다시 클릭한 경우 - 기록 삭제
        const { error: deleteError } = await supabase
          .from('review_helpful')
          .delete()
          .eq('id', existingHelpful.id)

        if (deleteError) {
          return NextResponse.json({ error: 'Failed to remove helpful status' }, { status: 500 })
        }

        // 카운트 조정
        newHelpfulCount = isHelpful ? newHelpfulCount - 1 : newHelpfulCount + 1
      } else {
        // 다른 상태로 변경한 경우 - 업데이트
        const { error: updateError } = await supabase
          .from('review_helpful')
          .update({ is_helpful: isHelpful })
          .eq('id', existingHelpful.id)

        if (updateError) {
          return NextResponse.json({ error: 'Failed to update helpful status' }, { status: 500 })
        }

        // 카운트 조정
        newHelpfulCount = isHelpful ? newHelpfulCount + 2 : newHelpfulCount - 2
      }
    } else {
      // 새로운 기록 생성
      const { error: insertError } = await supabase
        .from('review_helpful')
        .insert({
          review_id: reviewId,
          user_id: userId,
          is_helpful: isHelpful
        })

      if (insertError) {
        return NextResponse.json({ error: 'Failed to create helpful status' }, { status: 500 })
      }

      // 카운트 조정
      newHelpfulCount = isHelpful ? newHelpfulCount + 1 : newHelpfulCount - 1
    }

    // 후기 도움됨 카운트 업데이트
    const { error: updateCountError } = await supabase
      .from('reviews')
      .update({ helpful_count: newHelpfulCount })
      .eq('id', reviewId)

    if (updateCountError) {
      return NextResponse.json({ error: 'Failed to update helpful count' }, { status: 500 })
    }

    return NextResponse.json({
      helpfulCount: newHelpfulCount,
      isHelpful,
      message: isHelpful ? 'Marked as helpful' : 'Marked as not helpful'
    })

  } catch (error) {
    console.error('Review helpful error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/reviews/[reviewId]/helpful - 사용자의 도움됨 상태 확인
export async function GET(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { reviewId } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 })
    }

    // 사용자의 도움됨 상태 확인
    const { data: helpful, error: helpfulError } = await supabase
      .from('review_helpful')
      .select('is_helpful')
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .single()

    if (helpfulError && helpfulError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Failed to check helpful status' }, { status: 500 })
    }

    return NextResponse.json({
      isHelpful: helpful?.is_helpful || false,
      hasVoted: !!helpful
    })

  } catch (error) {
    console.error('Review helpful GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}












