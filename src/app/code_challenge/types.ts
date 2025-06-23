export interface Challenge {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  example: string
  constraints: string[]
  points: number
  timeLimit: number // in minutes
  functionName: string
  testCases: Array<{input: any, expected: any}>
  createdAt?: any
  createdBy?: string
  maxAttempts?: number // Optional: if set, limits attempts for this challenge
}

export interface TestResult {
  testCase: number
  passed: boolean
  input: any
  expected: any
  actual?: any
  error?: string
}

export interface SubmissionResult {
  passed: number
  failed: number
  total: number
  details: TestResult[]
  score: number
}

export interface LeaderboardEntry {
  userId: string
  totalScore: number
  challengesSolved: string[]
  lastSubmission?: any
}

export interface Submission {
  id?: string
  challengeId: string
  userId: string
  code: string
  results: SubmissionResult
  passed: boolean
  timestamp: any
} 