'use client'
import React from 'react'
import { Submission, Challenge } from '../types'

interface SubmissionHistoryProps {
  submissionHistory: Submission[]
  challenges: Challenge[]
  isVisible: boolean
}

export default function SubmissionHistory({ 
  submissionHistory, 
  challenges, 
  isVisible 
}: SubmissionHistoryProps) {
  if (!isVisible) return null

  return (
    <div className="mb-8 bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">📊 Your Submissions</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {submissionHistory.map((submission) => (
          <div key={submission.id} className="p-3 bg-gray-700/30 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white">
                  {challenges.find(c => c.id === submission.challengeId)?.title || `Challenge #${submission.challengeId}`}
                </h3>
                <p className="text-sm text-gray-400">
                  {submission.timestamp?.toDate?.()?.toLocaleString() || 'Unknown date'}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  submission.passed ? 'text-green-400' : 'text-red-400'
                }`}>
                  {submission.results.passed}/{submission.results.total} tests passed
                </div>
                <div className="text-cyan-400 font-bold">
                  {submission.results.score} pts
                </div>
              </div>
            </div>
          </div>
        ))}
        {submissionHistory.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            No submissions yet. Start solving challenges!
          </p>
        )}
      </div>
    </div>
  )
} 