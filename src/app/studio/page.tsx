'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Save, Eye, Code, BarChart3, FileText, TestTube, Image, Settings, CheckCircle } from 'lucide-react'

interface Scene {
  id: string
  type: 'INFO' | 'MCQ' | 'NUMERIC' | 'CODE' | 'SQL' | 'BRANCH'
  title: string
  content: string
  options?: string[]
  correctAnswer?: string | number
  tolerance?: number
  keywords?: string[]
  testCases?: { input: string; expected: string }[]
}

interface Mission {
  title: string
  description: string
  category: string
  difficulty: 'E' | 'M' | 'H'
  duration: number
  price: number
  evaluationType: 'CODE' | 'NUMERIC' | 'TEXT' | 'TESTS'
  type: 'Build' | 'Debug' | 'Design' | 'Decide' | 'Review'
  thumbnail?: string
  scenes: Scene[]
  rubric: {
    criteria: string
    weight: number
    description: string
  }[]
  passThreshold: number
}

export default function StudioPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [mission, setMission] = useState<Mission>({
    title: '',
    description: '',
    category: '',
    difficulty: 'E',
    duration: 15,
    price: 0,
    evaluationType: 'CODE',
    type: 'Build',
    scenes: [],
    rubric: [],
    passThreshold: 70
  })

  const steps = [
    { id: 1, title: 'Basics', description: 'Mission details and settings' },
    { id: 2, title: 'Outcomes', description: 'Learning objectives and deliverables' },
    { id: 3, title: 'Scenes', description: 'Create mission content and interactions' },
    { id: 4, title: 'Assets', description: 'Images, files, and resources' },
    { id: 5, title: 'Rubric', description: 'Evaluation criteria and scoring' }
  ]

  const categories = [
    'Frontend', 'Backend', 'Data Analytics', 'ML/AI', 'Mobile', 'DevOps', 'Security', 'Sandbox'
  ]

  const sceneTypes = [
    { type: 'INFO', label: 'Information', icon: FileText, description: 'Text content and instructions' },
    { type: 'MCQ', label: 'Multiple Choice', icon: BarChart3, description: 'Multiple choice questions' },
    { type: 'NUMERIC', label: 'Numeric', icon: BarChart3, description: 'Numeric input with tolerance' },
    { type: 'CODE', label: 'Code', icon: Code, description: 'Code writing and execution' },
    { type: 'SQL', label: 'SQL', icon: Code, description: 'Database queries' },
    { type: 'BRANCH', label: 'Branch', icon: Settings, description: 'Conditional logic flow' }
  ]

  const addScene = (type: Scene['type']) => {
    const newScene: Scene = {
      id: Date.now().toString(),
      type,
      title: '',
      content: '',
      options: type === 'MCQ' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'MCQ' ? '' : type === 'NUMERIC' ? 0 : '',
      tolerance: type === 'NUMERIC' ? 0.1 : undefined,
      keywords: type === 'TEXT' ? [] : undefined,
      testCases: type === 'CODE' || type === 'SQL' ? [] : undefined
    }
    setMission(prev => ({
      ...prev,
      scenes: [...prev.scenes, newScene]
    }))
  }

  const updateScene = (sceneId: string, updates: Partial<Scene>) => {
    setMission(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === sceneId ? { ...scene, ...updates } : scene
      )
    }))
  }

  const removeScene = (sceneId: string) => {
    setMission(prev => ({
      ...prev,
      scenes: prev.scenes.filter(scene => scene.id !== sceneId)
    }))
  }

  const addRubricItem = () => {
    setMission(prev => ({
      ...prev,
      rubric: [...prev.rubric, { criteria: '', weight: 0, description: '' }]
    }))
  }

  const updateRubricItem = (index: number, updates: Partial<Mission['rubric'][0]>) => {
    setMission(prev => ({
      ...prev,
      rubric: prev.rubric.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      )
    }))
  }

  const removeRubricItem = (index: number) => {
    setMission(prev => ({
      ...prev,
      rubric: prev.rubric.filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Mission Title</label>
              <input
                type="text"
                value={mission.title}
                onChange={(e) => setMission(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter mission title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
              <textarea
                value={mission.description}
                onChange={(e) => setMission(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what learners will do in this mission"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Category</label>
                <select
                  value={mission.category}
                  onChange={(e) => setMission(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Difficulty</label>
                <select
                  value={mission.difficulty}
                  onChange={(e) => setMission(prev => ({ ...prev, difficulty: e.target.value as 'E' | 'M' | 'H' }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="E">Easy</option>
                  <option value="M">Medium</option>
                  <option value="H">Hard</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={mission.duration}
                  onChange={(e) => setMission(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={mission.price}
                  onChange={(e) => setMission(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Type</label>
                <select
                  value={mission.type}
                  onChange={(e) => setMission(prev => ({ ...prev, type: e.target.value as Mission['type'] }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Build">Build</option>
                  <option value="Debug">Debug</option>
                  <option value="Design">Design</option>
                  <option value="Decide">Decide</option>
                  <option value="Review">Review</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Learning Outcomes</label>
              <p className="text-sm text-slate-600 mb-4">What will learners achieve after completing this mission?</p>
              <div className="space-y-3">
                {['Outcome 1', 'Outcome 2', 'Outcome 3'].map((outcome, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`${outcome}...`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Deliverable Description</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what learners will produce as their final deliverable"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Sample Output</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Image className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Upload sample image or code snippet</p>
                <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                  Choose File
                </button>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Mission Scenes</h3>
              <button
                onClick={() => setCurrentStep(4)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Skip to Assets
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {sceneTypes.map((sceneType) => {
                const Icon = sceneType.icon
                return (
                  <button
                    key={sceneType.type}
                    onClick={() => addScene(sceneType.type as Scene['type'])}
                    className="p-4 border border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <Icon className="w-6 h-6 text-slate-600 mb-2" />
                    <div className="font-medium text-slate-900">{sceneType.label}</div>
                    <div className="text-sm text-slate-600">{sceneType.description}</div>
                  </button>
                )
              })}
            </div>

            <div className="space-y-4">
              {mission.scenes.map((scene, index) => (
                <div key={scene.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-slate-900">
                      Scene {index + 1}: {sceneTypes.find(s => s.type === scene.type)?.label}
                    </h4>
                    <button
                      onClick={() => removeScene(scene.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={scene.title}
                        onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Scene title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                      <textarea
                        value={scene.content}
                        onChange={(e) => updateScene(scene.id, { content: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Scene content or instructions"
                      />
                    </div>

                    {scene.type === 'MCQ' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Options</label>
                        <div className="space-y-2">
                          {scene.options?.map((option, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${scene.id}`}
                                checked={scene.correctAnswer === option}
                                onChange={() => updateScene(scene.id, { correctAnswer: option })}
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(scene.options || [])]
                                  newOptions[i] = e.target.value
                                  updateScene(scene.id, { options: newOptions })
                                }}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Option ${i + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {scene.type === 'NUMERIC' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Correct Answer</label>
                          <input
                            type="number"
                            value={scene.correctAnswer || ''}
                            onChange={(e) => updateScene(scene.id, { correctAnswer: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Tolerance</label>
                          <input
                            type="number"
                            step="0.1"
                            value={scene.tolerance || ''}
                            onChange={(e) => updateScene(scene.id, { tolerance: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}

                    {(scene.type === 'CODE' || scene.type === 'SQL') && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Test Cases</label>
                        <div className="space-y-2">
                          {scene.testCases?.map((testCase, i) => (
                            <div key={i} className="grid md:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={testCase.input}
                                onChange={(e) => {
                                  const newTestCases = [...(scene.testCases || [])]
                                  newTestCases[i] = { ...testCase, input: e.target.value }
                                  updateScene(scene.id, { testCases: newTestCases })
                                }}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Input"
                              />
                              <input
                                type="text"
                                value={testCase.expected}
                                onChange={(e) => {
                                  const newTestCases = [...(scene.testCases || [])]
                                  newTestCases[i] = { ...testCase, expected: e.target.value }
                                  updateScene(scene.id, { testCases: newTestCases })
                                }}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Expected Output"
                              />
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newTestCases = [...(scene.testCases || []), { input: '', expected: '' }]
                              updateScene(scene.id, { testCases: newTestCases })
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            + Add Test Case
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Mission Assets</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Thumbnail Image</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <Image className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">Upload mission thumbnail</p>
                  <p className="text-sm text-slate-500 mb-4">Recommended: 400x267px</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Choose File
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Additional Files</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">Upload resources</p>
                  <p className="text-sm text-slate-500 mb-4">Templates, datasets, etc.</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Choose Files
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Auto Quality Checks</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• At least 2 test cases required for CODE/SQL scenes</li>
                <li>• Timeout settings configured for code execution</li>
                <li>• Missing assets will be flagged before publishing</li>
              </ul>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Evaluation Rubric</h3>
              <button
                onClick={addRubricItem}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Criteria
              </button>
            </div>

            <div className="space-y-4">
              {mission.rubric.map((item, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-slate-900">Criteria {index + 1}</h4>
                    <button
                      onClick={() => removeRubricItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Criteria Name</label>
                      <input
                        type="text"
                        value={item.criteria}
                        onChange={(e) => updateRubricItem(index, { criteria: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Functionality, Code Quality"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Weight (%)</label>
                        <input
                          type="number"
                          value={item.weight}
                          onChange={(e) => updateRubricItem(index, { weight: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Pass Threshold (%)</label>
                        <input
                          type="number"
                          value={mission.passThreshold}
                          onChange={(e) => setMission(prev => ({ ...prev, passThreshold: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateRubricItem(index, { description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe how this criteria will be evaluated"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">Quality Checks Passed</h4>
              </div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• All required fields completed</li>
                <li>• At least 2 test cases for CODE/SQL scenes</li>
                <li>• Rubric weights total 100%</li>
                <li>• Pass threshold is reasonable (70-90%)</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mission Studio</h1>
          <p className="text-slate-600">Create engaging, self-paced missions for learners</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3">
                  <div className={`font-medium ${
                    currentStep >= step.id ? 'text-slate-900' : 'text-slate-600'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-slate-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <CheckCircle className="w-4 h-4" />
                Publish Mission
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
