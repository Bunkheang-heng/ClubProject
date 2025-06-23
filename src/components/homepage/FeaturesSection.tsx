'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FaCode, FaLaptop, FaUsers, FaRocket, FaBrain, FaShieldAlt } from 'react-icons/fa'
import { HolographicCard } from './HolographicCard'

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaBrain className="text-4xl text-cyan-400" />,
      title: "Python Mastery",
      description: "Master Python programming with hands-on projects and real-world applications. Perfect for beginners and advanced learners.",
      color: "#00d4ff"
    },
    {
      icon: <FaCode className="text-4xl text-green-400" />,
      title: "C++ Development",
      description: "Learn C++ from fundamentals to advanced concepts. Build high-performance applications and understand system programming.",
      color: "#00ff41"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-purple-400" />,
      title: "Java Programming",
      description: "Comprehensive Java course covering OOP, data structures, and enterprise development. Create robust applications.",
      color: "#a855f7"
    },
    {
      icon: <FaRocket className="text-4xl text-orange-400" />,
      title: "Project Portfolio",
      description: "Build a strong portfolio with practical projects in Python, C++, and Java. Showcase your skills to potential employers.",
      color: "#fb923c"
    },
    {
      icon: <FaUsers className="text-4xl text-pink-400" />,
      title: "Peer Learning",
      description: "Join study groups and collaborate with fellow learners. Share knowledge and solve coding challenges together.",
      color: "#f472b6"
    },
    {
      icon: <FaLaptop className="text-4xl text-yellow-400" />,
      title: "Code Practice",
      description: "Access our extensive collection of coding exercises and challenges to sharpen your programming skills.",
      color: "#fbbf24"
    }
  ]

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Section background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black/80 to-gray-900/50" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-green-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            OUR COURSES
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 font-mono max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-cyan-400">// </span>
            Master programming with our comprehensive Python, C++, and Java courses
          </motion.p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <HolographicCard 
                glowColor={feature.color}
                className="h-full"
              >
                <div className="space-y-4">
                  {/* Icon with glow effect */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full blur-xl opacity-50"
                      style={{ backgroundColor: feature.color }}
                    />
                    <div className="relative">
                      {feature.icon}
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Status indicator */}
                  <div className="flex items-center gap-2 pt-4">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: feature.color }}
                    />
                    <span className="text-xs font-mono text-gray-400">
                      STATUS: ACTIVE
                    </span>
                  </div>
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold text-lg rounded-lg relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">Start Learning Now</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection