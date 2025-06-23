'use client'
import React from 'react'
import { Challenge } from '../types'
import { getDifficultyColor } from '../utils/helpers'

interface ChallengeListProps {
  challenges: Challenge[]
  onStartChallenge: (challenge: Challenge) => void
  canSubmitChallenge: (challenge: Challenge) => boolean
  getRemainingAttempts: (challenge: Challenge) => number
}

export default function ChallengeList({ 
  challenges, 
  onStartChallenge, 
  canSubmitChallenge, 
  getRemainingAttempts 
}: ChallengeListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {challenges.map((challenge) => (
        <div 
          key={challenge.id}
          className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold font-fira-code text-cyan-400">
              {challenge.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
          </div>
          
          <p className="text-gray-300 mb-4 line-clamp-3">
            {challenge.description}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>🏆 {challenge.points} pts</span>
              <span>⏱️ {challenge.timeLimit}m</span>
              {challenge.maxAttempts && (
                <span>🎯 {getRemainingAttempts(challenge)}/{challenge.maxAttempts} attempts</span>
              )}
            </div>
            <button
              onClick={() => onStartChallenge(challenge)}
              disabled={!canSubmitChallenge(challenge)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                canSubmitChallenge(challenge)
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canSubmitChallenge(challenge) ? 'Start Challenge' : 'No Attempts Left'}
            </button>
          </div>
        </div>
      ))}
      {challenges.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-400 text-xl">No challenges available yet.</p>
          <p className="text-gray-500 mt-2">Check back later for new challenges!</p>
        </div>
      )}
    </div>
  )
} 