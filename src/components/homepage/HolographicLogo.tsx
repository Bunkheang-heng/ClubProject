'use client'
import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export const HolographicLogo = () => {
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return
      
      const rect = logoRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) / 10
      const deltaY = (e.clientY - centerY) / 10
      
      logoRef.current.style.transform = `
        perspective(1000px) 
        rotateX(${deltaY}deg) 
        rotateY(${deltaX}deg) 
        translateZ(50px)
      `
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Holographic glow rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-cyan-400"
          style={{
            transform: `scale(${1 + i * 0.3})`,
            opacity: 0.3 - i * 0.1
          }}
          animate={{
            rotate: 360,
            scale: [1 + i * 0.3, 1.2 + i * 0.3, 1 + i * 0.3]
          }}
          transition={{
            rotate: { duration: 10 + i * 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      ))}
      
      {/* Main logo */}
      <motion.div
        ref={logoRef}
        className="relative w-full h-full bg-gradient-to-br from-cyan-400 via-green-400 to-purple-400 rounded-lg flex items-center justify-center text-black font-black text-2xl transition-transform duration-200 ease-out"
        style={{
          boxShadow: `
            0 0 20px rgba(0, 255, 65, 0.5),
            0 0 40px rgba(0, 212, 255, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.1)
          `
        }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(0, 255, 65, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)",
            "0 0 30px rgba(0, 212, 255, 0.7), 0 0 60px rgba(0, 255, 65, 0.5)",
            "0 0 20px rgba(0, 255, 65, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="relative z-10">BB</span>
        
        {/* Particle effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos(i * Math.PI / 4) * 60],
              y: [0, Math.sin(i * Math.PI / 4) * 60],
              opacity: [1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  )
} 