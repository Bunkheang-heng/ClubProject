import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  serverTimestamp,
  onSnapshot,
  getDoc
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { Challenge, LeaderboardEntry, Submission } from '../types'

export class ChallengeService {
  static async loadChallenges(callback: (challenges: Challenge[]) => void) {
    try {
      const challengesRef = collection(db, 'challenges')
      const challengesQuery = query(challengesRef, orderBy('createdAt', 'asc'))
      
      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(challengesQuery, (snapshot) => {
        const challengesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Challenge[]
        
        callback(challengesList)
      })
      
      return unsubscribe
    } catch (error) {
      console.error('Error loading challenges:', error)
      throw error
    }
  }

  static async loadLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const leaderboardRef = collection(db, 'leaderboard')
      const leaderboardQuery = query(
        leaderboardRef, 
        orderBy('totalScore', 'desc'), 
        limit(10)
      )
      
      const snapshot = await getDocs(leaderboardQuery)
      const leaderboardData = snapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data()
      })) as LeaderboardEntry[]
      
      return leaderboardData
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
      throw error
    }
  }

  static async loadSubmissionHistory(userId: string): Promise<Submission[]> {
    try {
      const submissionsRef = collection(db, 'submissions')
      const submissionsQuery = query(
        submissionsRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(20)
      )
      
      const snapshot = await getDocs(submissionsQuery)
      const submissions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Submission[]
      
      return submissions
    } catch (error) {
      console.error('Failed to load submission history:', error)
      throw error
    }
  }

  static async updateLeaderboard(userId: string, score: number, challengeId: string) {
    try {
      const leaderboardDocRef = doc(db, 'leaderboard', userId)
      
      // Get current leaderboard entry
      const leaderboardDoc = await getDocs(query(collection(db, 'leaderboard'), where('__name__', '==', userId)))
      
      if (!leaderboardDoc.empty) {
        // Update existing entry
        const currentData = leaderboardDoc.docs[0].data() as LeaderboardEntry
        const newChallengesSolved = currentData.challengesSolved.includes(challengeId) 
          ? currentData.challengesSolved 
          : [...currentData.challengesSolved, challengeId]
        
        await updateDoc(leaderboardDocRef, {
          totalScore: currentData.totalScore + score,
          challengesSolved: newChallengesSolved,
          lastSubmission: serverTimestamp()
        })
      } else {
        // Create new entry
        await addDoc(collection(db, 'leaderboard'), {
          userId,
          totalScore: score,
          challengesSolved: [challengeId],
          lastSubmission: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Failed to update leaderboard:', error)
      throw error
    }
  }

  static async submitCode(submission: Omit<Submission, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'submissions'), submission)
    } catch (error) {
      console.error('Failed to submit code:', error)
      throw error
    }
  }

  static async checkChallengesEnabled(): Promise<boolean> {
    try {
      const settingsDocRef = doc(db, 'appSettings', 'global')
      const settingsDoc = await getDoc(settingsDocRef)
      
      if (settingsDoc.exists()) {
        const settings = settingsDoc.data()
        return settings.challengesEnabled !== false // Default to true if not set
      }
      
      return true // Default to enabled if no settings exist
    } catch (error) {
      console.error('Error checking challenges settings:', error)
      return true // Default to enabled on error
    }
  }

  static subscribeToSettings(callback: (enabled: boolean) => void) {
    try {
      const settingsDocRef = doc(db, 'appSettings', 'global')
      
      const unsubscribe = onSnapshot(settingsDocRef, (doc) => {
        if (doc.exists()) {
          const settings = doc.data()
          callback(settings.challengesEnabled !== false) // Default to true if not set
        } else {
          callback(true) // Default to enabled if no settings exist
        }
      }, (error) => {
        console.error('Error checking challenges settings:', error)
        callback(true) // Default to enabled on error
      })

      return unsubscribe
    } catch (error) {
      console.error('Error setting up settings listener:', error)
      callback(true) // Default to enabled on error
      return () => {} // Return empty unsubscribe function
    }
  }
} 