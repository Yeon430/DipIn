'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { ChevronLeft, ChevronRight, BarChart3, TrendingUp, Database, Zap, CheckCircle, XCircle, RefreshCw, Download, Upload, FileText, Calculator, Brain } from 'lucide-react'

interface DataPoint {
  month: string
  sales: number
  profit: number
  customers: number
}

interface AnalysisResult {
  totalSales: number
  totalProfit: number
  averageMargin: number
  growthRate: number
  peakMonth: string
  correlation: string
  insights: string[]
}

interface Question {
  id: number
  question: string
  type: 'multiple' | 'numeric' | 'text'
  options?: string[]
  correctAnswer: string | number
  explanation: string
}

const sampleData: DataPoint[] = [
  { month: 'Jan', sales: 12000, profit: 2400, customers: 150 },
  { month: 'Feb', sales: 15000, profit: 3000, customers: 180 },
  { month: 'Mar', sales: 18000, profit: 3600, customers: 220 },
  { month: 'Apr', sales: 22000, profit: 4400, customers: 280 },
  { month: 'May', sales: 25000, profit: 5000, customers: 320 },
  { month: 'Jun', sales: 28000, profit: 5600, customers: 350 },
  { month: 'Jul', sales: 32000, profit: 6400, customers: 400 },
  { month: 'Aug', sales: 30000, profit: 6000, customers: 380 },
  { month: 'Sep', sales: 35000, profit: 7000, customers: 420 },
  { month: 'Oct', sales: 38000, profit: 7600, customers: 450 },
  { month: 'Nov', sales: 42000, profit: 8400, customers: 500 },
  { month: 'Dec', sales: 45000, profit: 9000, customers: 520 }
]

const correctAnalysis: AnalysisResult = {
  totalSales: 348000,
  totalProfit: 69600,
  averageMargin: 20,
  growthRate: 275,
  peakMonth: 'Dec',
  correlation: 'Positive correlation',
  insights: [
    'Sales show a consistent growth pattern throughout the year',
    'Strong positive correlation between customer count and sales growth',
    'December records the highest sales with year-end seasonal effects',
    'Stable profitability maintained at 20% average margin',
    'Q4 (Oct-Dec) shows the highest growth rate'
  ]
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the total sales? (Enter integer)",
    type: 'numeric',
    correctAnswer: 348000,
    explanation: "Sum of 12 months sales: $348,000"
  },
  {
    id: 2,
    question: "What is the average margin rate? (Enter integer, exclude %)",
    type: 'numeric',
    correctAnswer: 20,
    explanation: "Total profit ÷ Total sales × 100 = $69,600 ÷ $348,000 × 100 = 20%"
  },
  {
    id: 3,
    question: "What is the growth rate from January to December? (Enter integer, exclude %)",
    type: 'numeric',
    correctAnswer: 275,
    explanation: "From January $12,000 to December $45,000. Growth rate = (45,000 - 12,000) / 12,000 × 100 = 275%"
  },
  {
    id: 4,
    question: "Which month recorded the highest sales?",
    type: 'multiple',
    options: ['November', 'December', 'October', 'September'],
    correctAnswer: 'December',
    explanation: "December recorded the highest sales at $45,000."
  },
  {
    id: 5,
    question: "What is the relationship between customer count and sales?",
    type: 'multiple',
    options: ['Positive correlation', 'Negative correlation', 'No correlation', 'Uncertain'],
    correctAnswer: 'Positive correlation',
    explanation: "As customer count increases, sales also increase, showing a positive correlation."
  }
]

