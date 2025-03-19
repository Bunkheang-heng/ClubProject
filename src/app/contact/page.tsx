'use client'
import React, { useState } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="bg-white shadow-2xl rounded-3xl p-10"
        >
          <h1 className="text-5xl font-extrabold mb-8 text-center text-primary">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5 }} 
              className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-md"
            >
              <FaPhone className="text-primary text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Phone</h2>
              <p className="text-lg">+1 (123) 456-7890</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, delay: 0.1 }} 
              className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-md"
            >
              <FaEnvelope className="text-primary text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Email</h2>
              <p className="text-lg">contact@bytebuildersclub.com</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, delay: 0.2 }} 
              className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-md"
            >
              <FaMapMarkerAlt className="text-primary text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Address</h2>
              <p className="text-lg">123 Coding St, Tech City, TX 12345</p>
            </motion.div>
          </div>
          <div className="mb-8">
            <Image 
              src="https://img.freepik.com/free-vector/hand-coding-concept-illustration_114360-8193.jpg" 
              alt="Coding Illustration" 
              width={500} 
              height={300} 
              className="rounded-lg shadow-md mx-auto" 
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              ></textarea>
            </div>
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="inline-block bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                Send Message
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
