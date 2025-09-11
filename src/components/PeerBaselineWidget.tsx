'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Clock, Award, AlertCircle, Database, BarChart3 } from 'lucide-react'
import { usePeerBaseline } from '@/hooks/usePeerBaseline'

interface Scene {
  id: string
  type: 'CODE' | 'SQL' | 'NUMERIC' | 'BRANCH' | 'SHORT_TEXT' | 'MCQ' | 'INFO'
  weight?: number
}

interface Mission {
  id: string
  title: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  durationMin: number
  category: string
  scenes: Scene[]
}

interface DesignBaseline {
  type: 'design'
  complexity: number
  scoreMean: number
  scoreStd: number
  timeMedian: number
  timeStd: number
  completionRate: number
  failureTypes: Record<string, number>
}

interface RealBaseline {
  type: 'real' | 'category'
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

interface PeerBaselineWidgetProps {
  mission: Mission
  mySubmission?: {
    score: number
    timeMinutes: number
    completed: boolean
  }
  className?: string
}

export default function PeerBaselineWidget({ 
  mission, 
  mySubmission, 
  className = '' 
}: PeerBaselineWidgetProps) {
  const { baseline, loading, error } = usePeerBaseline(mission.id, mySubmission)

  // Calculate design baseline as fallback
  const calculateDesignBaseline = (mission: Mission): DesignBaseline => {
    // Scene weights
    const sceneWeights = {
      'CODE': 1.2,
      'SQL': 1.2,
      'NUMERIC': 1.0,
      'BRANCH': 1.1,
      'SHORT_TEXT': 0.8,
      'MCQ': 0.6,
      'INFO': 0
    }

    // Calculate complexity
    const gradedScenes = mission.scenes.filter(scene => sceneWeights[scene.type] > 0)
    const avgWeight = gradedScenes.reduce((sum, scene) => sum + sceneWeights[scene.type], 0) / gradedScenes.length
    const complexity = avgWeight * gradedScenes.length

    // Score distribution
    const difficultyMeans = {
      'EASY': 80,
      'MEDIUM': 72,
      'HARD': 64
    }
    const scoreMean = Math.max(0, Math.min(100, difficultyMeans[mission.difficulty]))
    const scoreStd = 12

    // Time distribution
    const timeMedian = mission.durationMin
    const timeStd = 0.25 * mission.durationMin

    // Completion rate
    const difficultyPenalty = mission.difficulty === 'MEDIUM' ? 0.05 : mission.difficulty === 'HARD' ? 0.12 : 0
    const complexityPenalty = 0.02 * (complexity - 1)
    const baseCompletionRate = 0.86 - difficultyPenalty - complexityPenalty
    const completionRate = Math.max(0.30, Math.min(0.95, baseCompletionRate))

    // Failure type distribution
    const failureRate = 1 - completionRate
    const totalWeight = gradedScenes.reduce((sum, scene) => sum + sceneWeights[scene.type], 0)
    const failureTypes: Record<string, number> = {}
    
    gradedScenes.forEach(scene => {
      const weight = sceneWeights[scene.type]
      failureTypes[scene.type] = (weight / totalWeight) * failureRate
    })

    return {
      type: 'design',
      complexity,
      scoreMean,
      scoreStd,
      timeMedian,
      timeStd,
      completionRate,
      failureTypes
    }
  }

  const getBadgeInfo = () => {
    if (!baseline) {
      // Fallback to design baseline
      const designBaseline = calculateDesignBaseline(mission)
      return {
        text: '설계 기준선(콜드스타트) · N=0',
        variant: 'warning' as const
      }
    }

    if (baseline.type === 'design') {
      return {
        text: '설계 기준선(콜드스타트) · N=0',
        variant: 'warning' as const
      }
    } else if (baseline.type === 'real') {
      return {
        text: `최근 30일 동료 베이스라인 · N=${baseline.n}`,
        variant: 'success' as const
      }
    } else {
      return {
        text: `동일 카테고리 기준선 · N=${baseline.n}`,
        variant: 'info' as const
      }
    }
  }

  const getScoreStats = () => {
    const currentBaseline = baseline || calculateDesignBaseline(mission)
    
    if (currentBaseline.type === 'design') {
      const designBaseline = currentBaseline as DesignBaseline
      return {
        median: Math.round(designBaseline.scoreMean),
        p25: Math.round(designBaseline.scoreMean - 0.67 * designBaseline.scoreStd),
        p75: Math.round(designBaseline.scoreMean + 0.67 * designBaseline.scoreStd),
        myPercentile: mySubmission ? calculatePercentile(mySubmission.score, designBaseline.scoreMean, designBaseline.scoreStd) : undefined
      }
    } else {
      const realBaseline = currentBaseline as RealBaseline
      return {
        median: realBaseline.scorePercentiles.p50,
        p25: realBaseline.scorePercentiles.p25,
        p75: realBaseline.scorePercentiles.p75,
        myPercentile: realBaseline.myScorePercentile
      }
    }
  }

  const getTimeStats = () => {
    const currentBaseline = baseline || calculateDesignBaseline(mission)
    
    if (currentBaseline.type === 'design') {
      const designBaseline = currentBaseline as DesignBaseline
      return {
        median: Math.round(designBaseline.timeMedian),
        p25: Math.round(designBaseline.timeMedian * 0.8),
        p75: Math.round(designBaseline.timeMedian * 1.4),
        myPercentile: mySubmission ? calculateTimePercentile(mySubmission.timeMinutes, designBaseline.timeMedian, designBaseline.timeStd) : undefined
      }
    } else {
      const realBaseline = currentBaseline as RealBaseline
      return {
        median: realBaseline.timePercentiles.p50,
        p25: realBaseline.timePercentiles.p25,
        p75: realBaseline.timePercentiles.p75,
        myPercentile: realBaseline.myTimePercentile
      }
    }
  }

  const calculatePercentile = (value: number, mean: number, std: number): number => {
    // Normal distribution percentile calculation
    const z = (value - mean) / std
    return Math.round(Math.max(0, Math.min(100, 50 + (z * 20))))
  }

  const calculateTimePercentile = (value: number, median: number, std: number): number => {
    // Log-normal distribution approximation
    const logValue = Math.log(value)
    const logMedian = Math.log(median)
    const logStd = Math.log(1 + std / median)
    const z = (logValue - logMedian) / logStd
    return Math.round(Math.max(0, Math.min(100, 50 + (z * 20))))
  }

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 0.8) return 'text-green-600'
    if (rate >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return 'text-green-600'
    if (percentile >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-slate-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl border border-red-200 p-6 ${className}`}>
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Error loading baseline data</span>
        </div>
        <p className="text-sm text-red-500 mt-1">{error}</p>
      </div>
    )
  }

  if (!baseline) return null

  const badgeInfo = getBadgeInfo()
  const scoreStats = getScoreStats()
  const timeStats = getTimeStats()

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 ${className}`}>
      {/* Header with Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">동료 기준선</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          badgeInfo.variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          badgeInfo.variant === 'success' ? 'bg-green-100 text-green-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {badgeInfo.text}
        </div>
      </div>

      {/* Data Source Legend */}
      <div className="mb-6 p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          {(baseline || calculateDesignBaseline(mission)).type === 'design' ? (
            <>
              <Database className="w-4 h-4" />
              <span>프로젝트 설계 매개변수 및 난이도 모델링 기반</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              <span>{(baseline || calculateDesignBaseline(mission)).type === 'real' ? '최근 동료 제출물' : '동일 카테고리 제출물'} 기반</span>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Completion Rate */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">완료율</span>
          </div>
          <div className={`text-2xl font-bold ${getCompletionRateColor((baseline || calculateDesignBaseline(mission)).completionRate)}`}>
            {Math.round((baseline || calculateDesignBaseline(mission)).completionRate * 100)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {(baseline || calculateDesignBaseline(mission)).type === 'design' ? '추정치' : '실제값'}
          </div>
        </div>

        {/* Score Distribution */}
        {scoreStats && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">점수 분포</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {scoreStats.median}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              P25: {scoreStats.p25}% · P75: {scoreStats.p75}%
            </div>
            {scoreStats.myPercentile && (
              <div className={`text-sm font-medium mt-1 ${getPercentileColor(scoreStats.myPercentile)}`}>
                내 백분위: {scoreStats.myPercentile}%
              </div>
            )}
          </div>
        )}

        {/* Time Distribution */}
        {timeStats && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">시간 분포</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {timeStats.median}분
            </div>
            <div className="text-xs text-slate-500 mt-1">
              P25: {timeStats.p25}분 · P75: {timeStats.p75}분
            </div>
            {timeStats.myPercentile && (
              <div className={`text-sm font-medium mt-1 ${getPercentileColor(timeStats.myPercentile)}`}>
                내 백분위: {timeStats.myPercentile}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Additional Info for Design Baseline */}
      {(baseline || calculateDesignBaseline(mission)).type === 'design' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">콜드스타트 모드</p>
              <p>이 기준선은 프로젝트 설계 매개변수로 계산됩니다. 30명 이상의 동료가 이 프로젝트를 완료하면 더 정확한 비교를 위해 실제 동료 데이터로 전환됩니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
