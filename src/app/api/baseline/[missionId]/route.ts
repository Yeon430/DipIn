import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  try {
    const { missionId } = params

    // Get mission details first
    const { data: mission, error: missionError } = await supabase
      .from('missions')
      .select('id, difficulty, category, duration_min')
      .eq('id', missionId)
      .single()

    if (missionError || !mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 })
    }

    // Get submissions from last 30 days for this specific mission
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: missionSubmissions, error: missionSubmissionsError } = await supabase
      .from('user_progress')
      .select('score, time_minutes, completed, created_at')
      .eq('mission_id', missionId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })

    if (missionSubmissionsError) {
      return NextResponse.json({ error: 'Failed to fetch mission submissions' }, { status: 500 })
    }

    // If we have enough submissions for this mission, return real baseline
    if (missionSubmissions && missionSubmissions.length >= 30) {
      const baseline = calculateRealBaseline(missionSubmissions)
      return NextResponse.json({
        type: 'real',
        ...baseline
      })
    }

    // Check if we have enough submissions in the same category and difficulty
    const { data: categorySubmissions, error: categorySubmissionsError } = await supabase
      .from('user_progress')
      .select(`
        score, 
        time_minutes, 
        completed, 
        created_at,
        missions!inner(difficulty, category)
      `)
      .eq('missions.category', mission.category)
      .eq('missions.difficulty', mission.difficulty)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })

    if (categorySubmissionsError) {
      return NextResponse.json({ error: 'Failed to fetch category submissions' }, { status: 500 })
    }

    // If we have enough category submissions, return category baseline
    if (categorySubmissions && categorySubmissions.length >= 30) {
      const baseline = calculateRealBaseline(categorySubmissions)
      return NextResponse.json({
        type: 'category',
        ...baseline
      })
    }

    // No sufficient data available
    return NextResponse.json({ error: 'Insufficient data' }, { status: 404 })

  } catch (error) {
    console.error('Baseline API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateRealBaseline(submissions: any[]) {
  const completedSubmissions = submissions.filter(s => s.completed)
  const n = submissions.length
  const completionRate = completedSubmissions.length / n

  // Calculate score percentiles
  const scores = completedSubmissions.map(s => s.score).sort((a, b) => a - b)
  const scorePercentiles = {
    p25: calculatePercentile(scores, 0.25),
    p50: calculatePercentile(scores, 0.50),
    p75: calculatePercentile(scores, 0.75)
  }

  // Calculate time percentiles (only for completed submissions)
  const times = completedSubmissions.map(s => s.time_minutes).sort((a, b) => a - b)
  const timePercentiles = {
    p25: calculatePercentile(times, 0.25),
    p50: calculatePercentile(times, 0.50),
    p75: calculatePercentile(times, 0.75)
  }

  return {
    n,
    completionRate,
    scorePercentiles,
    timePercentiles
  }
}

function calculatePercentile(sortedArray: number[], percentile: number): number {
  if (sortedArray.length === 0) return 0
  
  const index = (percentile * (sortedArray.length - 1))
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index % 1

  if (upper >= sortedArray.length) return sortedArray[sortedArray.length - 1]
  if (lower === upper) return sortedArray[lower]

  return Math.round(sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight)
}

// POST endpoint to calculate user's percentile for a specific mission
export async function POST(
  request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  try {
    const { missionId } = params
    const { score, timeMinutes, completed } = await request.json()

    if (!completed) {
      return NextResponse.json({
        scorePercentile: 0,
        timePercentile: 0
      })
    }

    // Get all completed submissions for this mission from last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: submissions, error } = await supabase
      .from('user_progress')
      .select('score, time_minutes')
      .eq('mission_id', missionId)
      .eq('completed', true)
      .gte('created_at', thirtyDaysAgo.toISOString())

    if (error || !submissions || submissions.length === 0) {
      return NextResponse.json({
        scorePercentile: 50, // Default to median if no data
        timePercentile: 50
      })
    }

    // Calculate percentiles
    const scores = submissions.map(s => s.score).sort((a, b) => a - b)
    const times = submissions.map(s => s.time_minutes).sort((a, b) => a - b)

    const scorePercentile = calculateUserPercentile(score, scores)
    const timePercentile = calculateUserPercentile(timeMinutes, times)

    return NextResponse.json({
      scorePercentile,
      timePercentile
    })

  } catch (error) {
    console.error('Percentile calculation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateUserPercentile(userValue: number, sortedArray: number[]): number {
  if (sortedArray.length === 0) return 50

  let countBelow = 0
  for (const value of sortedArray) {
    if (value < userValue) countBelow++
    else break
  }

  return Math.round((countBelow / sortedArray.length) * 100)
}