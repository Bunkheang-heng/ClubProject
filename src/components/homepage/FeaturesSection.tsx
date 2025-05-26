'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FaCode, FaLaptop, FaUsers, FaRocket } from 'react-icons/fa'

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaCode className="text-4xl text-green-400" />,
      title: "Learn to Code",
      description: "Master programming fundamentals through hands-on projects and expert guidance."
    },
    {
      icon: <FaLaptop className="text-4xl text-green-400" />,
      title: "Build Projects",
      description: "Create real-world applications and build your portfolio."
    },
    {
      icon: <FaUsers className="text-4xl text-green-400" />,
      title: "Join Community",
      description: "Connect with like-minded peers and grow together."
    },
    {
      icon: <FaRocket className="text-4xl text-green-400" />,
      title: "Launch Career",
      description: "Prepare for your future in technology and innovation."
    }
  ]

  return (
    <section className="py-20 bg-[#1E1E1E] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-green-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Join <span className="text-green-400">&lt;ByteBuilder/&gt;</span>?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
              }}
              className="bg-[#252526] p-6 rounded-lg border border-gray-700 hover:border-green-400 transition-all duration-300"
            >
              <motion.div 
                className="mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-green-400">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection 