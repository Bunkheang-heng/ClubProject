// Piston API configuration
const PISTON_API_URL = 'https://emkc.org/api/v2/piston'

// Piston API utility functions
export class PistonAPI {
  private static baseUrl = PISTON_API_URL

  static async getRuntimes() {
    try {
      const response = await fetch(`${this.baseUrl}/runtimes`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching runtimes:', error)
      throw error
    }
  }

  static async executeCode(language: string, version: string, code: string) {
    try {
      const response = await fetch(`${this.baseUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          version,
          files: [
            {
              name: 'main.js',
              content: code
            }
          ],
          stdin: '',
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
          compile_memory_limit: -1,
          run_memory_limit: -1
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error executing code:', error)
      throw error
    }
  }
} 