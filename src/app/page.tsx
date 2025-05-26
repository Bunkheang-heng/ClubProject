'use client'
import React from 'react'
import Nav from '../components/nav'
import Footer from '../components/footer'
import HeroSection from '../components/homepage/HeroSection'
import FeaturesSection from '../components/homepage/FeaturesSection'
import CoursesSection from '../components/homepage/CoursesSection'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1E1E1E] text-gray-100">
      <Nav />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />
      </main>
      
      <Footer />
    </div>
  )
}
