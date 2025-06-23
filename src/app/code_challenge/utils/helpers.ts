export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/20'
    case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20'
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
  }
}

export const getInputParams = (input: any): string => {
  if (typeof input === 'object' && input !== null) {
    return Object.values(input).map(val => JSON.stringify(val)).join(', ')
  }
  return JSON.stringify(input)
} 