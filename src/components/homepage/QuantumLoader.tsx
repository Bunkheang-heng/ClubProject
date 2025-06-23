'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface QuantumLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const QuantumLoader: React.FC<QuantumLoaderProps> = ({ 
  size = 'md', 
  text = 'Initializing Quantum Core...' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Quantum DNA Helix */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 border-2 border-cyan-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 border-2 border-green-400 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Core */}
        <motion.div
          className="absolute inset-4 bg-gradient-to-br from-cyan-400 to-green-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Quantum particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transformOrigin: '0 0'
            }}
            animate={{
              rotate: 360,
              x: [0, 20, 0],
              y: [0, Math.sin(i) * 10, 0]
            }}
            transition={{
              duration: 2 + i * 0.2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Loading text */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-cyan-400 font-mono text-sm">
          {text}
        </p>
        <motion.div
          className="flex justify-center gap-1 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
} 