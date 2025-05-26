'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaCode, FaTerminal } from 'react-icons/fa'
import { CodeAnimation } from './CodeAnimation'
import { FloatingIcons } from './FloatingIcons'
import { TerminalEffect } from './TerminalEffect'

const HeroSection = () => {
  return (
    <div className="bg-[#252526] pt-24 relative overflow-hidden">
      <FloatingIcons />
      <div className="container mx-auto px-4 py-16 relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2 mb-8 md:mb-0 z-10"
          >
            <TerminalEffect>
              <div className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-700">
                <div className="inline-block">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                    className="h-1 bg-gradient-to-r from-green-400 to-green-600 mb-4"
                  />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  <motion.span 
                    className="text-green-400 inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    &lt;ByteBuilder/&gt;
                  </motion.span>
                  <br />
                  <motion.span 
                    className="text-gray-300 inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Coding Club
                  </motion.span>
                </h1>
                <motion.p 
                  className="text-xl text-gray-400 mb-8 font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  console.log(<span className="text-green-400">"Welcome to the future of coding"</span>);
                </motion.p>
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link 
                    href="/attendance" 
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaTerminal className="inline-block" />
                    Mark Attendance
                  </Link>
                  <Link 
                    href="/events" 
                    className="px-6 py-3 bg-[#1E1E1E] hover:bg-[#252526] text-green-400 border border-green-400 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaCode className="inline-block" />
                    View Events
                  </Link>
                </motion.div>
              </div>
            </TerminalEffect>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-lg transform rotate-3"></div>
            <Image 
              src="https://cdn.pixabay.com/photo/2018/05/08/08/44/artificial-intelligence-3382507_1280.jpg"
              alt="Modern Technology and AI Illustration" 
              width={600} 
              height={400} 
              className="w-full rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform -rotate-3 hover:rotate-0"
              priority
            />
          </motion.div>
        </div>
      </div>
      <CodeAnimation />
    </div>
  )
}

export default HeroSection 