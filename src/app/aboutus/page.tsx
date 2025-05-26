'use client'
import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCode, FaLaptop, FaUsers, FaRocket, FaTerminal, FaGithub, FaLinkedin, FaTwitter, FaChevronRight } from 'react-icons/fa';

const TerminalEffect = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="absolute -top-6 left-0 right-0 h-6 bg-[#1E1E1E] rounded-t-lg flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      {children}
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

  return <span>{displayText}<span className="animate-blink">|</span></span>;
};

const TerminalLine = ({ command, response, delay = 0, onComplete }: { command: string; response: string; delay?: number; onComplete?: () => void }) => {
  const [showCommand, setShowCommand] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCommand(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleCommandComplete = () => {
    setTimeout(() => {
      setShowResponse(true);
    }, 500);
  };

  const handleResponseComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-4 font-mono"
    >
      <div className="flex items-center text-green-400 mb-1">
        <FaChevronRight className="mr-2" />
        {showCommand ? (
          <TypewriterText text={command} onComplete={handleCommandComplete} />
        ) : (
          <span className="animate-blink">|</span>
        )}
      </div>
      {showResponse && (
        <div className="ml-6 text-gray-300">
          <TypewriterText text={response} delay={50} onComplete={handleResponseComplete} />
        </div>
      )}
    </motion.div>
  );
};

const TerminalSequence = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const lines = [
    { 
      command: "cat aupp.txt", 
      response: "American University of Phnom Penh (AUPP) is a premier higher education institution in Cambodia, offering American-style education with internationally recognized degree programs. Founded to provide Cambodian students with access to high-quality education without leaving their home country, AUPP prepares students to become global leaders in their chosen fields." 
    },
    { 
      command: "cat facilities.txt", 
      response: "With state-of-the-art facilities and a diverse faculty of international and local experts, AUPP creates an engaging learning environment where students develop critical thinking skills and global perspectives essential for success in today's interconnected world." 
    }
  ];

  const handleLineComplete = () => {
    if (currentLine < lines.length - 1) {
      setCurrentLine(prev => prev + 1);
    }
  };

  return (
    <div className="mb-8 font-mono">
      {lines.slice(0, currentLine + 1).map((line, index) => (
        <TerminalLine
          key={index}
          command={line.command}
          response={line.response}
          delay={index === 0 ? 1000 : 0}
          onComplete={index === currentLine ? handleLineComplete : undefined}
        />
      ))}
    </div>
  );
};

