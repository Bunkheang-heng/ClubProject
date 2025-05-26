'use client'
import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaTerminal, FaCode, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const TerminalEffect = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="absolute -top-6 left-0 right-0 h-6 bg-[#1E1E1E] rounded-t-lg flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-xs text-gray-400">contact@bytebuilders:~</div>
      </div>
      {children}
    </div>
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
      <div className="flex items-center text-green-400 mb-1">
        <FaChevronRight className="mr-2" />
        {showCommand && isActive ? (
          <TypewriterText text={command} onComplete={handleCommandComplete} />
        ) : isActive ? (
          <span className="animate-blink">|</span>
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
    { command: "cat contact.txt", response: "Welcome to ByteBuilders Contact Terminal" },
    { command: "ls -la", response: "Available commands: [contact, social, message]" },
    { command: "echo 'Ready to connect?'", response: "Yes! Let's get in touch." },
    { command: "clear", response: "" }
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

const ContactCard = ({ icon: Icon, title, content, delay }: { icon: any; title: string; content: string; delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5, delay }} 
    className="bg-[#252526] p-6 rounded-lg border border-gray-700 hover:border-green-400 transition-colors group"
  >
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Icon className="text-green-400 text-4xl group-hover:text-green-500 transition-colors" />
      </motion.div>
      <h2 className="text-2xl font-bold mb-2 text-green-400">{title}</h2>
      <p className="text-gray-300 text-center">{content}</p>
    </div>
  </motion.div>
);

const SocialLink = ({ icon: Icon, href, label }: { icon: any; href: string; label: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, rotate: 360 }}
    transition={{ duration: 0.5 }}
    className="bg-[#252526] p-4 rounded-full text-green-400 hover:text-green-500 hover:bg-[#1E1E1E] transition-colors"
  >
    <Icon className="text-2xl" />
    <span className="sr-only">{label}</span>
  </motion.a>
);

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

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
    
    toast.success('Message sent successfully!');
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="bg-[#1E1E1E] text-gray-100 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <TerminalEffect>
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="bg-[#252526] shadow-2xl rounded-lg p-8 border border-gray-700"
          >
            {showTerminal && <TerminalSequence />}

            <div className="flex items-center justify-center gap-2 mb-8">
              <FaCode className="text-green-400 text-3xl" />
              <h1 className="text-5xl font-extrabold text-center text-green-400">Contact Us</h1>
              <FaCode className="text-green-400 text-3xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <ContactCard 
                icon={FaPhone} 
                title="Phone" 
                content="+1 (123) 456-7890" 
                delay={0.1} 
              />
              <ContactCard 
                icon={FaEnvelope} 
                title="Email" 
                content="contact@bytebuildersclub.com" 
                delay={0.2} 
              />
              <ContactCard 
                icon={FaMapMarkerAlt} 
                title="Address" 
                content="123 Coding St, Tech City, TX 12345" 
                delay={0.3} 
              />
            </div>

            <div className="flex justify-center mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-lg transform rotate-3"></div>
                <Image 
                  src="https://img.freepik.com/free-vector/hand-coding-concept-illustration_114360-8193.jpg" 
                  alt="Coding Illustration" 
                  width={500} 
                  height={300} 
                  className="rounded-lg shadow-md transform -rotate-3 hover:rotate-0 transition-transform duration-300" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaTerminal className="text-green-400" />
                  <h2 className="text-2xl font-bold text-green-400">Connect With Us</h2>
                </div>
                <p className="text-gray-300 mb-6">
                  Follow us on social media to stay updated with our latest events, workshops, and coding challenges.
                </p>
                <div className="flex gap-4">
                  <SocialLink icon={FaGithub} href="https://github.com" label="GitHub" />
                  <SocialLink icon={FaLinkedin} href="https://linkedin.com" label="LinkedIn" />
                  <SocialLink icon={FaTwitter} href="https://twitter.com" label="Twitter" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaTerminal className="text-green-400" />
                  <h2 className="text-2xl font-bold text-green-400">Send Message</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-mono text-gray-400 mb-1">$ name</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#1E1E1E] border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-mono text-gray-400 mb-1">$ email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1E1E1E] border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-mono text-gray-400 mb-1">$ message</label>
                    <textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#1E1E1E] border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400 font-mono"
                      required
                    ></textarea>
                  </div>
                  <div className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <FaTerminal className="animate-pulse" />
                          $ sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <FaTerminal />
                          $ send_message
                        </span>
                      )}
                    </motion.button>
                  </div>
                </form>
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
      />
    </div>
  );
}
