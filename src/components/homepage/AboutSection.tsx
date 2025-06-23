'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HolographicLogo } from './HolographicLogo'
import { QuantumLoader } from './QuantumLoader'
import { CyberpunkTerminal } from './CyberpunkTerminal'
import { HolographicCard } from './HolographicCard'

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState('mission')

  const tabs = [
    { id: 'mission', label: 'MISSION', color: '#00ff41' },
    { id: 'vision', label: 'VISION', color: '#00d4ff' },
    { id: 'values', label: 'VALUES', color: '#ff0080' }
  ]

  const tabContent = {
    mission: {
      title: 'Our Mission',
      content: 'To empower AUPP students with practical coding skills and create a supportive community where young developers can learn, grow, and innovate together.',
      stats: [
        { label: 'Active Members', value: '50+' },
        { label: 'Projects Created', value: '20+' },
        { label: 'Workshops Held', value: '15+' }
      ]
    },
    vision: {
      title: 'Our Vision',
      content: 'To become AUPP\'s leading tech community, fostering innovation and preparing students for the digital future through hands-on learning and real-world projects.',
      stats: [
        { label: 'Campus Impact', value: '100%' },
        { label: 'Student Leaders', value: '10+' },
        { label: 'Tech Events', value: 'Monthly' }
      ]
    },
    values: {
      title: 'Our Values',
      content: 'Learning, Collaboration, Innovation, and Community - these core values guide our journey in building a stronger tech community at AUPP.',
      stats: [
        { label: 'Community Growth', value: '200%' },
        { label: 'Student Engagement', value: 'High' },
        { label: 'Learning Rate', value: 'Continuous' }
      ]
    }
  }

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-black/90 to-gray-900/80" />
      
      {/* Animated circuit patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #00ff41 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #00d4ff 1px, transparent 1px),
            linear-gradient(45deg, transparent 48%, rgba(0,255,65,0.1) 49%, rgba(0,255,65,0.1) 51%, transparent 52%)
          `,
          backgroundSize: '100px 100px, 150px 150px, 200px 200px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header with holographic logo */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <HolographicLogo />
          
          <motion.h2 
            className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-green-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            ABOUT BYTEBUILDER
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-400 font-mono max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-cyan-400">// </span>
            AUPP's premier coding club empowering the next generation of developers
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Interactive tabs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Tab navigation */}
            <div className="flex gap-2 mb-8">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-mono font-bold rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-green-500 text-black'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: activeTab === tab.id ? `0 0 20px ${tab.color}40` : 'none'
                  }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Tab content */}
            <HolographicCard glowColor={tabs.find(t => t.id === activeTab)?.color || '#00ff41'}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h3 className="text-3xl font-bold text-white mb-4">
                  {tabContent[activeTab as keyof typeof tabContent].title}
                </h3>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  {tabContent[activeTab as keyof typeof tabContent].content}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  {tabContent[activeTab as keyof typeof tabContent].stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-2xl font-bold text-cyan-400 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Loading indicator */}
                <div className="flex justify-center pt-4">
                  <QuantumLoader size="sm" text="Loading..." />
                </div>
              </motion.div>
            </HolographicCard>
          </motion.div>

          {/* Right side - Cyberpunk Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <CyberpunkTerminal />
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="px-12 py-4 bg-gradient-to-r from-purple-500 via-cyan-500 to-green-500 text-black font-bold text-lg rounded-lg relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">Join Our Community</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection