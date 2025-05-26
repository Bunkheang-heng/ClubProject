'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CodeLine {
  text: string
  color: string
  delay: number
}

export const InteractiveCodeEditor = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [displayedCode, setDisplayedCode] = useState<string[]>([])

  const codeLines: CodeLine[] = [
    { text: "// Welcome to ByteBuilder Coding Club", color: "#6A9955", delay: 50 },
    { text: "", color: "", delay: 100 },
    { text: "class Developer {", color: "#569CD6", delay: 80 },
    { text: "  constructor(name, passion) {", color: "#DCDCAA", delay: 60 },
    { text: "    this.name = name;", color: "#9CDCFE", delay: 40 },
    { text: "    this.passion = passion;", color: "#9CDCFE", delay: 40 },
    { text: "    this.skills = [];", color: "#9CDCFE", delay: 40 },
    { text: "  }", color: "#DCDCAA", delay: 60 },
    { text: "", color: "", delay: 100 },
    { text: "  async learnNewSkill(skill) {", color: "#DCDCAA", delay: 60 },
    { text: "    console.log(`Learning ${skill}...`);", color: "#CE9178", delay: 40 },
    { text: "    await this.practice(skill);", color: "#9CDCFE", delay: 40 },
    { text: "    this.skills.push(skill);", color: "#9CDCFE", delay: 40 },
    { text: "    return 'Skill acquired! 🚀';", color: "#CE9178", delay: 40 },
    { text: "  }", color: "#DCDCAA", delay: 60 },
    { text: "}", color: "#569CD6", delay: 80 },
    { text: "", color: "", delay: 100 },
    { text: "const you = new Developer('Future Coder', 'Innovation');", color: "#4EC9B0", delay: 40 },
    { text: "you.learnNewSkill('React').then(console.log);", color: "#9CDCFE", delay: 40 },
  ]

  useEffect(() => {
    if (currentLineIndex >= codeLines.length) return

    const currentLine = codeLines[currentLineIndex]
    
    if (currentCharIndex < currentLine.text.length) {
      const timer = setTimeout(() => {
        setDisplayedCode(prev => {
          const newCode = [...prev]
          if (!newCode[currentLineIndex]) {
            newCode[currentLineIndex] = ''
          }
          newCode[currentLineIndex] += currentLine.text[currentCharIndex]
          return newCode
        })
        setCurrentCharIndex(prev => prev + 1)
      }, currentLine.delay)

      return () => clearTimeout(timer)
    } else {
      // Move to next line
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1)
        setCurrentCharIndex(0)
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [currentLineIndex, currentCharIndex, codeLines])

  return (
    <motion.div 
      className="bg-[#1E1E1E] rounded-lg border border-cyan-500/30 overflow-hidden shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* VS Code-like header */}
      <div className="bg-[#2D2D30] px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-300 text-sm ml-4 font-mono">developer.js</span>
        </div>
        <div className="text-cyan-400 text-xs font-mono">ByteBuilder IDE</div>
      </div>

      {/* Code content */}
      <div className="p-6 font-mono text-sm min-h-[400px] relative">
        {/* Line numbers */}
        <div className="absolute left-2 top-6 text-gray-500 text-right pr-4 select-none">
          {displayedCode.map((_, index) => (
            <div key={index} className="leading-6">
              {index + 1}
            </div>
          ))}
        </div>

        {/* Code lines */}
        <div className="ml-12">
          {displayedCode.map((line, index) => (
            <motion.div
              key={index}
              className="leading-6 min-h-[24px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              <span 
                style={{ color: codeLines[index]?.color || '#D4D4D4' }}
                dangerouslySetInnerHTML={{ __html: (line || '').replace(/`([^`]+)`/g, '<span style="color: #CE9178">$1</span>') }}
              />
              {index === currentLineIndex && currentCharIndex < (codeLines[currentLineIndex]?.text.length || 0) && (
                <span className="animate-pulse text-cyan-400">|</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Syntax highlighting overlay effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-green-500 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-cyan-500 opacity-50"></div>
        </div>
      </div>
    </motion.div>
  )
} 