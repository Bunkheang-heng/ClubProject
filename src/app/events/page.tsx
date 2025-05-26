'use client';

import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaCode, FaTerminal, FaChevronRight, FaTimes } from 'react-icons/fa';
import { Calendar, Clock, MapPin, Users, Zap, Database, Activity, Eye, Cpu, Terminal, Shield, Wifi, Lock, Code2, Sparkles, Rocket } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';

interface Event {
  title: string;
  image: string;
  description: string;
  date: string;
  time: string;
  location: string;
  id: string;
}

const FloatingParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
    initial={{ 
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
      y: typeof window !== 'undefined' ? window.innerHeight + 10 : 1000,
      opacity: 0 
    }}
    animate={{ 
      y: -10, 
      opacity: [0, 1, 0],
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)
    }}
    transition={{ 
      duration: 8, 
      delay, 
      repeat: Infinity,
      ease: "linear" 
    }}
  />
);

const GlitchText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={`relative ${className}`}
    animate={{
      textShadow: [
        "0 0 0 transparent",
        "2px 0 0 #ff0080, -2px 0 0 #00ffff",
        "0 0 0 transparent"
      ]
    }}
    transition={{
      duration: 0.1,
      repeat: Infinity,
      repeatDelay: 3
    }}
  >
    {children}
  </motion.div>
);

const HolographicBorder = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-sm"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-lg animate-pulse"></div>
    <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-lg border border-cyan-500/30">
      {children}
    </div>
  </div>
);

