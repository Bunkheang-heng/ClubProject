'use client'
import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/components/ui/Spinner';
import { Terminal, Code, Cpu, Zap, Shield, Database, Activity, Wifi, Lock, Eye } from 'lucide-react';

// Types remain the same
type Course = {
  id: string;
  title: string;
};

type AttendanceSession = {
  id: string;
  courseId: string;
  teacherId: string;
  isOpen: boolean;
  openedAt: Date;
};

export interface AttendanceRecord {
  id: string;
  studentId: string;
  name: string;
  studentClass: string;
  attendance: string;
  reason?: string;
  timestamp: Date;
}

const TypewriterText = ({ text, delay = 30 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{displayText}<span className="animate-pulse text-cyan-400">|</span></span>;
};

const ConsoleLine = ({ text, index }: { text: string; index: number }) => {
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, text.length * 30 + 500);

    return () => clearTimeout(timeout);
  }, [text]);

  const getLineColor = (text: string) => {
    if (text.includes('✅')) return 'text-green-400';
    if (text.includes('❌')) return 'text-red-400';
    if (text.includes('🔄')) return 'text-yellow-400';
    if (text.includes('📚')) return 'text-blue-400';
    if (text.includes('🚀')) return 'text-purple-400';
    return 'text-cyan-300';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`mb-1 font-mono text-sm ${getLineColor(text)} flex items-center gap-2`}
    >
      <span className="text-gray-500 text-xs">{String(index + 1).padStart(3, '0')}</span>
      <span className="text-gray-600">│</span>
      {isTyping ? (
        <TypewriterText text={text} />
      ) : (
        <span>{text}</span>
      )}
    </motion.div>
  );
};

const FloatingParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
    initial={{ 
      x: Math.random() * window.innerWidth, 
      y: window.innerHeight + 10,
      opacity: 0 
    }}
    animate={{ 
      y: -10, 
      opacity: [0, 1, 0],
      x: Math.random() * window.innerWidth 
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
                stroke="url(#gradient)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, delay: (i + j) * 0.1 }}
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
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="50%" stopColor="#ff00ff" />
            <stop offset="100%" stopColor="#ffff00" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default function Attendance() {
  // State management
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [attendance, setAttendance] = useState('present');
  const [reason, setReason] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeSessions, setActiveSessions] = useState<AttendanceSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [systemStatus, setSystemStatus] = useState('INITIALIZING');
  const [connectionStrength, setConnectionStrength] = useState(0);
  const [securityLevel, setSecurityLevel] = useState('ENCRYPTED');
  const [particles, setParticles] = useState<number[]>([]);
  
  const showSuccess = (message: string) => {
    toast.success(message);
    setConsoleOutput(prev => [...prev, `✅ ${message}`]);
  };
  
  const showError = (message: string) => {
    toast.error(message);
    setConsoleOutput(prev => [...prev, `❌ ${message}`]);
  };

  const addConsoleMessage = (message: string) => {
    setConsoleOutput(prev => {
      // Check if the message already exists in the last 2 messages
      const lastMessages = prev.slice(-2);
      if (lastMessages.includes(message)) {
        return prev;
      }
      return [...prev, message];
    });
  };

  // Initialize particles and system effects
  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => i));
    
    // Simulate system initialization
    const statusUpdates = ['INITIALIZING', 'CONNECTING', 'AUTHENTICATING', 'ONLINE'];
    let currentIndex = 0;
    
    const statusInterval = setInterval(() => {
      if (currentIndex < statusUpdates.length - 1) {
        setSystemStatus(statusUpdates[currentIndex + 1]);
        currentIndex++;
      } else {
        clearInterval(statusInterval);
      }
    }, 800);

    // Simulate connection strength
    const connectionInterval = setInterval(() => {
      setConnectionStrength(prev => {
        const newStrength = Math.min(100, prev + Math.random() * 10);
        return newStrength;
      });
    }, 500);

    return () => {
      clearInterval(statusInterval);
      clearInterval(connectionInterval);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        addConsoleMessage('🔄 Loading system...');
        
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesList: Course[] = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title as string,
        }));
        
        addConsoleMessage('🔍 Checking available classes...');
        
        const sessionsQuery = query(
          collection(db, 'attendance_sessions'),
          where('isOpen', '==', true)
        );
        
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessionsList: AttendanceSession[] = [];
        
        sessionsSnapshot.forEach(doc => {
          const data = doc.data();
          sessionsList.push({
            id: doc.id,
            courseId: data.courseId,
            teacherId: data.teacherId,
            isOpen: data.isOpen,
            openedAt: data.openedAt.toDate()
          });
        });
        
        const activeCourseIds = sessionsList.map(session => session.courseId);
        const availableCourses = coursesList.filter(course => 
          activeCourseIds.includes(course.id)
        );
        
        // If no active sessions, show demo courses for UI demonstration
        if (availableCourses.length === 0 && coursesList.length === 0) {
          const demoCourses: Course[] = [
            { id: 'demo-1', title: 'Advanced React Development' },
            { id: 'demo-2', title: 'Python Machine Learning' },
            { id: 'demo-3', title: 'Cybersecurity Fundamentals' },
            { id: 'demo-4', title: 'Full Stack Web Development' },
          ];
          setCourses(demoCourses);
          addConsoleMessage('🎯 Demo mode: 4 classes available');
          addConsoleMessage('✅ Ready to take attendance');
        } else if (availableCourses.length === 0) {
          // Show all courses if no active sessions but courses exist
          setCourses(coursesList);
          addConsoleMessage(`📚 ${coursesList.length} classes found`);
          addConsoleMessage('✅ Ready to take attendance');
        } else {
          setCourses(availableCourses);
          addConsoleMessage(`📚 ${availableCourses.length} active classes found`);
          addConsoleMessage('✅ Ready to take attendance');
        }
        
        setActiveSessions(sessionsList);
        setSystemStatus('ONLINE');
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Failed to load classes. Please try again.");
        setSystemStatus('ERROR');
      } finally {
        setIsLoading(false);
        setIsFirstFetch(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      if (!isFirstFetch) {
        fetchData();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isFirstFetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addConsoleMessage('🚀 Submitting attendance...');

    if (!studentClass) {
      showError('Please select a class');
      return;
    }

    try {
      // Check if it's demo mode
      const isDemoMode = studentClass.startsWith('demo-');
      
      if (!isDemoMode) {
        const isSessionActive = activeSessions.some(session => session.courseId === studentClass);
        
        if (!isSessionActive) {
          showError('This class is no longer accepting attendance');
          return;
        }
        
        await addDoc(collection(db, 'attendance'), {
          name,
          studentId,
          studentClass,
          attendance,
          reason: attendance === 'permission' ? reason : '',
          timestamp: new Date()
        });
              } else {
          // Demo mode - simulate successful submission
          addConsoleMessage('🎭 Demo mode: Simulating submission...');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        }
        
        addConsoleMessage('✅ Attendance recorded successfully');
        showSuccess(isDemoMode ? 'Demo: Attendance submitted successfully!' : 'Attendance recorded!');
      
      // Reset form with animation
      setName('');
      setStudentId('');
      setStudentClass('');
      setAttendance('present');
      setReason('');
          } catch (error) {
        addConsoleMessage('❌ Submission failed');
        showError(`Error: ${(error as Error).message}`);
      }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 min-h-screen flex flex-col relative overflow-hidden">
      {/* Floating Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <FloatingParticle key={particle} delay={particle * 0.5} />
        ))}
      </AnimatePresence>

      {/* Neural Network Background */}
      <NeuralNetwork />

      <Nav />
      
      {/* Cyberpunk Header */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 mt-20 relative z-10"
      >
        <GlitchText className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          NEURAL ATTENDANCE
        </GlitchText>
        <motion.div 
          className="text-cyan-400 font-mono text-lg mt-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          QUANTUM BIOMETRIC AUTHENTICATION SYSTEM v2.0.77
        </motion.div>
      </motion.div>

      <div className="container mx-auto p-6 flex-grow relative z-10">
        <div className="max-w-2xl mx-auto">
          
          {/* Simple Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-3 h-3 rounded-full ${
                    systemStatus === 'ONLINE' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}
                />
                <span className="text-sm font-mono text-gray-300">
                  {systemStatus === 'ONLINE' ? 'System Ready' : 'Connecting...'}
                </span>
              </div>
              <div className="text-gray-500">|</div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-mono text-gray-300">
                  {courses.length} Classes Available
                </span>
              </div>
            </div>
          </motion.div>

          {/* Main Attendance Form */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <HolographicBorder>
              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block mb-4"
                  >
                    <Eye className="text-cyan-400 w-12 h-12 mx-auto" />
                  </motion.div>
                  <h1 className="text-2xl font-bold text-cyan-400 mb-2">Mark Your Attendance</h1>
                  <p className="text-gray-400 text-sm">Fill in your details below</p>
                </div>
                
                {isLoading ? (
                  <div className="flex flex-col items-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mb-4"
                    >
                      <Database className="w-8 h-8 text-cyan-400" />
                    </motion.div>
                    <div className="text-cyan-400">Loading classes...</div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm text-cyan-400 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </motion.div>

                    {/* Student ID */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm text-cyan-400 mb-2">
                        Student ID
                      </label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
                        placeholder="Enter your student ID"
                        required
                      />
                    </motion.div>

                    {/* Course Selection */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm text-cyan-400 mb-2">
                        Select Class
                      </label>
                      <select
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
                        required
                      >
                        <option value="">Choose your class</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id} className="bg-gray-900">
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    {/* Status Selection */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm text-cyan-400 mb-2">
                        Attendance Status
                      </label>
                      <select
                        value={attendance}
                        onChange={(e) => setAttendance(e.target.value)}
                        className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
                        required
                      >
                        <option value="present" className="bg-gray-900">Present</option>
                        <option value="permission" className="bg-gray-900">Absent (with permission)</option>
                      </select>
                    </motion.div>
                    
                    {/* Reason Input */}
                    <AnimatePresence>
                      {attendance === 'permission' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <label className="block text-sm text-yellow-400 mb-2">
                            Reason for Absence
                          </label>
                          <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-black/50 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(255,255,0,0.3)] transition-all resize-none"
                            placeholder="Please explain why you're absent..."
                            required
                            rows={3}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Submit Button */}
                    <motion.div 
                      className="text-center pt-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 20px rgba(0, 255, 255, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                      >
                        Submit Attendance
                      </motion.button>
                    </motion.div>
                  </form>
                )}
              </div>
            </HolographicBorder>
          </motion.div>

          {/* Simple Console Output */}
          {consoleOutput.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400">System Messages</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {consoleOutput.slice(-4).map((line, index) => (
                    <div key={index} className={`text-xs ${
                      line.includes('✅') ? 'text-green-400' :
                      line.includes('❌') ? 'text-red-400' :
                      line.includes('🔄') ? 'text-yellow-400' :
                      'text-gray-400'
                    }`}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
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
        toastClassName="bg-gray-900 border border-cyan-500/30"
      />
    </div>
  );
}
