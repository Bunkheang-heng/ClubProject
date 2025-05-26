'use client'
import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaTerminal, FaCode, FaChevronRight } from 'react-icons/fa';
import { Mail, Phone, MapPin, Send, Wifi, Shield, Lock, Database, Activity, Eye, Zap, Sparkles, Rocket, Terminal, Code2 } from 'lucide-react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const nodes = Array.from({ length: 12 }, (_, i) => ({
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
                stroke="url(#contactGradient)"
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
          <linearGradient id="contactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
  const drops = Array.from({ length: 40 }, (_, i) => ({
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

const TypewriterText = ({ text, delay = 30, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, delay, text, onComplete]);

  return <span>{displayText}<span className="animate-blink text-cyan-400">|</span></span>;
};

const TerminalEffect = ({ children }: { children: React.ReactNode }) => {
  return (
    <HolographicBorder className="relative">
      <div className="absolute -top-6 left-0 right-0 h-6 bg-black/80 rounded-t-lg flex items-center px-4 border border-cyan-500/30 border-b-0">
        <div className="flex space-x-2">
          <motion.div 
            className="w-3 h-3 rounded-full bg-red-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="w-3 h-3 rounded-full bg-yellow-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div 
            className="w-3 h-3 rounded-full bg-green-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          />
        </div>
        <div className="ml-4 text-xs text-cyan-400 font-mono flex items-center gap-2">
          <Terminal className="w-3 h-3" />
          contact@neural-matrix:~
        </div>
      </div>
      {children}
    </HolographicBorder>
  );
};

const TerminalLine = ({ command, response, isActive, onComplete }: { command: string; response: string; isActive: boolean; onComplete?: () => void }) => {
  const [showCommand, setShowCommand] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowCommand(false);
      setShowResponse(false);
      const timer = setTimeout(() => {
        setShowCommand(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleCommandComplete = () => {
    setTimeout(() => {
      setShowResponse(true);
    }, 300);
  };

  const handleResponseComplete = () => {
    if (onComplete) {
      setTimeout(() => onComplete(), 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-4 font-mono"
    >
      <div className="flex items-center text-cyan-400 mb-1">
        <FaChevronRight className="mr-2" />
        {showCommand && isActive ? (
          <TypewriterText text={command} onComplete={handleCommandComplete} />
        ) : isActive ? (
          <span className="animate-blink text-cyan-400">|</span>
        ) : (
          <span>{command}</span>
        )}
      </div>
      {showResponse && isActive ? (
        <div className="ml-6 text-gray-300">
          <TypewriterText text={response} delay={50} onComplete={handleResponseComplete} />
        </div>
      ) : showCommand && !isActive && response ? (
        <div className="ml-6 text-gray-300">{response}</div>
      ) : null}
    </motion.div>
  );
};

const TerminalSequence = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const lines = [
    { command: "initialize neural_contact_matrix", response: "Neural Contact Matrix v3.7.1 initialized" },
    { command: "scan available_channels", response: "Found: [quantum_mail, neural_phone, holographic_location]" },
    { command: "activate communication_protocols", response: "All communication channels are now active" },
    { command: "echo 'Ready for neural link?'", response: "System ready. Awaiting your transmission..." }
  ];

  const handleLineComplete = () => {
    if (currentLine < lines.length - 1) {
      setCurrentLine(prev => prev + 1);
    }
  };

  return (
    <div className="mb-8 font-mono">
      {lines.map((line, index) => (
        <TerminalLine
          key={index}
          command={line.command}
          response={line.response}
          isActive={index === currentLine}
          onComplete={index === currentLine ? handleLineComplete : undefined}
        />
      ))}
    </div>
  );
};

const ContactCard = ({ icon: Icon, title, content, delay, color }: { icon: any; title: string; content: string; delay: number; color: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30, rotateX: -15 }} 
    animate={{ opacity: 1, y: 0, rotateX: 0 }} 
    whileHover={{ 
      scale: 1.05,
      rotateY: 5,
      boxShadow: `0 0 40px ${color}40`
    }}
    transition={{ duration: 0.5, delay }} 
    className="group cursor-pointer"
  >
    <HolographicBorder>
      <div className="p-8 text-center relative overflow-hidden">
        {/* Scanning Line Effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-b from-transparent via-${color}/20 to-transparent h-1`}
          animate={{ y: [0, 200, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Corner Brackets */}
        <div className={`absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-${color}`}></div>
        <div className={`absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-${color}`}></div>
        <div className={`absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-${color}`}></div>
        <div className={`absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-${color}`}></div>

        <motion.div
          whileHover={{ 
            rotate: 360,
            scale: 1.2
          }}
          transition={{ duration: 0.8 }}
          className="mb-6 relative"
        >
          <div className={`absolute inset-0 bg-${color} rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity`} />
          <Icon className={`text-${color} text-5xl relative z-10`} />
        </motion.div>
        
        <GlitchText>
          <h2 className={`text-2xl font-bold mb-4 text-${color}`}>{title}</h2>
        </GlitchText>
        
        <p className="text-gray-300 font-mono text-sm leading-relaxed">{content}</p>
        
        {/* Status Indicator */}
        <div className="mt-4 flex justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-3 h-3 rounded-full bg-${color} shadow-lg`}
          />
        </div>
      </div>
    </HolographicBorder>
  </motion.div>
);

const SocialLink = ({ icon: Icon, href, label }: { icon: any; href: string; label: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ 
      scale: 1.2, 
      rotate: 360,
      boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)"
    }}
    transition={{ duration: 0.5 }}
    className="relative group"
  >
    <HolographicBorder className="p-4">
      <div className="absolute inset-0 bg-cyan-400 rounded-lg blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
      <Icon className="text-2xl text-cyan-400 relative z-10 group-hover:text-white transition-colors" />
    </HolographicBorder>
    <span className="sr-only">{label}</span>
  </motion.a>
);

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => i));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTerminal(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Neural transmission successful! Message sent to the matrix.', {
      style: {
        background: '#1a1a1a',
        color: '#00ffff',
        border: '1px solid #00ffff'
      }
    });
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 min-h-screen flex flex-col relative overflow-hidden">
      {/* Floating Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <FloatingParticle key={particle} delay={particle * 0.4} />
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
            NEURAL CONTACT
          </GlitchText>
        </motion.div>
        
        <motion.div 
          className="text-cyan-400 font-mono text-xl mt-4 mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          QUANTUM COMMUNICATION MATRIX v5.1.3
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

      <div className="container mx-auto p-6 flex-grow relative z-10">
        <TerminalEffect>
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="p-8"
          >
            {showTerminal && <TerminalSequence />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <ContactCard 
                icon={Phone} 
                title="Quantum Phone" 
                content="+1 (123) 456-7890" 
                delay={0.1} 
                color="cyan-400"
              />
              <ContactCard 
                icon={Mail} 
                title="Neural Mail" 
                content="contact@neural-matrix.com" 
                delay={0.2} 
                color="purple-400"
              />
              <ContactCard 
                icon={MapPin} 
                title="Holographic Location" 
                content="Cyber District Alpha, Neural City" 
                delay={0.3} 
                color="pink-400"
              />
            </div>

            <motion.div 
              className="flex justify-center mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <HolographicBorder className="relative group">
                <div className="p-4 relative overflow-hidden">
                  {/* Scanning Line Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent h-1"
                    animate={{ y: [0, 300, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Corner Brackets */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400"></div>

                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image 
                      src="https://img.freepik.com/free-vector/hand-coding-concept-illustration_114360-8193.jpg" 
                      alt="Neural Coding Interface" 
                      width={500} 
                      height={300} 
                      className="rounded-lg relative z-10" 
                    />
                  </motion.div>
                  
                  {/* Holographic Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </HolographicBorder>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <HolographicBorder>
                  <div className="p-8 relative overflow-hidden">
                    {/* Header with Terminal Style */}
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <Database className="text-cyan-400 w-8 h-8" />
                      </motion.div>
                      <div>
                        <GlitchText>
                          <h2 className="text-2xl font-bold text-cyan-400">Neural Network Links</h2>
                        </GlitchText>
                        <div className="text-xs text-gray-400 font-mono mt-1">SOCIAL_MATRIX_v2.4.1</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-8 font-mono text-sm leading-relaxed">
                      Connect to our distributed social network nodes for real-time updates on quantum events, neural workshops, and cybernetic coding challenges.
                    </p>
                    
                    <div className="flex gap-4 justify-center">
                      <SocialLink icon={FaGithub} href="https://github.com" label="GitHub Neural Repository" />
                      <SocialLink icon={FaLinkedin} href="https://linkedin.com" label="Professional Matrix" />
                      <SocialLink icon={FaTwitter} href="https://twitter.com" label="Quantum Feed" />
                    </div>

                    {/* Status Indicators */}
                    <div className="mt-8 grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"
                        />
                        <span className="text-xs text-green-400 font-mono">ONLINE</span>
                      </div>
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                          className="w-3 h-3 bg-cyan-400 rounded-full mx-auto mb-2"
                        />
                        <span className="text-xs text-cyan-400 font-mono">ACTIVE</span>
                      </div>
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                          className="w-3 h-3 bg-purple-400 rounded-full mx-auto mb-2"
                        />
                        <span className="text-xs text-purple-400 font-mono">SECURE</span>
                      </div>
                    </div>
                  </div>
                </HolographicBorder>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <HolographicBorder>
                  <div className="p-8 relative overflow-hidden">
                    {/* Header with Terminal Style */}
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                      >
                        <Send className="text-cyan-400 w-8 h-8" />
                      </motion.div>
                      <div>
                        <GlitchText>
                          <h2 className="text-2xl font-bold text-cyan-400">Quantum Transmission</h2>
                        </GlitchText>
                        <div className="text-xs text-gray-400 font-mono mt-1">MESSAGE_PROTOCOL_v3.1.7</div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-mono text-cyan-400 mb-2 flex items-center gap-2">
                          <Code2 className="w-4 h-4" />
                          Neural Identifier
                        </label>
                        <motion.input
                          whileFocus={{ 
                            scale: 1.02,
                            boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)"
                          }}
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-cyan-400 font-mono placeholder-gray-500 transition-all duration-300"
                          placeholder="Enter your neural ID..."
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-mono text-purple-400 mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Quantum Address
                        </label>
                        <motion.input
                          whileFocus={{ 
                            scale: 1.02,
                            boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)"
                          }}
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-purple-400 font-mono placeholder-gray-500 transition-all duration-300"
                          placeholder="your.neural@matrix.net"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-mono text-pink-400 mb-2 flex items-center gap-2">
                          <Terminal className="w-4 h-4" />
                          Neural Message
                        </label>
                        <motion.textarea
                          whileFocus={{ 
                            scale: 1.02,
                            boxShadow: "0 0 20px rgba(236, 72, 153, 0.3)"
                          }}
                          id="message"
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-pink-400 font-mono placeholder-gray-500 transition-all duration-300 resize-none"
                          placeholder="Transmit your neural thoughts..."
                          required
                        />
                      </div>
                      
                      <div className="text-center pt-4">
                        <motion.button
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 0 40px rgba(0, 255, 255, 0.5)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-3 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Database className="w-5 h-5" />
                              </motion.div>
                              <span>Transmitting to Matrix...</span>
                            </>
                          ) : (
                            <>
                              <Rocket className="w-5 h-5" />
                              <span>Initialize Neural Link</span>
                              <Sparkles className="w-5 h-5" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </HolographicBorder>
              </motion.div>
            </div>
          </motion.div>
        </TerminalEffect>
      </div>
      
      <Footer />
      
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: '#1a1a1a',
          color: '#00ffff',
          border: '1px solid #00ffff',
          fontFamily: 'monospace'
        }}
      />
    </div>
  );
}