const CodeBlock = ({ code }: { code: string }) => {
  const [isTyping, setIsTyping] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const lines = code.split('\n');

  useEffect(() => {
    if (currentLine < lines.length) {
      const timeout = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, 1000); // Wait 1 second before typing next line

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [currentLine, lines.length]);

  return (
    <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700 font-mono text-sm text-gray-300">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-400 text-xs">ByteBuilders.js</span>
      </div>
      <pre className="overflow-x-auto">
        <code>
          {lines.slice(0, currentLine + 1).map((line, index) => (
            <div key={index} className="flex">
              <span className="text-gray-500 mr-2">{index + 1}</span>
              {index === currentLine && isTyping ? (
                <TypewriterText text={line} />
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default function AboutUs() {
  const mentors = [
    { 
      name: "Serey Muniek Vissot Sina", 
      role: "Club Leader", 
      image: "/image/vissot.png",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    { 
      name: "Chun Paulen", 
      role: "Mobile App Specialist", 
      image: "/image/paulen.png",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    { 
      name: "Mike Johnson", 
      role: "Data Science Expert", 
      image: "/images/vissot.jpg",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    { 
      name: "Emily Brown", 
      role: "AI Research Lead", 
      image: "/images/vissot.jpg",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
  ];

  const clubCode = `class ByteBuilders {
  constructor() {
    this.founded = 2023;
    this.location = "AUPP";
    this.mission = "Empower students with tech skills";
  }

  async learn() {
    const skills = await this.acquireKnowledge();
    return this.applySkills(skills);
  }

  build() {
    return "Future Leaders";
  }
}`;

  return (
    <div className="bg-[#1E1E1E] text-gray-100 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <TerminalEffect>
          <div className="bg-[#252526] shadow-lg rounded-lg p-8 border border-gray-700">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image 
                    src="/image/school.png" 
                    alt="American University of Phnom Penh" 
                    width={200} 
                    height={200} 
                    className="mx-auto rounded-lg border-4 border-green-400" 
                  />
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-green-400">American University of Phnom Penh</h2>
              <p className="text-xl text-green-400 italic mb-6 font-mono">&quot;Study Locally. Live Globally.&quot;</p>
              <div className="max-w-3xl mx-auto">
                <TerminalSequence />
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl font-extrabold mb-8 text-center text-green-400"
            >
              About ByteBuilders Club
            </motion.h1>

            <div className="flex flex-col md:flex-row items-center mb-8 gap-8">
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-lg transform rotate-3"></div>
                  <Image 
                    src="https://www.codingdojo.com/blog/wp-content/uploads/Can-Anyone-Really-Learn-How-to-Code_cover-01.jpg" 
                    alt="ByteBuilders Club members" 
                    width={500} 
                    height={300} 
                    className="rounded-lg shadow-md transform -rotate-3 hover:rotate-0 transition-transform duration-300" 
                  />
                </motion.div>
              </div>
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <CodeBlock code={clubCode} />
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-700 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-green-400">ByteBuilders at AUPP</h2>
              <p className="mb-4 text-lg text-gray-300">
                As one of AUPP&apos;s most active student organizations, ByteBuilders Club enhances the university&apos;s 
                technology education by providing practical, hands-on learning experiences. We collaborate closely 
                with AUPP&apos;s Faculty of Information Technology to organize events, workshops, and projects that 
                complement classroom learning.
              </p>
              <p className="text-lg text-gray-300">
                Through our activities, members gain valuable real-world experience while supporting AUPP&apos;s mission 
                to develop well-rounded graduates prepared for global careers in technology and innovation.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-700"
              >
                <h2 className="text-2xl font-bold mb-4 text-green-400">What We Offer</h2>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <FaCode className="text-green-400" />
                    Engaging workshops and coding sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <FaLaptop className="text-green-400" />
                    Collaborative projects
                  </li>
                  <li className="flex items-center gap-2">
                    <FaUsers className="text-green-400" />
                    Mentorship from industry professionals
                  </li>
                  <li className="flex items-center gap-2">
                    <FaRocket className="text-green-400" />
                    Hands-on learning experiences
                  </li>
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-700"
              >
                <h2 className="text-2xl font-bold mb-4 text-green-400">Our Focus Areas</h2>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <FaCode className="text-green-400" />
                    Web development
                  </li>
                  <li className="flex items-center gap-2">
                    <FaLaptop className="text-green-400" />
                    Mobile app creation
                  </li>
                  <li className="flex items-center gap-2">
                    <FaTerminal className="text-green-400" />
                    Data science
                  </li>
                  <li className="flex items-center gap-2">
                    <FaRocket className="text-green-400" />
                    Artificial intelligence
                  </li>
                </ul>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Our Mentors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mentors.map((mentor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * index + 0.7 }}
                    className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-700 text-center group hover:border-green-400 transition-colors"
                  >
                    <div className="relative">
                      <Image 
                        src={mentor.image} 
                        alt={mentor.name} 
                        width={200} 
                        height={200} 
                        className="rounded-full mx-auto mb-4 border-4 border-gray-700 group-hover:border-green-400 transition-colors" 
                      />
                      <div className="absolute bottom-0 right-0 flex gap-2">
                        <motion.a
                          href={mentor.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2 }}
                          className="bg-[#252526] p-2 rounded-full text-gray-300 hover:text-green-400"
                        >
                          <FaGithub />
                        </motion.a>
                        <motion.a
                          href={mentor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2 }}
                          className="bg-[#252526] p-2 rounded-full text-gray-300 hover:text-green-400"
                        >
                          <FaLinkedin />
                        </motion.a>
                        <motion.a
                          href={mentor.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2 }}
                          className="bg-[#252526] p-2 rounded-full text-gray-300 hover:text-green-400"
                        >
                          <FaTwitter />
                        </motion.a>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-green-400">{mentor.name}</h3>
                    <p className="text-gray-400">{mentor.role}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mb-6 text-lg text-center text-gray-300"
            >
              Whether you&apos;re a beginner or an experienced coder, ByteBuilders Club has something for every AUPP student. Join us to explore the exciting world of programming, develop your problem-solving skills, and connect with like-minded individuals who share your passion for technology.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="text-center mt-8"
            >
              <Link 
                href="/events" 
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                View Upcoming Events
              </Link>
            </motion.div>
          </div>
        </TerminalEffect>
      </div>
      <Footer />
    </div>
  );
}
