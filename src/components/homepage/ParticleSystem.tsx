'use client'
import React, { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color: string
}

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const colors = ['#00ff41', '#ff0080', '#00d4ff', '#ffff00', '#ff4000']

    const createParticle = (x: number, y: number) => {
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 3 + 1,
        life: 0,
        maxLife: Math.random() * 60 + 40,
        color: colors[Math.floor(Math.random() * colors.length)]
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const newMousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      setMousePos(newMousePos)

      // Create particles at mouse position
      if (Math.random() < 0.3) {
        particlesRef.current.push(createParticle(newMousePos.x, newMousePos.y))
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life++
        particle.x += particle.vx
        particle.y += particle.vy
        
        // Apply gravity and friction
        particle.vy += 0.1
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Calculate alpha based on life
        const alpha = 1 - (particle.life / particle.maxLife)
        
        if (alpha <= 0) return false

        // Draw particle with glow effect
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.shadowColor = particle.color
        ctx.shadowBlur = 15
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        return true
      })

      // Add random particles
      if (Math.random() < 0.02) {
        particlesRef.current.push(createParticle(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        ))
      }

      requestAnimationFrame(animate)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  )
} 