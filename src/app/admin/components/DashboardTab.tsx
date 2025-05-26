'use client'
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { motion } from 'framer-motion';
import { FaUsers, FaChalkboardTeacher, FaBook, FaCalendarAlt } from 'react-icons/fa';
import { Teacher, Course } from '../types';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  bgClass: string;
  delay: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, bgClass, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.3 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 ${bgClass} text-white overflow-hidden group cursor-pointer`}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Decorative background shapes */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-2 h-2 bg-white/30 rounded-full"
          ></motion.div>
        </div>
        <div>
          <p className="text-white/80 font-medium text-sm uppercase tracking-wider mb-2">{title}</p>
          <motion.h3 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="text-4xl font-black tracking-tight"
          >
            {value}
          </motion.h3>
        </div>
      </div>
    </motion.div>
  );
};

interface DashboardTabProps {
  teachers: Teacher[];
  courses: Course[];
  handleLogout: () => Promise<void>;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ 
  teachers, 
  courses, 
  handleLogout 
}) => {
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total teachers
        const teachersSnapshot = await getDocs(collection(db, 'teachers'));
        setTotalTeachers(teachersSnapshot.size);



        // Get total courses
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        setTotalCourses(coursesSnapshot.size);

        // Get total upcoming events
        const now = new Date();
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        setTotalEvents(eventsSnapshot.size);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-black mb-2 text-white tracking-tight">Dashboard Overview</h2>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          icon={<FaChalkboardTeacher className="text-3xl" />} 
          title="Teachers" 
          value={totalTeachers} 
          bgClass="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800" 
          delay={0.1} 
        />
        <StatsCard 
          icon={<FaBook className="text-3xl" />} 
          title="Courses" 
          value={totalCourses} 
          bgClass="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800" 
          delay={0.2} 
        />
        <StatsCard 
          icon={<FaCalendarAlt className="text-3xl" />} 
          title="Events" 
          value={totalEvents} 
          bgClass="bg-gradient-to-br from-rose-600 via-rose-700 to-rose-800" 
          delay={0.3} 
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Recent Activity</h2>
            <p className="text-gray-400 mt-1">Track real-time updates and changes</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.div>
        </div>
        
        <div className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-12 border border-gray-600 overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${30 + i * 10}%`,
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-2xl font-bold text-white mb-4"
            >
              Activity Feed Coming Soon
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-gray-300 text-lg mb-8 max-w-md mx-auto leading-relaxed"
            >
              Real-time activity tracking, notifications, and system updates will be available in the next release.
            </motion.p>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2, type: "spring", bounce: 0.5 }}
              className="flex items-center justify-center gap-4"
            >
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className={`w-8 h-8 rounded-full border-2 border-white ${
                      i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-purple-500'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm">Stay tuned for updates!</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardTab; 