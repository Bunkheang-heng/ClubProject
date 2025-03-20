'use client'
import React from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutUs() {
  const mentors = [
    { name: "Serey Muniek Vissot Sina", role: "Club Leader", image: "/image/vissot.png" },
    { name: "Chun Paulen", role: "Mobile App Specialist", image: "/image/paulen.png" },
    { name: "Mike Johnson", role: "Data Science Expert", image: "/images/vissot.jpg" },
    { name: "Emily Brown", role: "AI Research Lead", image: "/images/vissot.jpg" },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow">
        <div className="bg-white shadow-lg rounded-xl p-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="flex justify-center mb-6">
              <Image 
                src="/image/school.png" 
                alt="American University of Phnom Penh" 
                width={200} 
                height={200} 
                className="mx-auto" 
              />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-primary">American University of Phnom Penh</h2>
            <p className="text-xl text-red-600 italic mb-6">"Study Locally. Live Globally."</p>
            <div className="max-w-3xl mx-auto">
              <p className="mb-4 text-lg">
                American University of Phnom Penh (AUPP) is a premier higher education institution in Cambodia, 
                offering American-style education with internationally recognized degree programs. Founded to provide 
                Cambodian students with access to high-quality education without leaving their home country, AUPP 
                prepares students to become global leaders in their chosen fields.
              </p>
              <p className="text-lg">
                With state-of-the-art facilities and a diverse faculty of international and local experts, 
                AUPP creates an engaging learning environment where students develop critical thinking skills
                and global perspectives essential for success in today's interconnected world.
              </p>
            </div>
          </motion.div>

          <h1 className="text-5xl font-extrabold mb-8 text-center text-primary">About ByteBuilders Club</h1>
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image 
                  src="https://www.codingdojo.com/blog/wp-content/uploads/Can-Anyone-Really-Learn-How-to-Code_cover-01.jpg" 
                  alt="ByteBuilders Club members" 
                  width={500} 
                  height={300} 
                  className="rounded-lg shadow-md" 
                />
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="mb-4 text-lg">ByteBuilders Club is a vibrant community of passionate coders and technology enthusiasts at American University of Phnom Penh. Founded in 2023, we&apos;ve grown into a diverse group with members from various backgrounds and skill levels.</p>
                <p className="mb-4 text-lg">Our mission is to empower AUPP students with the skills and knowledge they need to excel in the ever-evolving field of technology, complementing the university's commitment to academic excellence.</p>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-blue-50 p-6 rounded-lg shadow border border-blue-200 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary">ByteBuilders at AUPP</h2>
            <p className="mb-4 text-lg">
              As one of AUPP's most active student organizations, ByteBuilders Club enhances the university's 
              technology education by providing practical, hands-on learning experiences. We collaborate closely 
              with AUPP's Faculty of Information Technology to organize events, workshops, and projects that 
              complement classroom learning.
            </p>
            <p className="text-lg">
              Through our activities, members gain valuable real-world experience while supporting AUPP's mission 
              to develop well-rounded graduates prepared for global careers in technology and innovation.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-50 p-6 rounded-lg shadow border border-gray-200"
            >
              <h2 className="text-2xl font-bold mb-4 text-primary">What We Offer</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Engaging workshops and coding sessions</li>
                <li>Collaborative projects</li>
                <li>Mentorship from industry professionals</li>
                <li>Hands-on learning experiences</li>
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gray-50 p-6 rounded-lg shadow border border-gray-200"
            >
              <h2 className="text-2xl font-bold mb-4 text-primary">Our Focus Areas</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Web development</li>
                <li>Mobile app creation</li>
                <li>Data science</li>
                <li>Artificial intelligence</li>
                <li>Soft skills development</li>
              </ul>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">Our Mentors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors.map((mentor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index + 0.7 }}
                  className="bg-white p-4 rounded-lg shadow-md text-center border border-gray-200"
                >
                  <Image 
                    src={mentor.image} 
                    alt={mentor.name} 
                    width={200} 
                    height={200} 
                    className="rounded-full mx-auto mb-4 border-4 border-primary" 
                  />
                  <h3 className="text-xl font-semibold mb-2">{mentor.name}</h3>
                  <p className="text-gray-600">{mentor.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-6 text-lg text-center"
          >
            Whether you&apos;re a beginner or an experienced coder, ByteBuilders Club has something for every AUPP student. Join us to explore the exciting world of programming, develop your problem-solving skills, and connect with like-minded individuals who share your passion for technology.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center mt-8"
          >
            <Link href="/events" legacyBehavior>
              <a className="inline-block bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                View Upcoming Events
              </a>
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
