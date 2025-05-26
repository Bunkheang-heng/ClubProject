'use client'
import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface HolographicCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  onClick?: () => void
}

export const HolographicCard: React.FC<HolographicCardProps> = ({ 
  children, 
  className = '', 
  glowColor = '#00ff41',
  onClick 
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative group cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Holographic background */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}20 0%, transparent 50%)`,
        }}
      />
      
      {/* Glassmorphism card */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/40 to-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden">
        {/* Animated border */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(45deg, transparent, ${glowColor}40, transparent)`,
            padding: '1px',
          }}
        >
          <div className="w-full h-full bg-gray-900/80 rounded-xl" />
        </div>
        
        {/* Holographic shine effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 30%, ${glowColor}20 50%, transparent 70%)`,
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
            transition: 'transform 0.6s ease-in-out',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          {children}
        </div>
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400 opacity-60" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-400 opacity-60" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-400 opacity-60" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-400 opacity-60" />
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"
        style={{
          background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
    </motion.div>
  )
} 