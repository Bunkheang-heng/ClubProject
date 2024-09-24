'use client'
import React, { useState } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 text-gray-900 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="bg-white shadow-2xl rounded-3xl p-10"
        >
          <h1 className="text-5xl font-extrabold mb-8 text-center text-purple-800">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5 }} 
              className="flex flex-col items-center bg-purple-50 p-6 rounded-lg shadow-md"
            >
              <FaPhone className="text-purple-700 text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Phone</h2>
              <p className="text-lg">+1 (123) 456-7890</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, delay: 0.1 }} 
              className="flex flex-col items-center bg-purple-50 p-6 rounded-lg shadow-md"
            >
              <FaEnvelope className="text-purple-700 text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Email</h2>
              <p className="text-lg">contact@bytebuildersclub.com</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, delay: 0.2 }} 
              className="flex flex-col items-center bg-purple-50 p-6 rounded-lg shadow-md"
            >
              <FaMapMarkerAlt className="text-purple-700 text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Address</h2>
              <p className="text-lg">123 Coding St, Tech City, TX 12345</p>
            </motion.div>
          </div>
          <div className="mb-8">
            <Image src="https://img.freepik.com/free-vector/hand-coding-concept-illustration_114360-8193.jpg" alt="Coding Illustration" width={500} height={300} className="rounded-lg shadow-md mx-auto" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                rows={4}
                required
              />
            </div>
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#6b46c1' }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Send Message
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
