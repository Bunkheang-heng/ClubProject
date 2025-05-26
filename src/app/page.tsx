'use client'
import React from 'react'
import Nav from '../components/nav'
import Footer from '../components/footer'
import HeroSection from '../components/homepage/HeroSection'
import FeaturesSection from '../components/homepage/FeaturesSection'
import CoursesSection from '../components/homepage/CoursesSection'
import AboutSection from '../components/homepage/AboutSection'
import { MatrixRain } from '../components/homepage/MatrixRain'
import { NeuralNetwork } from '../components/homepage/NeuralNetwork'
import { ParticleSystem } from '../components/homepage/ParticleSystem'
import { QuantumFAB } from '../components/homepage/QuantumFAB'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 relative overflow-hidden">
      {/* Background Effects */}
      <MatrixRain />
      <NeuralNetwork />
      <ParticleSystem />
      
      {/* Main Content */}
      <div className="relative z-20">
        <Nav />
        
        <main className="flex-grow">
          <HeroSection />
          <FeaturesSection />
          <AboutSection />
          <CoursesSection />
        </main>
        
        <Footer />
      </div>
      
      {/* Quantum FAB */}
      <QuantumFAB />
    </div>
  )
}
