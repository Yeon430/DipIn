import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 타입 정의
export interface User {
  id: string
  email: string
  name: string
  major?: string
  grade?: string
  interests?: string[]
  goal?: string
  created_at: string
  updated_at: string
}

export interface Mission {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'E' | 'M' | 'H'
  duration: number // 분 단위
  rating: number
  review_count: number
  thumbnail_url?: string
  evaluation_type: 'CODE' | 'NUMERIC' | 'TEXT'
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  mission_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  score?: number
  feedback?: string
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}












