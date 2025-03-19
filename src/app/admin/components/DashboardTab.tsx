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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`p-6 rounded-2xl shadow-lg ${bgClass} text-white`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white bg-opacity-30 rounded-full">
          {icon}
        </div>
        <div>
          <p className="text-white text-opacity-90 font-medium">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
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
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total teachers
        const teachersSnapshot = await getDocs(collection(db, 'teachers'));
        setTotalTeachers(teachersSnapshot.size);

        // Get total unique students (from attendance records)
        const attendanceSnapshot = await getDocs(collection(db, 'attendance'));
        const uniqueStudentIds = new Set();
        attendanceSnapshot.forEach(doc => {
          uniqueStudentIds.add(doc.data().studentId);
        });
        setTotalStudents(uniqueStudentIds.size);

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
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          icon={<FaUsers className="text-2xl" />} 
          title="Total Students" 
          value={totalStudents} 
          bgClass="bg-gradient-to-r from-primary to-primary-light" 
          delay={0.1} 
        />
        <StatsCard 
          icon={<FaChalkboardTeacher className="text-2xl" />} 
          title="Total Teachers" 
          value={totalTeachers} 
          bgClass="bg-gradient-to-r from-primary-dark to-primary" 
          delay={0.2} 
        />
        <StatsCard 
          icon={<FaBook className="text-2xl" />} 
          title="Total Courses" 
          value={totalCourses} 
          bgClass="bg-gradient-to-r from-secondary to-gray-800" 
          delay={0.3} 
        />
        <StatsCard 
          icon={<FaCalendarAlt className="text-2xl" />} 
          title="Total Events" 
          value={totalEvents} 
          bgClass="bg-gradient-to-r from-accent to-primary-light" 
          delay={0.4} 
        />
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-primary">Recent Activity</h2>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <p className="text-gray-500 text-center py-8">Activity tracking will be added in a future update.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab; 