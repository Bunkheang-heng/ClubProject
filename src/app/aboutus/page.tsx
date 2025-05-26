'use client'
import React, { useState, useEffect, useRef } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  FaCode, FaLaptop, FaUsers, FaRocket, FaTerminal, FaGithub, 
  FaLinkedin, FaTwitter, FaChevronRight, FaCube, FaDatabase,
  FaMicrochip, FaNetworkWired, FaBrain, FaAtom
} from 'react-icons/fa';

// Matrix Rain Effect Component
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0"
    />
  );
};

// Glitch Text Effect
const GlitchText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 animate-glitch-1 text-red-500 opacity-70">
        {children}
      </div>
      <div className="absolute inset-0 animate-glitch-2 text-blue-500 opacity-70">
        {children}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Holographic Card Component
const HolographicCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 ${className}`}
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 255, 0.1) 0%, transparent 50%)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Floating Particles
const FloatingParticles = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only access window on client side
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (dimensions.width === 0) return null; // Don't render until we have dimensions

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          animate={{
            x: [0, Math.random() * dimensions.width],
            y: [0, Math.random() * dimensions.height],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: Math.random() * dimensions.width,
            top: Math.random() * dimensions.height,
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Terminal Effect
const TerminalEffect = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-xl flex items-center px-4 border-b border-cyan-400/30">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-200"></div>
        </div>
        <div className="ml-4 text-xs text-gray-400 font-mono">ByteBuilders Terminal v2.0.1</div>
      </div>
      <div className="relative border border-cyan-400/30 rounded-xl bg-black/80 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};

// Enhanced Typewriter with Syntax Highlighting
const TypewriterCode = ({ code, language = "javascript" }: { code: string; language?: string }) => {
  const [displayCode, setDisplayCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayCode(prev => prev + code[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, code]);

  return (
    <div className="bg-black/90 p-6 rounded-xl border border-cyan-400/30 font-mono text-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-cyan-400 text-xs ml-2">ByteBuilders.{language}</span>
      </div>
      <pre className="text-green-400">
        <code>
          {displayCode}
          <span className="animate-pulse text-white">|</span>
        </code>
      </pre>
    </div>
  );
};

// 3D Rotating Cube
const RotatingCube = () => {
  return (
    <div className="perspective-1000">
      <motion.div
        className="w-20 h-20 relative transform-style-preserve-3d"
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 flex items-center justify-center"
            style={{
              transform: `rotateY(${i * 90}deg) translateZ(40px)`,
            }}
          >
            <FaCube className="text-cyan-400" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function AboutUs() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  const mentors = [
    { 
      name: "Serey Muniek Vissot Sina", 
      role: "Club Leader", 
      image: "/image/vissot.png",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      specialty: "Full Stack Architecture"
    },
    { 
      name: "Chun Paulen", 
      role: "C++ Assistant", 
      image: "/image/paulen.png",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      specialty: "Systems Programming"
    },
    { 
      name: "Nang Vanneth", 
      role: "Club Officer", 
      image: "/image/vanneth.png",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      specialty: "Project Management"
    },
    { 
      name: "Hieng Dara", 
      role: "C++ Mentor", 
      image: "/image/dara.png",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      specialty: "Algorithm Design"
    },
    { 
      name: "Keang Hok", 
      role: "Python Mentor", 
      image: "/image/gmk.png",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      specialty: "Data Science & AI"
    },
    { 
      name: "HENG Bunkheang", 
      role: "ByteBuilders Club Web Developer", 
      image: "/image/bunkheang.png",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      specialty: "Frontend Innovation"
    },
  ];

  const clubCode = `class ByteBuilders {
  constructor() {
    this.founded = 2023;
    this.location = "AUPP";
    this.mission = "Empower students with tech skills";
    this.vision = "Building the future, one byte at a time";
  }

  async innovate() {
    const creativity = await this.unleashPotential();
    const technology = await this.masterSkills();
    return this.buildFuture(creativity, technology);
  }

  collaborate() {
    return this.members.map(member => 
      member.skills.combine(this.knowledge)
    );
  }

  build() {
    return "Next Generation Tech Leaders";
  }
}

