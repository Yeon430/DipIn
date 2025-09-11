import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore'

// GET /api/firebase/wishlist?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Firestore에서 사용자의 위시리스트 가져오기
    const wishlistRef = collection(db, 'wishlist')
    const q = query(wishlistRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    
    const wishlistItems = []
    console.log('📋 Raw wishlist docs:', querySnapshot.docs.length)
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data()
      console.log('📄 Wishlist item data:', { 
        id: docSnapshot.id, 
        data,
        projectId: data.projectId,
        userId: data.userId
      })
      
      // 프로젝트 정보도 함께 가져오기
      const projectRef = doc(db, 'projects', data.projectId)
      const projectDoc = await getDoc(projectRef)
      
      if (projectDoc.exists()) {
        const projectData = projectDoc.data()
        const wishlistItem = {
          id: docSnapshot.id,
          projectId: data.projectId,
          userId: data.userId,
          addedAt: data.addedAt,
          project: projectData
        }
        console.log('✅ Added wishlist item:', { 
          projectId: wishlistItem.projectId, 
          userId: wishlistItem.userId,
          projectTitle: projectData?.title || 'No title',
          projectExists: true
        })
        wishlistItems.push(wishlistItem)
      } else {
        console.log('❌ Project not found in Firestore:', { 
          projectId: data.projectId,
          userId: data.userId,
          addedAt: data.addedAt
        })
        // 프로젝트가 없어도 위시리스트 아이템은 추가
        const wishlistItem = {
          id: docSnapshot.id,
          projectId: data.projectId,
          userId: data.userId,
          addedAt: data.addedAt,
          project: null
        }
        wishlistItems.push(wishlistItem)
      }
    }

    console.log('📤 Returning wishlist:', { 
      count: wishlistItems.length, 
      projectIds: wishlistItems.map(item => item.projectId),
      allProjectIds: wishlistItems.map(item => `"${item.projectId}"`).join(', '),
      items: wishlistItems.map(item => ({ id: item.id, projectId: item.projectId, userId: item.userId }))
    })
    
    return NextResponse.json({ wishlist: wishlistItems })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

// POST /api/firebase/wishlist
export async function POST(request: NextRequest) {
  try {
    const { userId, projectId } = await request.json()
    console.log('📡 Wishlist POST API called:', { userId, projectId })

    if (!userId || !projectId) {
      console.log('❌ Missing required fields')
      return NextResponse.json({ error: 'User ID and Project ID are required' }, { status: 400 })
    }

    // 중복 확인
    const wishlistRef = collection(db, 'wishlist')
    const q = query(wishlistRef, where('userId', '==', userId), where('projectId', '==', projectId))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      console.log('⚠️ Project already in wishlist:', { userId, projectId })
      return NextResponse.json({ 
        error: 'Project already in wishlist',
        success: false,
        message: 'This project is already in your wishlist'
      }, { status: 409 }) // 409 Conflict status code
    }

    // 위시리스트에 추가
    const newWishlistRef = doc(collection(db, 'wishlist'))
    await setDoc(newWishlistRef, {
      userId,
      projectId,
      addedAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      id: newWishlistRef.id,
      message: 'Project added to wishlist' 
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 })
  }
}

// DELETE /api/firebase/wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { userId, projectId } = await request.json()

    if (!userId || !projectId) {
      return NextResponse.json({ error: 'User ID and Project ID are required' }, { status: 400 })
    }

    // 위시리스트에서 제거
    const wishlistRef = collection(db, 'wishlist')
    const q = query(wishlistRef, where('userId', '==', userId), where('projectId', '==', projectId))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Project not found in wishlist' }, { status: 404 })
    }

    // 첫 번째 매칭 문서 삭제
    const docToDelete = querySnapshot.docs[0]
    await deleteDoc(docToDelete.ref)

    return NextResponse.json({ 
      success: true, 
      message: 'Project removed from wishlist' 
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
  }
}



