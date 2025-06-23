'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaCode, FaTerminal, FaRocket, FaBolt } from 'react-icons/fa'
import { InteractiveCodeEditor } from './InteractiveCodeEditor'

const HeroSection = () => {
  return (
    <div className="pt-24 relative overflow-hidden min-h-screen flex items-center">
      {/* Cyberpunk grid overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,65,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Glitch effect title */}
            <div className="relative">
              <motion.h1 
                className="text-6xl md:text-8xl font-black mb-6 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                  BYTE
                </span>
                <br />
                <span className="text-white relative">
                  BUILDER
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 opacity-20"
                    animate={{ 
                      scaleX: [0, 1, 0],
                      opacity: [0, 0.3, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                </span>
              </motion.h1>
              
              {/* Holographic subtitle */}
              <motion.div
                className="text-2xl md:text-3xl font-mono text-cyan-400 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-gray-400">{'>'}</span> Coding Club
                <motion.span 
                  className="animate-pulse text-green-400"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  _
                </motion.span>
              </motion.div>
            </div>

            {/* Futuristic description */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xl text-gray-300 font-mono leading-relaxed">
                <span className="text-cyan-400">const</span> <span className="text-yellow-400">future</span> = <span className="text-green-400">await</span> <span className="text-purple-400">buildSkills</span>();
              </p>
              <p className="text-lg text-gray-400">
                Join the next generation of developers. Master cutting-edge technologies, 
                build revolutionary projects, and shape the digital future.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link 
                href="/attendance" 
                className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  <FaRocket className="text-lg" />
                  Launch Session
                </div>
              </Link>
              
              <Link 
                href="/events" 
                className="group relative px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25"
              >
                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  <FaBolt className="text-lg" />
                  Explore Events
                </div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {[
                { number: "500+", label: "Students" },
                { number: "50+", label: "Projects" },
                { number: "24/7", label: "Support" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-green-400">{stat.number}</div>
                  <div className="text-sm text-gray-400 font-mono">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Interactive Code Editor */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <InteractiveCodeEditor />
            
            {/* Floating elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full opacity-60"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full opacity-60"
              animate={{ 
                y: [0, 10, 0],
                scale: [1, 0.9, 1]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection 