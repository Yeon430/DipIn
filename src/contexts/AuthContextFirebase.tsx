'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface UserProfile {
  id: string
  name: string
  email: string
  major?: string
  grade?: string
  interests?: string[]
  goal?: string
  createdAt?: string
}

interface AuthContextType {
  user: UserProfile | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<boolean>
  signup: (userData: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Firebase 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 사용자 프로필 가져오기
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              id: firebaseUser.uid,
              name: userData.name,
              email: userData.email,
              major: userData.major,
              grade: userData.grade,
              interests: userData.interests,
              goal: userData.goal,
              createdAt: userData.createdAt
            })
          } else {
            // 기본 사용자 정보 설정
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              major: '',
              grade: '',
              interests: [],
              goal: ''
            })
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            major: '',
            grade: '',
            interests: [],
            goal: ''
          })
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting Firebase login...', { email })
      await signInWithEmailAndPassword(auth, email, password)
      console.log('Firebase login successful')
      return true
    } catch (error) {
      console.error('Firebase login failed:', error)
      return false
    }
  }

  const signup = async (userData: any): Promise<boolean> => {
    try {
      console.log('Starting Firebase signup process...', { email: userData.email, name: userData.name })
      
      // Firebase Auth로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const firebaseUser = userCredential.user
      
      console.log('Firebase Auth signup successful:', firebaseUser.uid)
      
      // Firestore에 사용자 프로필 저장
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          name: userData.name,
          email: userData.email,
          major: userData.major,
          grade: userData.grade,
          interests: userData.interests,
          goal: userData.goal,
          createdAt: new Date().toISOString()
        })
        console.log('Firestore profile created successfully')
      } catch (firestoreError) {
        console.error('Firestore profile creation failed:', firestoreError)
        // Firestore 저장 실패해도 Auth는 성공으로 처리
      }
      
      return true
    } catch (error) {
      console.error('Firebase signup failed:', error)
      return false
    }
  }

  const logout = async (): Promise<boolean> => {
    try {
      console.log('Logging out...')
      await signOut(auth)
      console.log('Firebase logout successful')
      return true
    } catch (error) {
      console.error('Firebase logout failed:', error)
      return false
    }
  }

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout,
    signup
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}










