'use client'
import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { motion } from 'framer-motion';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/components/ui/Spinner';
import { Terminal } from 'lucide-react';

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

  return <span>{displayText}<span className="animate-blink">|</span></span>;
};

const ConsoleLine = ({ text, index }: { text: string; index: number }) => {
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, text.length * 30 + 500); // Total typing time + 500ms buffer

    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <div className="text-gray-300 mb-1 font-mono">
      {isTyping ? (
        <TypewriterText text={text} />
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
};

export default function Attendance() {
  // State management remains the same
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        addConsoleMessage('🔄 Fetching data...');
        
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesList: Course[] = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title as string,
        }));
        
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
        
        setCourses(availableCourses);
        setActiveSessions(sessionsList);
        addConsoleMessage(`📚 Found ${availableCourses.length} active courses`);
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Failed to load available courses.");
      } finally {
        setIsLoading(false);
        setIsFirstFetch(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for subsequent fetches
    const intervalId = setInterval(() => {
      if (!isFirstFetch) { // Only fetch if it's not the first fetch
        fetchData();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isFirstFetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsoleOutput(prev => [...prev, '🚀 Submitting attendance...']);

    if (!studentClass) {
      showError('Please select a course');
      return;
    }

    try {
      const isSessionActive = activeSessions.some(session => session.courseId === studentClass);
      
      if (!isSessionActive) {
        showError('This course is no longer accepting attendance. Please refresh the page.');
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
      
      showSuccess('Attendance recorded successfully!');
      setName('');
      setStudentId('');
      setStudentClass('');
      setAttendance('present');
      setReason('');
    } catch (error) {
      showError((error as Error).message);
    }
  };

  return (
    <div className="bg-[#1E1E1E] text-gray-100 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Developer Console */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="bg-[#252526] rounded-lg shadow-xl p-4 h-[600px] overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
              <Terminal className="text-green-400" />
              <h2 className="text-lg font-mono text-green-400">Developer Console</h2>
            </div>
            <div className="font-mono text-sm h-[calc(100%-40px)] overflow-y-auto">
              {consoleOutput.map((line, index) => (
                <ConsoleLine key={index} text={line} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Attendance Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="bg-[#252526] shadow-lg rounded-lg p-6"
          >
            <h1 className="text-3xl font-bold mb-6 text-center text-green-400">Attendance Form</h1>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-[#1E1E1E] p-6 rounded-lg text-center">
                <h3 className="text-xl text-gray-400 mb-2">No Active Sessions</h3>
                <p className="text-gray-500">
                  No courses are currently open for attendance.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-1">Student ID</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-1">Class</label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400"
                    required
                  >
                    <option value="">Select a class</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-1">Status</label>
                  <select
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    className="w-full bg-[#1E1E1E] border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400"
                    required
                  >
                    <option value="present">Present</option>
                    <option value="permission">Permission</option>
                  </select>
                </div>
                
                {attendance === 'permission' && (
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-1">Reason for Permission</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-[#1E1E1E] border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-green-400"
                      required
                      rows={3}
                    />
                  </div>
                )}
                
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Submit
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
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
        theme="light"
      />
    </div>
  );
}
