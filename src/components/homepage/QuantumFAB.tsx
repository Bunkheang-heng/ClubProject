'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCode, FaRocket, FaUsers, FaBolt, FaTerminal, FaCog } from 'react-icons/fa'
import Link from 'next/link'

export const QuantumFAB = () => {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: FaCode, label: 'Code Lab', href: '/events', color: '#00ff41' },
    { icon: FaRocket, label: 'Launch', href: '/attendance', color: '#00d4ff' },
    { icon: FaUsers, label: 'Community', href: '/aboutus', color: '#ff0080' },
    { icon: FaBolt, label: 'Quick Start', href: '/login', color: '#ffff00' },
    { icon: FaTerminal, label: 'Terminal', href: '/admin', color: '#a855f7' }
  ]

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Action buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <motion.button
                    className="flex items-center gap-3 px-4 py-3 bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg text-white hover:border-cyan-400 transition-all duration-300 group"
                    whileHover={{ scale: 1.05, x: -10 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: `0 0 20px ${action.color}40`
                    }}
                  >
                    <action.icon 
                      className="text-lg"
                      style={{ color: action.color }}
                    />
                    <span className="font-mono text-sm whitespace-nowrap">
                      {action.label}
                    </span>
                    
                    {/* Quantum glow effect */}
                    <div 
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ backgroundColor: action.color }}
                    />
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-green-500 rounded-full flex items-center justify-center text-black text-xl font-bold shadow-lg overflow-hidden group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(0, 255, 65, 0.5)",
            "0 0 30px rgba(0, 212, 255, 0.7)",
            "0 0 20px rgba(0, 255, 65, 0.5)"
          ]
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <FaCog />
        </motion.div>

        {/* Quantum particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos(i * Math.PI / 3) * 30],
              y: [0, Math.sin(i * Math.PI / 3) * 30],
              opacity: [1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Pulse rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-white rounded-full"
            animate={{
              scale: [1, 2, 3],
              opacity: [0.5, 0.2, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.button>

      {/* Tooltip */}
      {!isOpen && (
        <motion.div
          className="absolute bottom-20 right-0 px-3 py-2 bg-black/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg text-cyan-400 text-xs font-mono whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          Quantum Access Portal
          <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400/30 transform translate-y-full" />
        </motion.div>
      )}
    </div>
  )
} 