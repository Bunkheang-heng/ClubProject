'use client'
import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { motion } from 'framer-motion';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, } from 'firebase/firestore';

// Define the type for courses
type Course = {
  id: string;
  title: string;
  // Add other course properties as needed
};

export default function Attendance() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [attendance] = useState('present'); // Default value is 'present'
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesList: Course[] = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title as string,
        // Map other course properties as needed
      }));
      setCourses(coursesList);
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await addDoc(collection(db, 'attendance'), {
        name,
        studentId,
        studentClass,
        attendance,
        timestamp: new Date()
      });
      setSuccess('Attendance recorded successfully!');
      setName('');
      setStudentId('');
      setStudentClass('');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900 min-h-screen flex flex-col mt">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="bg-white shadow-lg rounded-xl p-10"
        >
          <h1 className="text-5xl font-extrabold mb-8 text-center text-blue-800">Attendance Form</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="studentClass" className="block text-lg font-medium text-gray-700">Class</label>
              <select
                id="studentClass"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a class</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Submit
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
