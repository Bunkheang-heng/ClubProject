'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FaBook, FaCode, FaTerminal } from 'react-icons/fa'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import { CourseModal } from './CourseModal'
import { HolographicCard } from './HolographicCard'

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
      <section className="py-32 relative overflow-hidden">
        {/* Futuristic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Animated circuit pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 L 10 10 L 10 0 M 10 10 L 20 10 M 10 10 L 10 20" 
                      stroke="currentColor" strokeWidth="0.5" fill="none" className="text-cyan-400"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              QUANTUM COURSES
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 font-mono max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-green-400">// </span>
              Advanced learning modules designed for the next generation of developers
            </motion.p>
          </motion.div>
          
          {courses.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-12 max-w-md mx-auto">
                <FaTerminal className="text-6xl text-cyan-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Initializing Courses...</h3>
                <p className="text-gray-400 font-mono">
                  <span className="text-cyan-400">// </span>
                  Loading quantum learning modules
                </p>
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-cyan-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <HolographicCard 
                    onClick={() => openCourseModal(course)}
                    className="h-full"
                    glowColor="#00ff41"
                  >
                    <div className="space-y-4">
                      {/* Course image with holographic overlay */}
                      <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                        {course.image ? (
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-900/50 to-cyan-900/50">
                            <FaBook className="text-5xl text-green-400" />
                          </div>
                        )}
                        <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-green-900/50 to-cyan-900/50">
                          <FaBook className="text-5xl text-green-400" />
                        </div>
                        
                        {/* Holographic overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Course status */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full">
                          <span className="text-xs font-mono text-green-400">ACTIVE</span>
                        </div>
                      </div>

                      {/* Course content */}
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <FaCode className="text-green-400" />
                          {course.title}
                        </h3>
                        
                        <div 
                          className="text-gray-300 text-sm leading-relaxed line-clamp-3" 
                          dangerouslySetInnerHTML={{ __html: course.description }}
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        />
                        
                        {/* Progress indicator */}
                        <div className="flex items-center gap-2 pt-2">
                          <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${Math.random() * 60 + 20}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                          <span className="text-xs font-mono text-gray-400">
                            {Math.floor(Math.random() * 60 + 20)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </HolographicCard>
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