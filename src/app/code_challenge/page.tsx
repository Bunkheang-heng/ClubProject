'use client'
import React, { useState, useEffect } from 'react'
import Nav from '../../components/nav'
import Footer from '../../components/footer'
import { MatrixRain } from '../../components/homepage/MatrixRain'
import { NeuralNetwork } from '../../components/homepage/NeuralNetwork'
import { ParticleSystem } from '../../components/homepage/ParticleSystem'
import { auth } from '../../firebase'
import { signInAnonymously, User } from 'firebase/auth'
import { serverTimestamp } from 'firebase/firestore'

// Import new modular components and services
import { Challenge, SubmissionResult, LeaderboardEntry, Submission, TestResult } from './types'
import { PistonAPI } from './services/pistonApi'
import { ChallengeService } from './services/challengeService'
import { getInputParams } from './utils/helpers'
import ChallengeList from './components/ChallengeList'
import ChallengeWorkspace from './components/ChallengeWorkspace'
import Leaderboard from './components/Leaderboard'
import SubmissionHistory from './components/SubmissionHistory'

export default function CodeChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [code, setCode] = useState('')
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [submissionHistory, setSubmissionHistory] = useState<Submission[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [challengesLoading, setChallengesLoading] = useState(true)
  const [userAttempts, setUserAttempts] = useState<Record<string, number>>({})
  const [challengesEnabled, setChallengesEnabled] = useState<boolean | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setAuthLoading(false)
      if (user) {
        loadLeaderboard()
        loadSubmissionHistory()
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // Check if challenges are enabled
    const unsubscribe = ChallengeService.subscribeToSettings((enabled) => {
      setChallengesEnabled(enabled)
      setSettingsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // Load challenges from Firestore
    let unsubscribe: (() => void) | undefined
    
    const loadChallenges = async () => {
      try {
        unsubscribe = await ChallengeService.loadChallenges((challengesList) => {
          setChallenges(challengesList)
          setChallengesLoading(false)
        })
      } catch (error) {
        console.error('Error loading challenges:', error)
        setChallengesLoading(false)
      }
    }

    loadChallenges()
    
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isTimerActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsTimerActive(false)
      setSubmissionResult({
        passed: 0,
        failed: 0,
        total: 0,
        details: [],
        score: 0
      })
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, timeLeft])

  const signInAnonymouslyHandler = async () => {
    try {
      await signInAnonymously(auth)
    } catch (error) {
      console.error('Failed to sign in anonymously:', error)
    }
  }

  const loadLeaderboard = async () => {
    try {
      const leaderboardData = await ChallengeService.loadLeaderboard()
      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
    }
  }

  const loadSubmissionHistory = async () => {
    if (!user) return
    try {
      const submissions = await ChallengeService.loadSubmissionHistory(user.uid)
      setSubmissionHistory(submissions)
      
      // Count attempts per challenge
      const attempts: Record<string, number> = {}
      submissions.forEach(submission => {
        attempts[submission.challengeId] = (attempts[submission.challengeId] || 0) + 1
      })
      setUserAttempts(attempts)
    } catch (error) {
      console.error('Failed to load submission history:', error)
    }
  }

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setTimeLeft(challenge.timeLimit * 60)
    setIsTimerActive(true)
    setCode('')
    setSubmissionResult(null)
  }

  const runTestCases = async (challenge: Challenge, userCode: string): Promise<SubmissionResult> => {
    const testCases = challenge.testCases || []
    const results: TestResult[] = []
    let passed = 0
    let failed = 0

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i]
      
      try {
        // Wrap user code with test runner
        const testRunnerCode = `
// User's solution
${userCode}

// Test runner
try {
  const input = ${JSON.stringify(testCase.input)};
  const expected = ${JSON.stringify(testCase.expected)};
  
  // Call the user's function
  let result;
  if (typeof ${challenge.functionName} === 'function') {
    result = ${challenge.functionName}(${getInputParams(testCase.input)});
  } else {
    throw new Error('Function ${challenge.functionName} not found');
  }
  
  console.log(JSON.stringify({
    success: true,
    result: result,
    expected: expected
  }));
} catch (error) {
  console.log(JSON.stringify({
    success: false,
    error: error.message
  }));
}
`

        const executionResult = await PistonAPI.executeCode('javascript', '*', testRunnerCode)
        
        if (executionResult.run.code === 0) {
          try {
            const output = JSON.parse(executionResult.run.stdout.trim())
            if (output.success) {
              const isCorrect = JSON.stringify(output.result) === JSON.stringify(output.expected)
              results.push({
                testCase: i + 1,
                passed: isCorrect,
                input: testCase.input,
                expected: testCase.expected,
                actual: output.result
              })
              
              if (isCorrect) {
                passed++
              } else {
                failed++
              }
            } else {
              results.push({
                testCase: i + 1,
                passed: false,
                input: testCase.input,
                expected: testCase.expected,
                error: output.error
              })
              failed++
            }
          } catch (parseError) {
            results.push({
              testCase: i + 1,
              passed: false,
              input: testCase.input,
              expected: testCase.expected,
              error: 'Failed to parse output'
            })
            failed++
          }
        } else {
          results.push({
            testCase: i + 1,
            passed: false,
            input: testCase.input,
            expected: testCase.expected,
            error: executionResult.run.stderr || 'Runtime error'
          })
          failed++
        }
      } catch (error) {
        results.push({
          testCase: i + 1,
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        failed++
      }
    }

    const total = passed + failed
    const scorePercentage = total > 0 ? passed / total : 0
    const score = Math.round(scorePercentage * challenge.points)

    return {
      passed,
      failed,
      total,
      details: results,
      score
    }
  }

  const canSubmitChallenge = (challenge: Challenge): boolean => {
    if (!challenge.maxAttempts) return true // No limit if maxAttempts not set
    const currentAttempts = userAttempts[challenge.id] || 0
    return currentAttempts < challenge.maxAttempts
  }

  const getRemainingAttempts = (challenge: Challenge): number => {
    if (!challenge.maxAttempts) return Infinity
    const currentAttempts = userAttempts[challenge.id] || 0
    return Math.max(0, challenge.maxAttempts - currentAttempts)
  }

  const submitCode = async () => {
    if (!selectedChallenge || !user) return
    
    // Check if user has remaining attempts
    if (!canSubmitChallenge(selectedChallenge)) {
      alert(`You have reached the maximum number of attempts (${selectedChallenge.maxAttempts}) for this challenge.`)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const results = await runTestCases(selectedChallenge, code.trim())
      setSubmissionResult(results)
      setIsTimerActive(false)
      
      // Save submission to Firestore
      const submissionData = {
        challengeId: selectedChallenge.id,
        userId: user.uid,
        code: code.trim(),
        results,
        passed: results.passed === results.total,
        timestamp: serverTimestamp()
      }
      
      await ChallengeService.submitCode(submissionData)
      
      // Update local attempts counter
      setUserAttempts(prev => ({
        ...prev,
        [selectedChallenge.id]: (prev[selectedChallenge.id] || 0) + 1
      }))
      
      // Update leaderboard if score > 0
      if (results.score > 0) {
        await ChallengeService.updateLeaderboard(user.uid, results.score, selectedChallenge.id)
      }
      
      // Reload data
      loadLeaderboard()
      loadSubmissionHistory()
      
    } catch (error) {
      console.error('Submission error:', error)
      setSubmissionResult({
        passed: 0,
        failed: 1,
        total: 1,
        details: [{
          testCase: 1,
          passed: false,
          input: {},
          expected: {},
          error: 'Failed to submit code. Please try again.'
        }],
        score: 0
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || challengesLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 relative overflow-hidden">
        <MatrixRain />
        <NeuralNetwork />
        <ParticleSystem />
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-xl text-gray-300">Loading Code Challenge Arena...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show "not available" page if challenges are disabled
  if (challengesEnabled === false) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 relative overflow-hidden">
        <MatrixRain />
        <NeuralNetwork />
        <ParticleSystem />
        <div className="relative z-20">
          <Nav />
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center max-w-md mx-auto p-8 bg-gray-800/50 border border-gray-700/50 rounded-lg backdrop-blur-sm">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-600/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold font-orbitron mb-4 text-red-400">
                Code Challenges Unavailable
              </h2>
              <p className="text-gray-300 mb-6">
                The code challenge arena is currently disabled. Please check back later or contact an administrator.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>Service temporarily unavailable</span>
                </div>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 relative overflow-hidden">
        <MatrixRain />
        <NeuralNetwork />
        <ParticleSystem />
        <div className="relative z-20">
          <Nav />
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center max-w-md mx-auto p-8 bg-gray-800/50 border border-gray-700/50 rounded-lg backdrop-blur-sm">
              <h2 className="text-3xl font-bold font-orbitron mb-4 text-cyan-400">
                Join the Challenge
              </h2>
              <p className="text-gray-300 mb-6">
                Sign in to start solving coding challenges, track your progress, and compete on the leaderboard!
              </p>
              <button
                onClick={signInAnonymouslyHandler}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                Start Coding
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 relative overflow-hidden">
      {/* Background Effects */}
      <MatrixRain />
      <NeuralNetwork />
      <ParticleSystem />
      
      {/* Main Content */}
      <div className="relative z-20">
        <Nav />
        
        <main className="flex-grow container mx-auto px-4 py-8 pt-28">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold font-orbitron mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Code Challenge Arena
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Test your programming skills with our curated collection of coding challenges. 
                From algorithms to data structures, level up your coding game!
              </p>
              
              {/* Navigation Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => {setShowLeaderboard(!showLeaderboard); setShowHistory(false)}}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors duration-300"
                >
                  🏆 Leaderboard
                </button>
                <button
                  onClick={() => {setShowHistory(!showHistory); setShowLeaderboard(false)}}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors duration-300"
                >
                  📊 My Submissions
                </button>
              </div>
            </div>

            {/* Leaderboard Component */}
            <Leaderboard 
              leaderboard={leaderboard} 
              isVisible={showLeaderboard} 
            />

            {/* Submission History Component */}
            <SubmissionHistory 
              submissionHistory={submissionHistory}
              challenges={challenges}
              isVisible={showHistory}
            />

            {!selectedChallenge ? (
              /* Challenge List Component */
              <ChallengeList 
                challenges={challenges}
                onStartChallenge={startChallenge}
                canSubmitChallenge={canSubmitChallenge}
                getRemainingAttempts={getRemainingAttempts}
              />
            ) : (
              /* Challenge Workspace Component */
              <ChallengeWorkspace 
                challenge={selectedChallenge}
                timeLeft={timeLeft}
                code={code}
                onCodeChange={setCode}
                onBackToList={() => setSelectedChallenge(null)}
                onSubmit={submitCode}
                isSubmitting={isSubmitting}
                submissionResult={submissionResult}
                canSubmit={isTimerActive && canSubmitChallenge(selectedChallenge)}
                remainingAttempts={getRemainingAttempts(selectedChallenge)}
              />
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}