interface ChartBar {
  month: string
  height: number
}

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string | number }>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [userChart, setUserChart] = useState<ChartBar[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [userAnalysis, setUserAnalysis] = useState<Partial<AnalysisResult>>({})
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const steps = [
    {
      title: "Download Data",
      description: "Download the data to analyze",
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Download className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Data Analysis Project Start</h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Download raw data and analyze it like a real data analyst. 
            In this project, you'll analyze 12 months of sales data to derive business insights.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Project Overview</h4>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h5 className="font-semibold text-slate-900 mb-2">📊 Dataset</h5>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• 12 months of sales data</li>
                  <li>• Monthly profit and customer count</li>
                  <li>• Provided in CSV format</li>
                  <li>• Based on real business data</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 mb-2">🎯 Analysis Goals</h5>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Analyze sales trends</li>
                  <li>• Evaluate profitability</li>
                  <li>• Identify customer growth patterns</li>
                  <li>• Derive business insights</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Data Preview</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-2 px-3">Month</th>
                    <th className="text-right py-2 px-3">Sales ($)</th>
                    <th className="text-right py-2 px-3">Profit ($)</th>
                    <th className="text-right py-2 px-3">Customers</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.slice(0, 6).map((data) => (
                    <tr key={data.month} className="border-b">
                      <td className="py-2 px-3">{data.month}</td>
                      <td className="text-right py-2 px-3">${data.sales.toLocaleString()}</td>
                      <td className="text-right py-2 px-3">${data.profit.toLocaleString()}</td>
                      <td className="text-right py-2 px-3">{data.customers}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50">
                    <td className="py-2 px-3 text-slate-500">...</td>
                    <td className="text-right py-2 px-3 text-slate-500">...</td>
                    <td className="text-right py-2 px-3 text-slate-500">...</td>
                    <td className="text-right py-2 px-3 text-slate-500">...</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-2">* Download the CSV file containing all 12 months of data</p>
          </div>

          <button
            onClick={() => {
              const csvContent = "month,sales,profit,customers\n" + 
                sampleData.map(d => `${d.month},${d.sales},${d.profit},${d.customers}`).join('\n')
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'sales_data_2024.csv'
              a.click()
              window.URL.revokeObjectURL(url)
            }}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-3"
          >
            <Download className="w-6 h-6" />
            Download Data (CSV)
          </button>
        </div>
      )
    },
    {
      title: "Data Analysis & Processing",
      description: "Analyze the downloaded data and upload your results",
      content: (
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Data Analysis Steps</h3>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-semibold text-blue-900">Metrics to Analyze</h4>
                </div>
                <ul className="space-y-3 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">1.</span>
                    <div>
                      <strong>Total Sales:</strong> Sum of 12 months sales
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">2.</span>
                    <div>
                      <strong>Average Margin Rate:</strong> (Total Profit ÷ Total Sales) × 100
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">3.</span>
                    <div>
                      <strong>Growth Rate:</strong> January to December increase rate
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">4.</span>
                    <div>
                      <strong>Peak Sales Month:</strong> Month with highest sales
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">5.</span>
                    <div>
                      <strong>Correlation:</strong> Relationship between customer count and sales
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-green-600" />
                  <h4 className="text-lg font-semibold text-green-900">Recommended Tools</h4>
                </div>
                <div className="space-y-3 text-sm text-green-800">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">📊</span>
                    <span><strong>Excel:</strong> Use SUM, AVERAGE, MAX functions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🐍</span>
                    <span><strong>Python:</strong> pandas, numpy libraries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">📈</span>
                    <span><strong>R:</strong> dplyr, ggplot2 packages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🔢</span>
                    <span><strong>Calculator:</strong> Manual calculation is also possible</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Upload Analysis Results</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Once analysis is complete, upload your results. Excel, CSV, or text files are supported.
                </p>
                
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">
                    {uploadedFile ? uploadedFile.name : 'Select or drag a file'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls,.txt"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Select File
                  </button>
                </div>

                {uploadedFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">File uploaded successfully!</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-purple-900 mb-3">Manual Input Option</h4>
                <p className="text-sm text-purple-800 mb-4">
                  If file upload is difficult, you can manually enter your calculation results.
                </p>
                <button
                  onClick={() => {
                    console.log('Manual input button clicked, setting analysisComplete to true')
                    setAnalysisComplete(true)
                  }}
                  className="w-full bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                >
                  Enter Analysis Results Manually
                </button>
              </div>
            </div>
          </div>

          {/* Manual Input Form */}
          {analysisComplete && (
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Enter Your Analysis Results</h4>
              <p className="text-xs text-slate-500 mb-4">Debug: analysisComplete={analysisComplete.toString()}, currentStep={currentStep}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Total Sales ($)
                  </label>
                  <input
                    type="number"
                    value={userAnalysis.totalSales || ''}
                    onChange={(e) => setUserAnalysis(prev => ({ ...prev, totalSales: parseInt(e.target.value) || 0 }))}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter total sales"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Average Margin Rate (%)
                  </label>
                  <input
                    type="number"
                    value={userAnalysis.averageMargin || ''}
                    onChange={(e) => setUserAnalysis(prev => ({ ...prev, averageMargin: parseInt(e.target.value) || 0 }))}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter margin rate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Growth Rate (%)
                  </label>
                  <input
                    type="number"
                    value={userAnalysis.growthRate || ''}
                    onChange={(e) => setUserAnalysis(prev => ({ ...prev, growthRate: parseInt(e.target.value) || 0 }))}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter growth rate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Peak Sales Month
                  </label>
                  <select
                    value={userAnalysis.peakMonth || ''}
                    onChange={(e) => setUserAnalysis(prev => ({ ...prev, peakMonth: e.target.value }))}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select month</option>
                    {sampleData.map(data => (
                      <option key={data.month} value={data.month}>{data.month}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Correlation
                  </label>
                  <select
                    value={userAnalysis.correlation || ''}
                    onChange={(e) => setUserAnalysis(prev => ({ ...prev, correlation: e.target.value }))}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select correlation</option>
                    <option value="Positive correlation">Positive correlation</option>
                    <option value="Negative correlation">Negative correlation</option>
                    <option value="No correlation">No correlation</option>
                    <option value="Uncertain">Uncertain</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setAnalysisComplete(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-slate-600 mb-4">
              Use the buttons below after uploading a file or completing manual input.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Data Visualization",
      description: "Visualize your analyzed data",
      content: (
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Data Visualization Tool</h3>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-slate-900 mb-2">Visualization Guide</h4>
            <p className="text-sm text-slate-600">
              Visualize sales data as a bar chart. Adjust the height of each bar proportionally to the monthly sales amount.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-slate-900">Sales Trend Chart</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setUserChart([])}
                  className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
              </div>
            </div>
            
                        <div className="h-64 flex items-end justify-between gap-2 border-2 border-dashed border-slate-300 rounded-lg p-4">
                          {sampleData.map((data, index) => {
                            const userBar = userChart.find(bar => bar.month === data.month)
                            const correctHeight = Math.round((data.sales / 50000) * 200)
                            
                            return (
                              <div key={data.month} className="flex flex-col items-center flex-1">
                                <div className="relative w-full h-48 flex items-end justify-center">
                                  {/* 정답 영역 (선택적으로 표시) */}
                                  {showAnswer && (
                                    <div 
                                      className="absolute w-full bg-green-200 opacity-50 rounded-t"
                                      style={{ 
                                        height: `${correctHeight}px`,
                                        minHeight: '2px'
                                      }}
                                    />
                                  )}
                                  {/* 사용자가 그린 바 */}
                                  <div 
                                    className={`relative w-full rounded-t cursor-pointer transition-all ${
                                      userBar ? 'bg-blue-500' : 'bg-slate-300'
                                    }`}
                                    style={{ 
                                      height: userBar ? `${userBar.height}px` : '4px',
                                      minHeight: '4px'
                                    }}
                                    onClick={() => {
                                      const newHeight = prompt(`Express ${data.month} sales as bar height!\nSales: $${data.sales.toLocaleString()}\nEnter a number between 0-200:`, userBar?.height.toString() || '50')
                                      if (newHeight && !isNaN(Number(newHeight))) {
                                        const height = Math.max(0, Math.min(200, Number(newHeight)))
                                        setUserChart(prev => {
                                          const filtered = prev.filter(bar => bar.month !== data.month)
                                          return [...filtered, { month: data.month, height }]
                                        })
                                      }
                                    }}
                                  />
                                </div>
                                <div className="text-xs text-slate-600 mt-2 text-center">{data.month}</div>
                                <div className="text-xs text-slate-500 mt-1">
                                  ${data.sales.toLocaleString()}
                                </div>
                              </div>
                            )
                          })}
                        </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600 mb-2">
                Click each bar to adjust the height according to sales!
              </p>
              <div className="flex justify-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>My Bar</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-slate-300 rounded"></div>
                  <span>Empty Bar</span>
                </div>
                {showAnswer && (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <span>Answer Area</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart Accuracy Assessment */}
          {userChart.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-slate-900 mb-2">Visualization Accuracy Assessment</h4>
              {(() => {
                let correctBars = 0
                let totalBars = userChart.length
                
                userChart.forEach(userBar => {
                  const data = sampleData.find(d => d.month === userBar.month)
                  if (data) {
                    const correctHeight = Math.round((data.sales / 50000) * 200)
                    const tolerance = 20 // 20px 오차 허용
                    if (Math.abs(userBar.height - correctHeight) <= tolerance) {
                      correctBars++
                    }
                  }
                })
                
                const accuracy = totalBars > 0 ? Math.round((correctBars / totalBars) * 100) : 0
                
                return (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 mb-2">
                      {accuracy}% Accuracy
                    </div>
                    <div className="text-sm text-slate-600 mb-3">
                      {correctBars} / {totalBars} bars are correct
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          accuracy >= 80 ? 'bg-green-500' : 
                          accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                    {accuracy >= 80 && (
                      <p className="text-sm text-green-600 mt-2">🎉 Excellent! You understand data visualization well!</p>
                    )}
                    {accuracy < 80 && accuracy >= 60 && (
                      <p className="text-sm text-yellow-600 mt-2">👍 Good! Practice a bit more!</p>
                    )}
                    {accuracy < 60 && (
                      <p className="text-sm text-red-600 mt-2">💪 Draw more accurately! Express each month's sales as bar height!</p>
                    )}
                  </div>
                )
              })()}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-slate-600 mb-4">
              Use the buttons below after completing your chart.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Compare Analysis Results",
      description: "Compare your analysis results with the correct answers",
      content: (
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Compare Analysis Results</h3>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Correct Analysis Results
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-slate-700">Total Sales</span>
                  <span className="font-bold text-blue-600">${correctAnalysis.totalSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-slate-700">Average Margin Rate</span>
                  <span className="font-bold text-green-600">{correctAnalysis.averageMargin}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium text-slate-700">Growth Rate</span>
                  <span className="font-bold text-purple-600">{correctAnalysis.growthRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-slate-700">Peak Sales Month</span>
                  <span className="font-bold text-orange-600">{correctAnalysis.peakMonth}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                  <span className="font-medium text-slate-700">Correlation</span>
                  <span className="font-bold text-pink-600">{correctAnalysis.correlation}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-green-600" />
                Your Analysis Results
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Total Sales</span>
                  <span className="font-bold text-slate-600">
                    {userAnalysis.totalSales ? `$${userAnalysis.totalSales.toLocaleString()}` : 'Not entered'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Average Margin Rate</span>
                  <span className="font-bold text-slate-600">
                    {userAnalysis.averageMargin ? `${userAnalysis.averageMargin}%` : 'Not entered'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Growth Rate</span>
                  <span className="font-bold text-slate-600">
                    {userAnalysis.growthRate ? `${userAnalysis.growthRate}%` : 'Not entered'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Peak Sales Month</span>
                  <span className="font-bold text-slate-600">
                    {userAnalysis.peakMonth || 'Not entered'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Correlation</span>
                  <span className="font-bold text-slate-600">
                    {userAnalysis.correlation || 'Not entered'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Correct Answer Insights</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              {correctAnalysis.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Go to Quiz
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Data Analysis Quiz",
      description: "Solve problems by analyzing the data",
      content: (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">
              Question {currentQuestion + 1} / {questions.length}
            </h3>
            <div className="text-sm text-slate-600">
              Score: {score} / {questions.length}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">
              {questions[currentQuestion].question}
            </h4>

            {questions[currentQuestion].type === 'multiple' && (
              <div className="space-y-3">
                {questions[currentQuestion].options?.map((option, index) => (
                  <label key={index} className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${questions[currentQuestion].id}`}
                      value={option}
                      checked={userAnswers[questions[currentQuestion].id] === option}
                      onChange={(e) => setUserAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: e.target.value }))}
                      className="mr-3"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {questions[currentQuestion].type === 'numeric' && (
              <div>
                <input
                  type="number"
                  value={userAnswers[questions[currentQuestion].id] || ''}
                  onChange={(e) => setUserAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a number"
                />
              </div>
            )}

                        {showResults && (
                          <div className={`mt-4 p-4 rounded-lg ${
                            userAnswers[questions[currentQuestion].id] === questions[currentQuestion].correctAnswer
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-red-50 border border-red-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              {userAnswers[questions[currentQuestion].id] === questions[currentQuestion].correctAnswer ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                              <span className={`font-semibold ${
                                userAnswers[questions[currentQuestion].id] === questions[currentQuestion].correctAnswer
                                  ? 'text-green-800'
                                  : 'text-red-800'
                              }`}>
                                {userAnswers[questions[currentQuestion].id] === questions[currentQuestion].correctAnswer ? 'Correct!' : 'Incorrect'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700">
                              <strong>Answer:</strong> {questions[currentQuestion].correctAnswer}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                              {questions[currentQuestion].explanation}
                            </p>
                          </div>
                        )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(prev => prev - 1)
                  setShowResults(false)
                }
              }}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(5)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors text-sm"
              >
                Skip Quiz
              </button>
              
              {!showResults ? (
                <button
                  onClick={() => {
                    setShowResults(true)
                    if (userAnswers[questions[currentQuestion].id] === questions[currentQuestion].correctAnswer) {
                      setScore(prev => prev + 1)
                    }
                  }}
                  disabled={userAnswers[questions[currentQuestion].id] === undefined}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(prev => prev + 1)
                      setShowResults(false)
                    } else {
                      setCurrentStep(5)
                    }
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
                </button>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Analysis Results",
      description: "Your data analysis results",
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Data Analysis Complete!</h3>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
            <div className="text-4xl font-bold text-slate-900 mb-2">
              {score} / {questions.length} points
            </div>
            <div className="text-lg text-slate-600 mb-4">
              {score === questions.length ? 'Perfect! 🎉' : 
               score >= questions.length * 0.8 ? 'Excellent! 👏' : 
               score >= questions.length * 0.6 ? 'Good! 👍' : 'Keep practicing! 💪'}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(score / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Analyzed Data</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• 12 months of sales data</li>
                <li>• Monthly profit margin analysis</li>
                <li>• Customer count trend analysis</li>
                <li>• Growth pattern identification</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Skills Learned</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Data visualization</li>
                <li>• Statistical analysis</li>
                <li>• Pattern recognition</li>
                <li>• Business insights</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              Explore Real Projects
              <ChevronRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => {
                setCurrentStep(0)
                setCurrentQuestion(0)
                setUserAnswers({})
                setShowResults(false)
                setScore(0)
                setUserChart([])
                setUploadedFile(null)
                setUserAnalysis({})
                setAnalysisComplete(false)
              }}
              className="border border-slate-300 text-slate-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 max-w-4xl py-8">
        {/* Progress Bar */}
        <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">
                        Step {currentStep + 1} / {steps.length}
                      </span>
                      <span className="text-sm text-slate-500">
                        {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                      </span>
                    </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-lg text-slate-600">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="min-h-[400px]">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Controls - Show for all steps except quiz and final result */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">
                {currentStep + 1} / {steps.length}
              </span>
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && !uploadedFile && !analysisComplete}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
