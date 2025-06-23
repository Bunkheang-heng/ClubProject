import React, { useState, useEffect } from 'react';
import { FaLock, FaLockOpen, FaClock, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Course } from '@/types/teacher';
import { db } from '@/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import Spinner from '@/components/ui/Spinner';

interface AttendanceControlProps {
  teacherId: string;
  courses: Course[];
  classNames: {[key: string]: string};
}

interface AttendanceSession {
  id: string;
  courseId: string;
  teacherId: string;
  isOpen: boolean;
  openedAt: Date;
  closedAt?: Date;
}

const AttendanceControl: React.FC<AttendanceControlProps> = ({
  teacherId,
  courses,
  classNames
}) => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch active sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessionsQuery = query(
          collection(db, 'attendance_sessions'),
          where('teacherId', '==', teacherId),
          where('isOpen', '==', true)
        );
        
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessionsData: AttendanceSession[] = [];
        
        sessionsSnapshot.forEach(doc => {
          const data = doc.data();
          sessionsData.push({
            id: doc.id,
            courseId: data.courseId,
            teacherId: data.teacherId,
            isOpen: data.isOpen,
            openedAt: data.openedAt.toDate(),
            closedAt: data.closedAt ? data.closedAt.toDate() : undefined
          });
        });
        
        setSessions(sessionsData);
      } catch (error) {
        console.error("Error fetching attendance sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [teacherId]);

  // Open attendance for a course
  const openAttendance = async () => {
    if (!selectedCourse) return;
    
    setActionLoading(selectedCourse);
    
    try {
      // Check if there's already an open session for this course
      const existingSession = sessions.find(session => session.courseId === selectedCourse);
      
      if (existingSession) {
        // Session exists, no need to create a new one
        return;
      }
      
      // Create new session
      const sessionRef = await addDoc(collection(db, 'attendance_sessions'), {
        courseId: selectedCourse,
        teacherId,
        isOpen: true,
        openedAt: serverTimestamp()
      });
      
      // Update local state
      const newSession: AttendanceSession = {
        id: sessionRef.id,
        courseId: selectedCourse,
        teacherId,
        isOpen: true,
        openedAt: new Date()
      };
      
      setSessions([...sessions, newSession]);
      setSelectedCourse('');
    } catch (error) {
      console.error("Error opening attendance:", error);
    } finally {
      setActionLoading(null);
    }
  };

  // Close attendance for a course
  const closeAttendance = async (sessionId: string) => {
    setActionLoading(sessionId);
    
    try {
      const sessionRef = doc(db, 'attendance_sessions', sessionId);
      await updateDoc(sessionRef, {
        isOpen: false,
        closedAt: serverTimestamp()
      });
      
      // Update local state
      setSessions(sessions.filter(session => session.id !== sessionId));
    } catch (error) {
      console.error("Error closing attendance:", error);
    } finally {
      setActionLoading(null);
    }
  };

  // Get available courses that don't have open sessions
  const availableCourses = courses.filter(course => 
    !sessions.some(session => session.courseId === course.id)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-8 border border-gray-600 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-12 translate-x-12"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full translate-y-10 -translate-x-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FaLockOpen className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">Attendance Control</h3>
            <p className="text-gray-400">Manage attendance sessions for your courses</p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-6 leading-relaxed">
            Open attendance for your courses to allow students to mark their attendance. 
            When you're done collecting attendance, close the session.
          </p>
          
          <div className="bg-blue-600/20 p-6 rounded-2xl border border-blue-500/30 mb-6 backdrop-blur-sm">
            <h4 className="font-semibold text-blue-300 mb-3 flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <FaInfoCircle className="text-white text-xs" />
              </div>
              How it works
            </h4>
            <p className="text-blue-200 text-sm leading-relaxed">
              When you open attendance for a course, students will see that course in the attendance form.
              Once you close it, the course will no longer be available for students to select.
            </p>
          </div>
        
          {/* Open attendance section */}
          <div className="bg-gray-700/50 p-6 rounded-2xl border border-gray-600/50 mb-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm">🎯</span>
              </div>
              Open Attendance Session
            </h4>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="flex-grow px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                disabled={availableCourses.length === 0 || actionLoading !== null}
              >
                <option value="">-- Select a course --</option>
                {availableCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAttendance}
                disabled={!selectedCourse || actionLoading !== null}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 px-6 rounded-xl flex items-center justify-center disabled:opacity-50 font-medium shadow-lg transition-all duration-200"
              >
                {actionLoading === selectedCourse ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <>
                    <FaLockOpen className="mr-2" /> Open Attendance
                  </>
                )}
              </motion.button>
            </div>
          </div>
          
          {/* Active sessions */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm">🔥</span>
              </div>
              Active Attendance Sessions
            </h4>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : sessions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-700/30 rounded-2xl p-8 text-center border border-gray-600/30 border-dashed"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">⏰</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Active Sessions</h3>
                <p className="text-gray-400">Open attendance for a course to begin tracking student attendance.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session, index) => {
                  const course = courses.find(c => c.id === session.courseId);
                  const courseName = course ? course.title : 'Unknown Course';
                  const openedTime = session.openedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  
                  return (
                    <motion.div 
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-2xl border border-gray-600 shadow-lg flex justify-between items-center hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">
                            {courseName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-bold text-white text-lg">{courseName}</h5>
                          <p className="text-gray-300 text-sm flex items-center gap-2">
                            <FaClock className="text-emerald-400" /> 
                            Opened at {openedTime}
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => closeAttendance(session.id)}
                        disabled={actionLoading === session.id}
                        className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-3 px-6 rounded-xl flex items-center justify-center disabled:opacity-50 font-medium shadow-lg transition-all duration-200"
                      >
                        {actionLoading === session.id ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          <>
                            <FaLock className="mr-2" /> Close Session
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceControl; 