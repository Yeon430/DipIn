import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// GET /api/firebase/projects?projectId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Firestore에서 프로젝트 가져오기
    const projectRef = doc(db, 'projects', projectId)
    const projectDoc = await getDoc(projectRef)
    
    if (!projectDoc.exists()) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project: projectDoc.data() })
  } catch (error: any) {
    console.error('Error fetching project:', error)
    
    // 오프라인 상태이거나 네트워크 에러인 경우
    if (error.code === 'unavailable' || 
        error.message?.includes('offline') ||
        error.message?.includes('Failed to get document')) {
      return NextResponse.json({ error: 'Offline mode - project data unavailable' }, { status: 503 })
    }
    
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

// POST /api/firebase/projects
export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json()

    if (!projectData.id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Firestore에 프로젝트 저장
    const projectRef = doc(db, 'projects', projectData.id)
    await setDoc(projectRef, {
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      id: projectData.id,
      message: 'Project saved successfully' 
    })
  } catch (error: any) {
    console.error('Error saving project:', error)
    
    // 오프라인 상태이거나 네트워크 에러인 경우
    if (error.code === 'unavailable' || 
        error.message?.includes('offline') ||
        error.message?.includes('Failed to get document')) {
      return NextResponse.json({ error: 'Offline mode - project not saved' }, { status: 503 })
    }
    
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 })
  }
}




