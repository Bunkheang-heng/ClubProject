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
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
      <h3 className="text-3xl font-bold mb-6 flex items-center text-primary">
        <FaLockOpen className="mr-3" /> Attendance Control
      </h3>
      
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          Open attendance for your courses to allow students to mark their attendance. 
          When you're done collecting attendance, close the session.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <FaInfoCircle className="mr-2" /> How it works
          </h4>
          <p className="text-blue-700 text-sm">
            When you open attendance for a course, students will see that course in the attendance form.
            Once you close it, the course will no longer be available for students to select.
          </p>
        </div>
        
        {/* Open attendance section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
          <h4 className="text-lg font-semibold mb-4">Open Attendance Session</h4>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
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
              className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-6 rounded-md flex items-center justify-center disabled:opacity-50"
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
          <h4 className="text-lg font-semibold mb-4">Active Attendance Sessions</h4>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
              No active attendance sessions
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map(session => {
                const course = courses.find(c => c.id === session.courseId);
                const courseName = course ? course.title : 'Unknown Course';
                const openedTime = session.openedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                return (
                  <div key={session.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h5 className="font-semibold text-primary">{courseName}</h5>
                      <p className="text-sm text-gray-500 flex items-center">
                        <FaClock className="mr-1" /> Opened at {openedTime}
                      </p>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => closeAttendance(session.id)}
                      disabled={actionLoading === session.id}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center disabled:opacity-50"
                    >
                      {actionLoading === session.id ? (
                        <Spinner size="sm" color="white" />
                      ) : (
                        <>
                          <FaLock className="mr-2" /> Close
                        </>
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceControl; 