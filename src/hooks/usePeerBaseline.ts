import { useState, useEffect } from 'react'

interface Submission {
  score: number
  timeMinutes: number
  completed: boolean
  createdAt: string
}

interface BaselineData {
  type: 'design' | 'real' | 'category'
  n: number
  completionRate: number
  scorePercentiles: {
    p25: number
    p50: number
    p75: number
  }
  timePercentiles: {
    p25: number
    p50: number
    p75: number
  }
  myScorePercentile?: number
  myTimePercentile?: number
}

export function usePeerBaseline(missionId: string, mySubmission?: Submission) {
  const [baseline, setBaseline] = useState<BaselineData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBaseline()
  }, [missionId])

  const fetchBaseline = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/baseline/${missionId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          // No sufficient data, will fall back to design baseline
          setBaseline(null)
          return
        }
        throw new Error('Failed to fetch baseline data')
      }

      const data = await response.json()
      setBaseline(data)

      // If we have a user submission, calculate percentiles
      if (mySubmission && mySubmission.completed) {
        await calculateUserPercentiles(data, mySubmission)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const calculateUserPercentiles = async (baselineData: BaselineData, submission: Submission) => {
    try {
      const response = await fetch(`/api/baseline/${missionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: submission.score,
          timeMinutes: submission.timeMinutes,
          completed: submission.completed
        })
      })

      if (response.ok) {
        const percentiles = await response.json()
        setBaseline(prev => prev ? {
          ...prev,
          myScorePercentile: percentiles.scorePercentile,
          myTimePercentile: percentiles.timePercentile
        } : null)
      }
    } catch (err) {
      console.error('Failed to calculate user percentiles:', err)
    }
  }

  const refreshBaseline = () => {
    fetchBaseline()
  }

  return {
    baseline,
    loading,
    error,
    refreshBaseline
  }
}







