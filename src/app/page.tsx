import React from 'react'
import Nav from '../components/nav'
import Footer from '../components/footer'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <div className="bg-white shadow-lg rounded-xl p-10">
          <h1 className="text-5xl font-extrabold mb-8 text-center text-primary">Welcome to ByteBuilders Club</h1>
          <p className="mb-6 text-lg text-center">The ByteBuilders Club is dedicated to teaching students about coding. Our mission is to empower students with the skills and knowledge they need to excel in the field of technology.</p>
          <p className="mb-6 text-lg text-center">At ByteBuilders Club, we offer a variety of workshops, coding sessions, and collaborative projects to help students learn and grow. Our experienced mentors are here to guide you through every step of your coding journey.</p>
          <p className="mb-6 text-lg text-center">Join us to explore the exciting world of programming, develop your problem-solving skills, and connect with like-minded individuals who share your passion for technology.</p>
          <p className="mb-6 text-lg text-center">Whether you are a beginner or an experienced coder, ByteBuilders Club has something for everyone. We believe in hands-on learning and provide ample opportunities for you to apply what you learn in real-world scenarios.</p>
          <p className="mb-6 text-lg text-center">Stay updated with our latest events, coding challenges, and meetups by following us on our social media channels. We look forward to seeing you at our next session!</p>
          <div className="text-center mt-8">
            <Link href="/attendance" legacyBehavior>
              <a className="inline-block bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                Mark Attendance
              </a>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
