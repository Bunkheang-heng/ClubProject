'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FaBook, FaCode, FaTerminal } from 'react-icons/fa'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import { CourseModal } from './CourseModal'
import { TerminalEffect } from './TerminalEffect'

interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  teacher?: {
    name: string;
    email: string;
  };
}

const CoursesSection = () => {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'courses'));
        const courseList = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          image: doc.data().image
        }));
        setCourses(courseList);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const openCourseModal = async (course: Course) => {
    try {
      const teachersSnapshot = await getDocs(collection(db, 'teachers'));
      let teacher: {name: string, email: string} | undefined = undefined;
      
      teachersSnapshot.docs.forEach(doc => {
        const teacherData = doc.data();
        if (teacherData.courses && teacherData.courses.includes(course.id)) {
          teacher = {
            name: teacherData.name,
            email: teacherData.email
          };
        }
      });

      setSelectedCourse({
        ...course,
        teacher
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setSelectedCourse(course);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <>
      <section className="py-20 bg-[#1E1E1E] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <TerminalEffect>
            <motion.h2 
              className="text-4xl font-bold text-center mb-12 text-green-400 font-mono"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <FaCode className="inline-block mr-2" />
              Available Courses
            </motion.h2>
          </TerminalEffect>
          
          {courses.length === 0 ? (
            <div className="text-center text-gray-400 font-mono">
              <FaTerminal className="inline-block mr-2" />
              No courses available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(16,185,129,0.15)" }}
                  className="bg-[#252526] rounded-lg border border-green-900/40 hover:border-green-400 transition-all duration-300 shadow-lg overflow-hidden flex flex-col h-80 cursor-pointer font-mono"
                  onClick={() => openCourseModal(course)}
                >
                  <div className="relative h-48 w-full bg-[#1E1E1E]">
                    {course.image ? (
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-contain bg-[#1E1E1E]"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-900 to-green-800">
                        <FaBook className="text-4xl text-green-400" />
                      </div>
                    )}
                    <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-green-900 to-green-800">
                      <FaBook className="text-4xl text-green-400" />
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-green-400">
                        <FaCode className="inline-block mr-2" />
                        {course.title}
                      </h3>
                      <div 
                        className="text-gray-300 text-sm line-clamp-3 overflow-hidden" 
                        dangerouslySetInnerHTML={{ __html: course.description }}
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <CourseModal 
        isOpen={isModalOpen}
        course={selectedCourse}
        onClose={closeModal}
      />
    </>
  )
}

export default CoursesSection