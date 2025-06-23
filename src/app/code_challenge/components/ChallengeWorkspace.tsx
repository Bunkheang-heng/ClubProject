'use client'
import React from 'react'
import { Challenge, SubmissionResult } from '../types'
import { formatTime, getDifficultyColor } from '../utils/helpers'

interface ChallengeWorkspaceProps {
  challenge: Challenge
  timeLeft: number | null
  code: string
  onCodeChange: (code: string) => void
  onBackToList: () => void
  onSubmit: () => void
  isSubmitting: boolean
  submissionResult: SubmissionResult | null
  canSubmit: boolean
  remainingAttempts: number
}

export default function ChallengeWorkspace({
  challenge,
  timeLeft,
  code,
  onCodeChange,
  onBackToList,
  onSubmit,
  isSubmitting,
  submissionResult,
  canSubmit,
  remainingAttempts
}: ChallengeWorkspaceProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Challenge Details */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold font-fira-code text-cyan-400 mb-2">
              {challenge.title}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-orbitron text-cyan-400">
              {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
            </div>
            <div className="text-sm text-gray-400">Time Remaining</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Description</h3>
            <p className="text-gray-300">{challenge.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Example</h3>
            <pre className="bg-gray-900/50 border border-gray-600/50 rounded p-4 text-green-400 font-fira-code text-sm overflow-x-auto">
              {challenge.example}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Constraints</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {challenge.constraints.map((constraint, index) => (
                <li key={index} className="font-fira-code text-sm">{constraint}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Function Signature</h3>
            <pre className="bg-gray-900/50 border border-gray-600/50 rounded p-4 text-green-400 font-fira-code text-sm overflow-x-auto">
              function {challenge.functionName}(/* parameters */) {'{'}{'}'}
            </pre>
          </div>
        </div>

        <button
          onClick={onBackToList}
          className="mt-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
        >
          ← Back to Challenges
        </button>
      </div>

      {/* Code Editor */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Code Editor</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>🏆 {challenge.points} points</span>
            {challenge.maxAttempts && (
              <span className={`${remainingAttempts <= 2 ? 'text-red-400' : 'text-cyan-400'}`}>
                🎯 {remainingAttempts}/{challenge.maxAttempts} attempts left
              </span>
            )}
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={`// Write your solution here...
function ${challenge.functionName}(/* parameters */) {
    // Your code here
}`}
          className="w-full h-96 bg-gray-900/50 border border-gray-600/50 rounded p-4 text-green-400 font-fira-code text-sm resize-none focus:outline-none focus:border-cyan-500/50 transition-colors duration-300"
        />

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            Language: JavaScript
          </div>
          <div className="flex gap-3">
            <button
              onClick={onSubmit}
              disabled={!canSubmit || isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : !canSubmit ? (
                'No Attempts Left'
              ) : (
                'Submit Solution'
              )}
            </button>
          </div>
        </div>

        {submissionResult && (
          <div className="mt-4 space-y-4">
            {/* Summary */}
            <div className={`p-4 rounded-lg border ${
              submissionResult.passed === submissionResult.total
                ? 'bg-green-900/20 border-green-500/30 text-green-400' 
                : 'bg-red-900/20 border-red-500/30 text-red-400'
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {submissionResult.passed === submissionResult.total ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}
                </span>
                <span className="font-bold text-cyan-400">
                  +{submissionResult.score} points
                </span>
              </div>
              <div className="text-sm mt-1">
                {submissionResult.passed}/{submissionResult.total} test cases passed
              </div>
            </div>

            {/* Test Details */}
            <div className="max-h-48 overflow-y-auto space-y-2">
              {submissionResult.details.map((test, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded text-sm font-fira-code ${
                    test.passed 
                      ? 'bg-green-900/20 border border-green-500/30' 
                      : 'bg-red-900/20 border border-red-500/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">
                      Test Case {test.testCase} {test.passed ? '✅' : '❌'}
                    </span>
                  </div>
                  {test.error && (
                    <div className="text-red-300 mt-1">
                      Error: {test.error}
                    </div>
                  )}
                  {!test.passed && !test.error && (
                    <div className="text-xs mt-1 space-y-1">
                      <div>Expected: {JSON.stringify(test.expected)}</div>
                      <div>Got: {JSON.stringify(test.actual)}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 