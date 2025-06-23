import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Course } from '@/types/teacher';

interface CoursesListProps {
  courses: Course[];
}

export default function CoursesList({ courses }: CoursesListProps) {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const toggleCourse = (title: string) => {
    if (expandedCourse === title) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(title);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-3xl font-bold mb-6 flex items-center text-primary">
        <FaBookOpen className="mr-3" /> Your Courses
      </h3>

      {courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`flex justify-between items-center p-4 cursor-pointer ${
                  expandedCourse === course.title
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                }`}
                onClick={() => toggleCourse(course.title)}
              >
                <h4 className="text-xl font-semibold">{course.title}</h4>
                <motion.div
                  animate={{ rotate: expandedCourse === course.title ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {expandedCourse === course.title ? <FaAngleUp /> : <FaAngleDown />}
                </motion.div>
              </div>
              
              {expandedCourse === course.title && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-white"
                >
                  <p className="text-gray-700">{course.description}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-lg text-gray-500">No courses assigned yet.</p>
        </div>
      )}
    </div>
  );
} 