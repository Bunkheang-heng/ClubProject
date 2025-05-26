'use client'
import React, { useEffect, useRef } from 'react'

export const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Matrix characters - programming symbols and code
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>=+-*/&|!@#$%^&*()_+{}|:"<>?[];,./`~'
    const codeSnippets = ['const', 'let', 'var', 'function', 'class', 'import', 'export', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', '===', '!==', '=>', '&&', '||']
    
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height
    }

    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#00ff41'
      ctx.font = `${fontSize}px 'Fira Code', monospace`

      for (let i = 0; i < drops.length; i++) {
        // Randomly choose between single char or code snippet
        const text = Math.random() > 0.8 ? 
          codeSnippets[Math.floor(Math.random() * codeSnippets.length)] :
          chars[Math.floor(Math.random() * chars.length)]

        // Add glow effect
        ctx.shadowColor = '#00ff41'
        ctx.shadowBlur = 10
        
        ctx.fillText(text, i * fontSize, drops[i])

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.1 }}
    />
  )
} 