'use client'
import React from 'react'
import { LeaderboardEntry } from '../types'

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[]
  isVisible: boolean
}

export default function Leaderboard({ leaderboard, isVisible }: LeaderboardProps) {
  if (!isVisible) return null

  return (
    <div className="mb-8 bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">🏆 Leaderboard</h2>
      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <div key={entry.userId} className="flex justify-between items-center p-3 bg-gray-700/30 rounded">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </span>
              <span className="font-fira-code text-gray-300">
                User #{entry.userId.slice(-6)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-cyan-400 font-bold">{entry.totalScore} pts</span>
              <span className="text-gray-400 text-sm">
                {entry.challengesSolved?.length || 0} solved
              </span>
            </div>
          </div>
        ))}
        {leaderboard.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            No submissions yet. Be the first to solve a challenge!
          </p>
        )}
      </div>
    </div>
  )
} 