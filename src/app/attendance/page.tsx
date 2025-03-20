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

// Define the type for courses
type Course = {
  id: string;
  title: string;
  // Add other course properties as needed
};

// Define the type for attendance sessions
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
  reason?: string; // Add this field for permission reasons
  timestamp: Date;
}

export default function Attendance() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [attendance, setAttendance] = useState('present'); // Changed to be controlled by select
  const [reason, setReason] = useState(''); // New state for permission reason
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeSessions, setActiveSessions] = useState<AttendanceSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use toast instead of state messages
  const showSuccess = (message: string) => toast.success(message);
  const showError = (message: string) => toast.error(message);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all courses first for reference
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesList: Course[] = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title as string,
          // Map other course properties as needed
        }));
        
        // Fetch active attendance sessions
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
        
        // Filter courses to only those with active sessions
        const activeCourseIds = sessionsList.map(session => session.courseId);
        const availableCourses = coursesList.filter(course => 
          activeCourseIds.includes(course.id)
        );
        
        setCourses(availableCourses);
        setActiveSessions(sessionsList);
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Failed to load available courses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up interval to refresh active sessions every 30 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentClass) {
      showError('Please select a course');
      return;
    }

    try {
      // Check if the selected course still has an active session
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
        reason: attendance === 'permission' ? reason : '', // Include reason if permission
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
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 min-h-screen flex flex-col mt">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="bg-white shadow-lg rounded-xl p-10"
        >
          <h1 className="text-5xl font-extrabold mb-8 text-center text-primary">Attendance Form</h1>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <h3 className="text-xl text-gray-600 mb-2">No Active Attendance Sessions</h3>
              <p className="text-gray-500">
                There are currently no courses open for attendance. Please check back later or contact your teacher.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="studentId" className="block text-lg font-medium text-gray-700">Student ID</label>
                <input
                  type="text"
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="studentClass" className="block text-lg font-medium text-gray-700">Class</label>
                <select
                  id="studentClass"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                >
                  <option value="">Select a class</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="attendance" className="block text-lg font-medium text-gray-700">Attendance Status</label>
                <select
                  id="attendance"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                >
                  <option value="present">Present</option>
                  <option value="permission">Permission</option>
                </select>
              </div>
              
              {attendance === 'permission' && (
                <div>
                  <label htmlFor="reason" className="block text-lg font-medium text-gray-700">Reason for Permission</label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                  className="inline-block bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                >
                  Submit
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
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
