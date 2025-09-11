import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore'

// GET /api/firebase/reviews?projectId=xxx&page=1&limit=10&sortBy=created_at&sortOrder=desc
export async function GET(request: NextRequest) {
  console.log('🚀 API Route called!')
  
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const page = parseInt(searchParams.get('page') || '1')
    const limitCount = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    console.log('📡 Fetching reviews for project:', projectId)
    console.log('📡 Request URL:', request.url)

    if (!projectId) {
      console.log('❌ No project ID provided')
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Firebase 연결 상태 확인
    try {
      console.log('🔍 Testing Firebase connection...')
      const testRef = collection(db, 'reviews')
      const testQuery = query(testRef, limit(1))
      await getDocs(testQuery)
      console.log('✅ Firebase connection successful')
    } catch (firebaseError) {
      console.error('❌ Firebase connection failed:', firebaseError)
      console.error('❌ Firebase error details:', {
        code: (firebaseError as any)?.code,
        message: (firebaseError as any)?.message,
        stack: (firebaseError as any)?.stack
      })
      return NextResponse.json({ 
        error: 'Firebase connection failed',
        details: firebaseError instanceof Error ? firebaseError.message : 'Unknown Firebase error',
        code: (firebaseError as any)?.code || 'UNKNOWN'
      }, { status: 500 })
    }

    // 후기 가져오기 (인덱스 생성 완료 후 원래 쿼리로 복원)
    const reviewsRef = collection(db, 'reviews')
    let q = query(
      reviewsRef, 
      where('projectId', '==', projectId),
      orderBy(sortBy, sortOrder as 'asc' | 'desc'),
      limit(limitCount)
    )

    console.log('🔍 Querying reviews with:', { projectId, sortBy, sortOrder, limitCount })
    const querySnapshot = await getDocs(q)
    console.log('📊 Found reviews:', querySnapshot.docs.length)
    const reviews = []
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data()
      console.log('📝 Processing review:', { id: docSnapshot.id, userId: data.userId })
      
      // 사용자 정보 가져오기 (user_profiles 컬렉션에서)
      try {
        const userRef = doc(db, 'user_profiles', data.userId)
        const userDoc = await getDoc(userRef)
        
        let userProfile = {
          name: 'Anonymous',
          avatar: '👤'
        }
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          userProfile = {
            name: userData.name || 'Anonymous',
            avatar: userData.avatar || '👤'
          }
          console.log('👤 Found user profile:', userProfile)
        } else {
          console.log('👤 User profile not found, using default')
        }
        
        reviews.push({
          id: docSnapshot.id,
          projectId: data.projectId,
          userId: data.userId,
          rating: data.rating,
          comment: data.comment,
          helpful_count: data.helpful_count || 0,
          created_at: data.created_at,
          user_profiles: userProfile
        })
      } catch (userError) {
        console.error('❌ Error fetching user profile:', userError)
        // 사용자 프로필 가져오기 실패해도 리뷰는 표시
        reviews.push({
          id: docSnapshot.id,
          projectId: data.projectId,
          userId: data.userId,
          rating: data.rating,
          comment: data.comment,
          helpful_count: data.helpful_count || 0,
          created_at: data.created_at,
          user_profiles: {
            name: 'Anonymous',
            avatar: '👤'
          }
        })
      }
    }

    // 통계 계산
    const allReviewsQuery = query(reviewsRef, where('projectId', '==', projectId))
    const allReviewsSnapshot = await getDocs(allReviewsQuery)
    const allReviews = allReviewsSnapshot.docs.map(doc => doc.data())
    
    const totalReviews = allReviews.length
    const averageRating = totalReviews > 0 
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0
    
    const distribution = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: allReviews.filter(review => review.rating === star).length
    }))

    // 클라이언트에서 정렬
    reviews.sort((a, b) => {
      if (sortBy === 'created_at') {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      } else if (sortBy === 'rating') {
        return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating
      } else if (sortBy === 'helpful_count') {
        return sortOrder === 'desc' ? b.helpful_count - a.helpful_count : a.helpful_count - b.helpful_count
      }
      return 0
    })

    console.log('✅ Successfully fetched reviews:', { 
      count: reviews.length, 
      totalReviews, 
      averageRating: Math.round(averageRating * 10) / 10 
    })

    return NextResponse.json({
      reviews,
      statistics: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        distribution
      },
      pagination: {
        page,
        limit: limitCount,
        totalPages: Math.ceil(totalReviews / limitCount)
      }
    })
  } catch (error) {
    console.error('❌ Error fetching reviews:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json({ 
      error: 'Failed to fetch reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/firebase/reviews
export async function POST(request: NextRequest) {
  try {
    const { projectId, userId, rating, comment } = await request.json()

    if (!projectId || !userId || !rating || !comment) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // 중복 리뷰 확인
    const reviewsRef = collection(db, 'reviews')
    const q = query(reviewsRef, where('projectId', '==', projectId), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      return NextResponse.json({ error: 'You have already reviewed this project' }, { status: 400 })
    }

    // 새 리뷰 생성
    const newReviewRef = doc(collection(db, 'reviews'))
    await setDoc(newReviewRef, {
      projectId,
      userId,
      rating: parseInt(rating),
      comment,
      helpful_count: 0,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      id: newReviewRef.id,
      message: 'Review submitted successfully' 
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}