const NeuralNetwork = () => {
  const nodes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="w-full h-full">
        {nodes.map((node, i) => (
          <g key={node.id}>
            {nodes.slice(i + 1).map((otherNode, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${otherNode.x}%`}
                y2={`${otherNode.y}%`}
                stroke="url(#eventGradient)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 3, delay: (i + j) * 0.1 }}
              />
            ))}
            <motion.circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="2"
              fill="#00ffff"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          </g>
        ))}
        <defs>
          <linearGradient id="eventGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="33%" stopColor="#ff00ff" />
            <stop offset="66%" stopColor="#ffff00" />
            <stop offset="100%" stopColor="#00ff00" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const MatrixRain = () => {
  const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
  const drops = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute text-green-400 font-mono text-xs"
          style={{ left: `${drop.x}%` }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: '100vh', opacity: [0, 1, 0] }}
          transition={{
            duration: 3,
            delay: drop.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {characters[Math.floor(Math.random() * characters.length)]}
        </motion.div>
      ))}
    </div>
  );
};

const EventCard = ({ event, onClick }: { event: Event; onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        boxShadow: "0 0 40px rgba(0, 255, 255, 0.4)"
      }}
      className="cursor-pointer group transition-all duration-500 perspective-1000"
      onClick={onClick}
    >
      <HolographicBorder>
        <div className="overflow-hidden relative">
          {/* Animated Header Bar */}
          <div className="bg-black/50 p-3 border-b border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Rocket className="w-5 h-5 text-cyan-400" />
                </motion.div>
                <span className="text-xs text-cyan-400 font-mono">EVENT_PROTOCOL_v2.1</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-200"></div>
              </div>
            </div>
          </div>

          {/* Image Section with Overlay Effects */}
      <div className="relative">
        <Image 
          src={event.image} 
          alt={event.title} 
          width={400} 
          height={200} 
          className="w-full h-48 object-cover" 
        />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
            
            {/* Scanning Line Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent h-1"
              animate={{ y: [0, 192, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Corner Brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400"></div>

            {/* Status Indicator */}
            <div className="absolute top-4 right-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 border border-green-400 rounded-full flex items-center justify-center bg-black/50"
              >
                <Activity className="w-4 h-4 text-green-400" />
              </motion.div>
        </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Title with Glitch Effect */}
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Code2 className="text-cyan-400 w-6 h-6" />
              </motion.div>
              <GlitchText>
                <h2 className="text-xl font-bold text-cyan-400 truncate">{event.title}</h2>
              </GlitchText>
            </div>
            
            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4">
              {event.description}
            </p>
            
            {/* Event Details Grid */}
            <div className="grid grid-cols-1 gap-3">
              <motion.div 
                className="flex items-center gap-3 p-2 rounded bg-black/30 border border-cyan-500/20"
                whileHover={{ borderColor: "rgba(0, 255, 255, 0.5)" }}
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-300">{event.date}</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-3 p-2 rounded bg-black/30 border border-purple-500/20"
                whileHover={{ borderColor: "rgba(168, 85, 247, 0.5)" }}
              >
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">{event.time}</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-3 p-2 rounded bg-black/30 border border-pink-500/20"
                whileHover={{ borderColor: "rgba(236, 72, 153, 0.5)" }}
              >
                <MapPin className="w-4 h-4 text-pink-400" />
                <span className="text-sm text-gray-300">{event.location}</span>
              </motion.div>
            </div>

            {/* Action Button */}
            <motion.div 
              className="mt-4 pt-4 border-t border-cyan-500/30"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center text-cyan-400 text-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Access Event Matrix</span>
                </div>
                <FaChevronRight className="w-3 h-3 text-cyan-400" />
          </div>
            </motion.div>
          </div>
        </div>
      </HolographicBorder>
    </motion.div>
  );
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 25 }, (_, i) => i));
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          image: doc.data().image,
          description: doc.data().description,
          date: doc.data().date,
          time: doc.data().time,
          location: doc.data().location
        }));
        
        // Add demo events if no events in database
        if (eventsList.length === 0) {
          const demoEvents: Event[] = [
            {
              id: 'demo-1',
              title: 'Neural Code Symposium 2024',
              image: '/api/placeholder/400/200',
              description: 'Dive into the future of programming with AI-assisted development, quantum algorithms, and neural network architectures.',
              date: '2024-03-15',
              time: '14:00',
              location: 'Cyber Arena Alpha'
            },
            {
              id: 'demo-2',
              title: 'Quantum Blockchain Summit',
              image: '/api/placeholder/400/200',
              description: 'Explore the intersection of quantum computing and blockchain technology in this mind-bending technical conference.',
              date: '2024-03-22',
              time: '10:00',
              location: 'Matrix Hall Beta'
            },
            {
              id: 'demo-3',
              title: 'Cybersecurity Nexus',
              image: '/api/placeholder/400/200',
              description: 'Advanced penetration testing, ethical hacking, and digital fortress construction in the modern cyber landscape.',
              date: '2024-03-29',
              time: '16:00',
              location: 'Security Vault Gamma'
            },
            {
              id: 'demo-4',
              title: 'AR/VR Reality Forge',
              image: '/api/placeholder/400/200',
              description: 'Build immersive virtual worlds and augmented reality experiences using cutting-edge development frameworks.',
              date: '2024-04-05',
              time: '13:00',
              location: 'Holodeck Delta'
            },
            {
              id: 'demo-5',
              title: 'Machine Learning Nexus',
              image: '/api/placeholder/400/200',
              description: 'Deep learning, neural networks, and AI model optimization for the next generation of intelligent systems.',
              date: '2024-04-12',
              time: '11:00',
              location: 'AI Core Epsilon'
            },
            {
              id: 'demo-6',
              title: 'DevOps Automation Matrix',
              image: '/api/placeholder/400/200',
              description: 'Container orchestration, CI/CD pipelines, and infrastructure as code in the cloud-native ecosystem.',
              date: '2024-04-19',
              time: '15:00',
              location: 'Cloud Station Zeta'
            }
          ];
          setEvents(demoEvents);
        } else {
        setEvents(eventsList);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 min-h-screen flex flex-col relative overflow-hidden">
      {/* Floating Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <FloatingParticle key={particle} delay={particle * 0.3} />
        ))}
      </AnimatePresence>

      {/* Neural Network Background */}
      <NeuralNetwork />
      
      {/* Matrix Rain Effect */}
      <MatrixRain />

      <Nav />
      
      {/* Epic Cyberpunk Header */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 mt-20 relative z-10"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
            filter: ["hue-rotate(0deg)", "hue-rotate(360deg)", "hue-rotate(0deg)"]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <GlitchText className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            NEURAL EVENTS
          </GlitchText>
        </motion.div>
        
        <motion.div 
          className="text-cyan-400 font-mono text-xl mt-4 mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          QUANTUM EVENT MATRIX v4.2.0
        </motion.div>
        
        <motion.div
          className="flex items-center justify-center gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 text-green-400">
            <Shield className="w-4 h-4" />
            <span className="text-sm">SECURE</span>
          </div>
          <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Wifi className="w-4 h-4" />
            <span className="text-sm">CONNECTED</span>
          </div>
          <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
          <div className="flex items-center gap-2 text-purple-400">
            <Lock className="w-4 h-4" />
            <span className="text-sm">ENCRYPTED</span>
            </div>
        </motion.div>
      </motion.div>

      <main className="flex-grow container mx-auto px-6 py-8 relative z-10">
            {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className="mb-6"
            >
              <Database className="text-cyan-400 w-16 h-16" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-cyan-400 font-mono text-lg"
            >
              Scanning neural event matrix...
            </motion.div>
            <div className="flex gap-1 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
              </div>
            ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
              >
                  <EventCard
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
              </motion.div>
                ))}
          </motion.div>
            )}
      </main>
      <Footer />

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: -15 }}
              className="max-w-5xl w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <HolographicBorder>
                <div className="relative overflow-hidden">
                  {/* Header with Terminal Style */}
                  <div className="bg-black/70 p-4 border-b border-cyan-500/30">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <Terminal className="text-cyan-400 w-8 h-8" />
                        </motion.div>
                        <div>
                          <GlitchText>
                            <h2 className="text-2xl font-bold text-cyan-400">{selectedEvent.title}</h2>
                          </GlitchText>
                          <div className="text-xs text-gray-400 font-mono mt-1">EVENT_DETAILS_v3.7.1</div>
                        </div>
                </div>
                <motion.button
                        whileHover={{ 
                          rotate: 90,
                          scale: 1.1,
                          boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)"
                        }}
                  onClick={() => setSelectedEvent(null)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-3 rounded-full border border-gray-600 hover:border-red-400 bg-black/50"
                >
                        <FaTimes className="text-xl" />
                </motion.button>
                    </div>
              </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column - Image and Description */}
                      <div className="space-y-6">
                        <div className="relative">
                <Image 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title} 
                  width={800} 
                  height={400} 
                  className="w-full h-64 object-cover rounded-lg" 
                />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent rounded-lg"></div>
                          
                          {/* Scanning Animation */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent h-1"
                            animate={{ y: [0, 256, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          />
                          
                          {/* Corner Brackets */}
                          <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-cyan-400"></div>
                          <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-cyan-400"></div>
                          <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-cyan-400"></div>
                          <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-cyan-400"></div>

                          {/* Status Badge */}
                          <div className="absolute top-4 right-4">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="px-3 py-1 bg-green-500/20 border border-green-400 rounded-full text-xs text-green-400 font-mono"
                            >
                              ACTIVE
                            </motion.div>
                          </div>
                        </div>

                        <div className="bg-black/30 p-6 rounded-lg border border-cyan-500/30">
                          <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Event Description
                          </h3>
                          <p className="text-gray-300 leading-relaxed">{selectedEvent.description}</p>
                        </div>
                      </div>

                      {/* Right Column - Details and Actions */}
                      <div className="space-y-6">
                        {/* Event Details */}
                        <div className="space-y-4">
                          <motion.div 
                            className="bg-black/30 p-6 rounded-lg border border-cyan-500/30"
                            whileHover={{ scale: 1.02, borderColor: "rgba(0, 255, 255, 0.5)" }}
                          >
                            <div className="flex items-center gap-3 text-cyan-400 mb-3">
                              <Calendar className="w-6 h-6" />
                              <span className="font-semibold text-lg">Event Date</span>
                            </div>
                            <p className="text-white text-xl font-mono">{selectedEvent.date}</p>
                          </motion.div>

                          <motion.div 
                            className="bg-black/30 p-6 rounded-lg border border-purple-500/30"
                            whileHover={{ scale: 1.02, borderColor: "rgba(168, 85, 247, 0.5)" }}
                          >
                            <div className="flex items-center gap-3 text-purple-400 mb-3">
                              <Clock className="w-6 h-6" />
                              <span className="font-semibold text-lg">Start Time</span>
                            </div>
                            <p className="text-white text-xl font-mono">{selectedEvent.time}</p>
                          </motion.div>

                          <motion.div 
                            className="bg-black/30 p-6 rounded-lg border border-pink-500/30"
                            whileHover={{ scale: 1.02, borderColor: "rgba(236, 72, 153, 0.5)" }}
                          >
                            <div className="flex items-center gap-3 text-pink-400 mb-3">
                              <MapPin className="w-6 h-6" />
                              <span className="font-semibold text-lg">Location</span>
                            </div>
                            <p className="text-white text-xl font-mono">{selectedEvent.location}</p>
                          </motion.div>
              </div>

                        {/* Action Buttons */}
              <div className="space-y-4">
                          <motion.button
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-3"
                          >
                            <Users className="w-5 h-5" />
                            Register for Event
                            <Rocket className="w-5 h-5" />
                          </motion.button>

                          <motion.button
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: "0 0 30px rgba(168, 85, 247, 0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg font-semibold text-purple-300 hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
                          >
                            <Sparkles className="w-5 h-5" />
                            Add to Calendar
                          </motion.button>
                    </div>

                        {/* System Info */}
                        <div className="bg-black/20 p-4 rounded-lg border border-gray-600/30">
                          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                            <span>EVENT_ID: {selectedEvent.id}</span>
                            <span>STATUS: ACTIVE</span>
                  </div>
                    </div>
                  </div>
                    </div>
                  </div>
                </div>
              </HolographicBorder>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
