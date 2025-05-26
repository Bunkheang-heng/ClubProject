'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, 
  FaTerminal, 
  FaCode, 
  FaBug, 
  FaGithub, 
  FaCoffee,
  FaKeyboard,
  FaLaptopCode,
  FaRocket,
  FaArrowLeft
} from 'react-icons/fa';
import { SiTypescript, SiReact, SiNextdotjs, SiTailwindcss } from 'react-icons/si';
import Nav from '@/components/nav';
import Footer from '@/components/footer';

export default function NotFound() {
  const [terminalText, setTerminalText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [matrixChars, setMatrixChars] = useState<Array<{id: number, char: string, x: number, y: number, speed: number}>>([]);
  const [currentCommand, setCurrentCommand] = useState(0);

  const terminalCommands = [
    'npm run find-page',
    'git status',
    'ls -la /pages',
    'cat 404.log',
    'sudo find . -name "missing-page"',
    'echo "Page not found :("'
  ];

  const matrixCharacters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  // Terminal typing effect
  useEffect(() => {
    const command = terminalCommands[currentCommand];
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index <= command.length) {
        setTerminalText(command.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentCommand((prev) => (prev + 1) % terminalCommands.length);
          setTerminalText('');
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentCommand]);

  // Cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Matrix rain effect
  useEffect(() => {
    const createMatrixChar = () => {
      return {
        id: Math.random(),
        char: matrixCharacters[Math.floor(Math.random() * matrixCharacters.length)],
        x: Math.random() * 100,
        y: -10,
        speed: Math.random() * 2 + 1
      };
    };

    const interval = setInterval(() => {
      setMatrixChars(prev => {
        const newChars = [...prev];
        
        // Add new character
        if (Math.random() < 0.3) {
          newChars.push(createMatrixChar());
        }
        
        // Update positions and remove off-screen chars
        return newChars
          .map(char => ({ ...char, y: char.y + char.speed }))
          .filter(char => char.y < 110)
          .slice(-20); // Keep only last 20 chars
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Matrix Rain Background */}
      <div className="absolute inset-0 pointer-events-none">
        {matrixChars.map(char => (
          <motion.div
            key={char.id}
            className="absolute text-green-500/30 text-sm"
            style={{ left: `${char.x}%`, top: `${char.y}%` }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 2 }}
          >
            {char.char}
          </motion.div>
        ))}
      </div>

      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse"></div>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-green-500/10"
            style={{ top: `${i * 2}%` }}
          />
        ))}
      </div>

      <Nav />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Terminal */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Terminal Window */}
              <div className="bg-gray-900 border border-green-500/30 rounded-lg overflow-hidden shadow-2xl">
                {/* Terminal Header */}
                <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-green-500/30">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center text-gray-400 text-sm">
                    terminal — 404-debugger
                  </div>
                </div>
                
                {/* Terminal Content */}
                <div className="p-4 h-64 bg-black">
                  <div className="space-y-2">
                    <div className="text-green-400">
                      <span className="text-blue-400">developer@bytebuilder</span>
                      <span className="text-white">:</span>
                      <span className="text-purple-400">~/404-investigation</span>
                      <span className="text-white">$ </span>
                      <span>{terminalText}</span>
                      {showCursor && <span className="bg-green-400 text-black">█</span>}
                    </div>
                    
                    <div className="text-red-400 text-sm">
                      Error: ENOENT: no such file or directory
                    </div>
                    <div className="text-yellow-400 text-sm">
                      Warning: Page not found in current directory
                    </div>
                    <div className="text-gray-500 text-sm">
                      Suggestion: Check your routes or go back home
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Block */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-gray-900 border border-green-500/30 rounded-lg p-4"
              >
                <div className="text-gray-400 text-sm mb-2">error.tsx</div>
                <div className="space-y-1 text-sm">
                  <div><span className="text-purple-400">const</span> <span className="text-blue-400">error</span> = {`{`}</div>
                  <div className="ml-4"><span className="text-green-400">status</span>: <span className="text-yellow-400">404</span>,</div>
                  <div className="ml-4"><span className="text-green-400">message</span>: <span className="text-yellow-400">"Page not found"</span>,</div>
                  <div className="ml-4"><span className="text-green-400">stack</span>: <span className="text-yellow-400">"at Router.navigate()"</span></div>
                  <div>{`}`}</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - 404 Display */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center space-y-8"
            >
              {/* Glitchy 404 */}
              <div className="relative">
                <motion.div
                  animate={{ 
                    textShadow: [
                      '0 0 10px #00ff00',
                      '2px 0 0 #ff0000, -2px 0 0 #00ffff',
                      '0 0 10px #00ff00'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl md:text-9xl font-black text-green-400"
                >
                  404
                </motion.div>
                
                {/* Glitch overlay */}
                <motion.div
                  animate={{ 
                    x: [0, -2, 2, 0],
                    opacity: [0, 0.7, 0, 0.5, 0]
                  }}
                  transition={{ 
                    duration: 0.2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="absolute inset-0 text-8xl md:text-9xl font-black text-red-500 mix-blend-multiply"
                >
                  404
                </motion.div>
              </div>

              {/* Error Message */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  <span className="text-red-500">ERROR:</span> Page Not Found
                </h1>
                <p className="text-lg text-gray-400 max-w-md mx-auto">
                  Looks like this route doesn't exist in our codebase. 
                  Time to debug this issue! 🐛
                </p>
              </div>

              {/* Tech Stack Icons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex justify-center gap-4 text-2xl"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 360 }} className="text-blue-500">
                  <SiReact />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2, rotate: 360 }} className="text-white">
                  <SiNextdotjs />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2, rotate: 360 }} className="text-blue-400">
                  <SiTypescript />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2, rotate: 360 }} className="text-cyan-400">
                  <SiTailwindcss />
                </motion.div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-3 border border-green-400"
                  >
                    <FaHome />
                    <span>cd ~/home</span>
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.history.back()}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-3 border border-blue-400"
                >
                  <FaArrowLeft />
                  <span>git checkout HEAD~1</span>
                </motion.button>
              </div>

              {/* Developer Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-8 p-4 border border-green-500/30 rounded-lg bg-gray-900/50"
              >
                <p className="text-green-400 text-sm italic">
                  "It's not a bug, it's an undocumented feature!" 
                  <span className="text-yellow-400 ml-2">☕</span>
                </p>
                <div className="text-gray-500 text-xs mt-2">
                  - Every developer ever
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 bg-gray-900 border border-green-500/30 rounded-lg p-4"
          >
            <div className="flex flex-wrap justify-between items-center text-sm">
              <div className="flex items-center gap-4">
                <span className="text-green-400">●</span>
                <span>Status: Page Not Found</span>
                <span className="text-yellow-400">⚠</span>
                <span>Branch: main</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Ln 404, Col 1</span>
                <span className="text-blue-400">TypeScript React</span>
                <FaCoffee className="text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 