const byteBuilders = new ByteBuilders();
byteBuilders.innovate().then(future => {
  console.log("🚀 Future built successfully!");
});`;

  const techStack = [
    { icon: FaCode, name: "Web Development", color: "text-blue-400" },
    { icon: FaMicrochip, name: "AI & Machine Learning", color: "text-purple-400" },
    { icon: FaDatabase, name: "Data Science", color: "text-green-400" },
    { icon: FaNetworkWired, name: "Cloud Computing", color: "text-yellow-400" },
    { icon: FaBrain, name: "Neural Networks", color: "text-pink-400" },
    { icon: FaAtom, name: "Quantum Computing", color: "text-cyan-400" },
  ];

  return (
    <div className="bg-black text-gray-100 min-h-screen flex flex-col relative overflow-hidden">
      <MatrixRain />
      <FloatingParticles />
      <Nav />
      
      <div className="container mx-auto p-6 flex-grow mt-20 relative z-10">
        <TerminalEffect>
          <div className="p-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-16 text-center relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
              <div className="relative z-10">
                <motion.div
                  className="flex justify-center mb-8"
                  whileHover={{ scale: 1.1, rotateY: 180 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-lg opacity-50"></div>
                    <Image 
                      src="/image/school.png" 
                      alt="American University of Phnom Penh" 
                      width={200} 
                      height={200} 
                      className="relative z-10 rounded-full border-4 border-cyan-400 shadow-2xl" 
                    />
                  </div>
                </motion.div>
                
                <GlitchText className="text-5xl font-bold mb-4 text-cyan-400">
                  American University of Phnom Penh
                </GlitchText>
                
                <motion.p 
                  className="text-2xl text-green-400 italic mb-8 font-mono"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  &quot;Study Locally. Code Globally. Build Infinitely.&quot;
                </motion.p>
                
                <div className="flex justify-center mb-8">
                  <RotatingCube />
                </div>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center mb-16"
            >
              <GlitchText className="text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                ByteBuilders Club
              </GlitchText>
              <motion.div
                className="h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto mt-4"
                initial={{ width: 0 }}
                animate={{ width: "200px" }}
                transition={{ duration: 1, delay: 1 }}
              />
            </motion.div>

            {/* Code Demo Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <HolographicCard className="p-6 h-full">
                  <h3 className="text-2xl font-bold mb-4 text-cyan-400">Our Code Philosophy</h3>
                  <TypewriterCode code={clubCode} />
                </HolographicCard>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="space-y-6"
              >
                <HolographicCard className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">Tech Stack Mastery</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {techStack.map((tech, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-black/50 rounded-lg border border-gray-700/50"
                        whileHover={{ scale: 1.05, borderColor: "#00ffff" }}
                        transition={{ duration: 0.2 }}
                      >
                        <tech.icon className={`text-xl ${tech.color}`} />
                        <span className="text-sm">{tech.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </HolographicCard>
              </motion.div>
            </div>

            {/* Mission Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mb-16"
            >
              <HolographicCard className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4 text-cyan-400">Mission: Impossible? Not for Us!</h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    className="text-center"
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaRocket className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-cyan-400">Innovate</h3>
                    <p className="text-gray-300">Push boundaries and create solutions that don't exist yet</p>
                  </motion.div>
                  
                  <motion.div
                    className="text-center"
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUsers className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-purple-400">Collaborate</h3>
                    <p className="text-gray-300">Build amazing things together through teamwork and mentorship</p>
                  </motion.div>
                  
                  <motion.div
                    className="text-center"
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCode className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-green-400">Execute</h3>
                    <p className="text-gray-300">Turn ideas into reality with clean, efficient, and scalable code</p>
                  </motion.div>
                </div>
              </HolographicCard>
            </motion.div>

            {/* Mentors Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <GlitchText className="text-4xl font-bold text-cyan-400">
                  Our Digital Architects
                </GlitchText>
                <p className="text-xl text-gray-300 mt-4">The minds behind the magic</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mentors.map((mentor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index + 1.7 }}
                  >
                    <HolographicCard className="p-6 text-center group h-full">
                      <div className="relative mb-6">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                          whileHover={{ scale: 1.2 }}
                        />
                        <Image 
                          src={mentor.image} 
                          alt={mentor.name} 
                          width={150} 
                          height={150} 
                          className="relative z-10 rounded-full mx-auto border-4 border-gray-700 group-hover:border-cyan-400 transition-all duration-300" 
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 text-cyan-400">{mentor.name}</h3>
                      <p className="text-purple-400 mb-2">{mentor.role}</p>
                      <p className="text-sm text-gray-400 mb-4">{mentor.specialty}</p>
                      
                      <div className="flex justify-center gap-3">
                        <motion.a
                          href={mentor.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2, rotateZ: 360 }}
                          className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-cyan-400 hover:bg-gray-700 transition-all duration-300"
                        >
                          <FaGithub />
                        </motion.a>
                        <motion.a
                          href={mentor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2, rotateZ: 360 }}
                          className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-gray-700 transition-all duration-300"
                        >
                          <FaLinkedin />
                        </motion.a>
                        <motion.a
                          href={mentor.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2, rotateZ: 360 }}
                          className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-purple-400 hover:bg-gray-700 transition-all duration-300"
                        >
                          <FaTwitter />
                        </motion.a>
                      </div>
                    </HolographicCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 2 }}
              className="text-center"
            >
              <HolographicCard className="p-12">
                <h2 className="text-3xl font-bold mb-6 text-cyan-400">Ready to Build the Future?</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join ByteBuilders Club and transform your ideas into reality. Whether you're debugging your first "Hello World" or architecting the next big thing, we've got your back.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      href="/events" 
                      className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-2xl transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
                    >
                      <span className="flex items-center gap-2">
                        <FaRocket />
                        Launch Into Events
                      </span>
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      href="/contact" 
                      className="inline-block bg-transparent border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black text-cyan-400 font-bold py-4 px-8 rounded-xl shadow-2xl transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
                    >
                      <span className="flex items-center gap-2">
                        <FaTerminal />
                        Connect With Us
                      </span>
                    </Link>
                  </motion.div>
                </div>
              </HolographicCard>
            </motion.div>
          </div>
        </TerminalEffect>
      </div>
      
      <Footer />
      
      <style jsx>{`
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        
        .animate-glitch-1 {
          animation: glitch-1 0.3s infinite;
        }
        
        .animate-glitch-2 {
          animation: glitch-2 0.3s infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
