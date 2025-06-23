'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export const CyberpunkTerminal = () => {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  const terminalLines = [
    '> Initializing ByteBuilder Neural Network...',
    '> Loading quantum algorithms... ████████████ 100%',
    '> Connecting to global developer matrix...',
    '> STATUS: All systems operational',
    '> Welcome to the future of coding education',
    '> Type "help" for available commands',
    '> _'
  ]

  const systemStats = [
    { label: 'CPU', value: '87%', color: 'text-green-400' },
    { label: 'RAM', value: '64%', color: 'text-cyan-400' },
    { label: 'NET', value: '99%', color: 'text-purple-400' },
    { label: 'GPU', value: '92%', color: 'text-orange-400' }
  ]

  useEffect(() => {
    if (currentLine >= terminalLines.length) {
      setIsTyping(false)
      return
    }

    const line = terminalLines[currentLine]
    let charIndex = 0

    const typeInterval = setInterval(() => {
      if (charIndex <= line.length) {
        setDisplayText(line.substring(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setCurrentLine(prev => prev + 1)
        }, 1000)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [currentLine])

  return (
    <motion.div
      className="bg-black/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 font-mono text-sm max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 ml-4">ByteBuilder Terminal v3.0.1</span>
        </div>
        <div className="text-cyan-400 text-xs">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* System stats */}
      <div className="grid grid-cols-4 gap-4 mb-6 p-3 bg-gray-900/50 rounded border border-gray-700">
        {systemStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-xs text-gray-400">{stat.label}</div>
            <div className={`text-lg font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Terminal output */}
      <div className="space-y-2 min-h-[200px]">
        {terminalLines.slice(0, currentLine).map((line, index) => (
          <motion.div
            key={index}
            className="text-green-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {line}
          </motion.div>
        ))}
        
        {currentLine < terminalLines.length && (
          <div className="text-green-400">
            {displayText}
            <motion.span
              className="inline-block w-2 h-4 bg-green-400 ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </div>
        )}

        {!isTyping && (
          <motion.div
            className="mt-4 text-cyan-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-gray-400">user@bytebuilder:~$ </span>
            <motion.span
              className="inline-block w-2 h-4 bg-cyan-400 ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.div>
        )}
      </div>

      {/* Command suggestions */}
      {!isTyping && (
        <motion.div
          className="mt-6 pt-4 border-t border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-xs text-gray-400 mb-2">Available commands:</div>
          <div className="flex flex-wrap gap-2">
            {['help', 'status', 'courses', 'projects', 'connect'].map((cmd) => (
              <span
                key={cmd}
                className="px-2 py-1 bg-gray-800 text-cyan-400 rounded text-xs border border-gray-600 hover:border-cyan-400 transition-colors cursor-pointer"
              >
                {cmd}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
} 