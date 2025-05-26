'use client'
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { FaPlus, FaEdit, FaTrash, FaChalkboardTeacher, FaBook } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Course, Teacher } from '../types';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Custom styles for dark theme ReactQuill
const quillDarkStyles = `
  .ql-dark-theme .ql-toolbar {
    background-color: rgb(75 85 99) !important;
    border: 1px solid rgb(75 85 99) !important;
    border-bottom: 1px solid rgb(55 65 81) !important;
    border-radius: 0.5rem 0.5rem 0 0 !important;
  }
  
  .ql-dark-theme .ql-toolbar .ql-stroke {
    stroke: rgb(229 231 235) !important;
  }
  
  .ql-dark-theme .ql-toolbar .ql-fill {
    fill: rgb(229 231 235) !important;
  }
  
  .ql-dark-theme .ql-toolbar .ql-picker-label {
    color: rgb(229 231 235) !important;
  }
  
  .ql-dark-theme .ql-toolbar .ql-picker-options {
    background-color: rgb(55 65 81) !important;
    border: 1px solid rgb(75 85 99) !important;
  }
  
  .ql-dark-theme .ql-toolbar .ql-picker-item {
    color: rgb(229 231 235) !important;
  }
  
  .ql-dark-theme .ql-toolbar .ql-picker-item:hover {
    background-color: rgb(75 85 99) !important;
  }
  
  .ql-dark-theme .ql-container {
    background-color: rgb(55 65 81) !important;
    border: 1px solid rgb(75 85 99) !important;
    border-top: none !important;
    border-radius: 0 0 0.5rem 0.5rem !important;
    color: white !important;
  }
  
  .ql-dark-theme .ql-editor {
    background-color: rgb(55 65 81) !important;
    color: white !important;
    min-height: 120px;
  }
  
  .ql-dark-theme .ql-editor.ql-blank::before {
    color: rgb(156 163 175) !important;
  }
  
  .ql-dark-theme .ql-tooltip {
    background-color: rgb(55 65 81) !important;
    border: 1px solid rgb(75 85 99) !important;
    color: white !important;
  }
  
  .ql-dark-theme .ql-tooltip input {
    background-color: rgb(75 85 99) !important;
    border: 1px solid rgb(107 114 128) !important;
    color: white !important;
  }
`;

interface CoursesTabProps {
  courses: Course[];
  teachers: Teacher[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

const CoursesTab: React.FC<CoursesTabProps> = ({ 
  courses, 
  teachers, 
  setCourses,
  showSuccess,
  showError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Inject dark theme styles for ReactQuill
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = quillDarkStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const openCreateModal = () => {
    // Reset form fields
    setTitle('');
    setDescription('');
    setSelectedTeacher('');
    setImage('');
    setShowCreateModal(true);
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setImage((course as any).image || '');
    
    // Find the teacher for this course if it exists
    const teacherForCourse = teachers.find(t => 
      t.courses && t.courses.includes(course.id)
    );
    setSelectedTeacher(teacherForCourse?.id || '');
    
    setShowEditModal(true);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newCourseRef = await addDoc(collection(db, 'courses'), {
        title,
        description,
        image
      });
      
      // If a teacher is selected, update the teacher's courses array
      if (selectedTeacher) {
        const teacherRef = doc(db, 'teachers', selectedTeacher);
        const teacherDoc = await getDoc(teacherRef);
        
        if (teacherDoc.exists()) {
          const currentCourses = teacherDoc.data().courses || [];
          await updateDoc(teacherRef, {
            courses: [...currentCourses, newCourseRef.id]
          });
        }
      }
      
      showSuccess("Course created successfully");
      
      // Add the new course to our state
      setCourses(prev => [...prev, {
        id: newCourseRef.id,
        title,
        description,
        image
      }]);
      
      // Reset form and close modal
      setTitle('');
      setDescription('');
      setSelectedTeacher('');
      setImage('');
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating course:", error);
      showError(`Failed to create course: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse) return;
    setIsLoading(true);
    
    try {
      const courseRef = doc(db, 'courses', selectedCourse.id);
      await updateDoc(courseRef, {
        title,
        description,
        image
      });
      
      // Handle teacher assignment changes
      const previousTeacher = teachers.find(t => 
        t.courses && t.courses.includes(selectedCourse.id)
      );
      
      // If teacher changed, update both old and new teacher
      if (previousTeacher?.id !== selectedTeacher) {
        // Remove from previous teacher
        if (previousTeacher) {
          const prevTeacherRef = doc(db, 'teachers', previousTeacher.id);
          await updateDoc(prevTeacherRef, {
            courses: previousTeacher.courses.filter(c => c !== selectedCourse.id)
          });
        }
        
        // Add to new teacher
        if (selectedTeacher) {
          const newTeacherRef = doc(db, 'teachers', selectedTeacher);
          const newTeacherDoc = await getDoc(newTeacherRef);
          
          if (newTeacherDoc.exists()) {
            const currentCourses = newTeacherDoc.data().courses || [];
            await updateDoc(newTeacherRef, {
              courses: [...currentCourses, selectedCourse.id]
            });
          }
        }
      }
      
      showSuccess("Course updated successfully");
      
      // Update the course in our state
      setCourses(prev => prev.map(course => 
        course.id === selectedCourse.id 
          ? { ...course, title, description, image }
          : course
      ));
      
      // Reset form and close modal
      setSelectedCourse(null);
      setTitle('');
      setDescription('');
      setSelectedTeacher('');
      setImage('');
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating course:", error);
      showError(`Failed to update course: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      setIsLoading(true);
      
      try {
        await deleteDoc(doc(db, 'courses', courseId));
        
        // Remove the course from any teacher that has it
        for (const teacher of teachers) {
          if (teacher.courses && teacher.courses.includes(courseId)) {
            const teacherRef = doc(db, 'teachers', teacher.id);
            await updateDoc(teacherRef, {
              courses: teacher.courses.filter(c => c !== courseId)
            });
          }
        }
        
        showSuccess("Course deleted successfully");
        
        // Remove the course from our state
        setCourses(prev => prev.filter(course => course.id !== courseId));
      } catch (error) {
        console.error("Error deleting course:", error);
        showError(`Failed to delete course: ${(error as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getTeacherForCourse = (courseId: string) => {
    return teachers.find(teacher => 
      teacher.courses && teacher.courses.includes(courseId)
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-8 border border-gray-600 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Course Management</h2>
            <p className="text-gray-400 text-lg">Create and manage your educational content</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>{courses.length} Total Courses</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>{courses.filter(course => teachers.find(t => t.courses?.includes(course.id))).length} Assigned</span>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-3 border border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Creating...</span>
              </>
            ) : (
              <>
                <div className="p-2 bg-white/20 rounded-full">
                  <FaPlus className="text-lg" />
                </div>
                <span className="text-lg">Create Course</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
      
      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => {
          const teacher = getTeacherForCourse(course.id);
          
          return (
            <motion.div 
              key={course.id} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600 rounded-2xl hover:shadow-2xl hover:border-gray-500 transition-all duration-500 overflow-hidden group"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              
              <div className="relative z-10">
                {/* Course Image */}
                {course.image ? (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    {/* Course type badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        📚 Course
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center rounded-t-2xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FaBook className="text-2xl text-white" />
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  {/* Course Title */}
                  <h3 className="text-xl font-bold mb-3 text-white line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
                    {course.title}
                  </h3>
                  
                  {/* Course Description */}
                  <div 
                    className="text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                  
                  {/* Instructor Section */}
                  {teacher ? (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/50 rounded-xl border border-gray-600/50">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xs">
                          {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Instructor</span>
                        <p className="text-white font-medium text-sm">{teacher.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-gray-800/30 rounded-xl border border-gray-600/30 border-dashed">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">👨‍🏫</span>
                        </div>
                        <p className="text-gray-400 text-sm">No instructor assigned</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-600/50">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(course)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-blue-600/30"
                      disabled={isLoading}
                    >
                      <FaEdit className="text-xs" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteCourse(course.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm border border-red-600/30"
                      disabled={isLoading}
                    >
                      <FaTrash className="text-xs" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        
      {/* Empty State */}
      {courses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-full text-center py-16"
        >
          <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-12 border border-gray-600 max-w-md mx-auto relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full translate-y-10 -translate-x-10"></div>
            
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <FaBook className="text-3xl text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-3">No Courses Yet</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">Start building your curriculum by creating your first course.</p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCreateModal}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg"
              >
                <FaPlus /> Create First Course
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      </div>
      
      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600 rounded-3xl w-full h-full max-w-5xl max-h-[95vh] p-0 overflow-y-auto shadow-2xl flex flex-col relative"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            {/* Close Button */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-400 text-3xl z-20 transition-colors duration-200"
              aria-label="Close"
            >
              &times;
            </button>
            
            <div className="relative z-10 p-10">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-600 pb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaBook className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Create New Course</h3>
                  <p className="text-gray-400 mt-1">Build engaging educational content</p>
                </div>
              </div>
              <form onSubmit={handleCreateCourse} className="space-y-8">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="title">
                    Course Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                                  <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="description">
                      Description
                    </label>
                    <div className="ql-dark-theme">
                      <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        placeholder="Enter course description..."
                      />
                    </div>
                  </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="image">
                    Image URL (Course Image)
                  </label>
                  <input
                    id="image"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="teacher">
                    Assign Teacher
                  </label>
                  <select
                    id="teacher"
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-600">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600 rounded-xl text-gray-300 transition-all duration-200 border border-gray-500 backdrop-blur-sm"
                    disabled={isLoading}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Creating...</>
                    ) : (
                      <><FaPlus className="text-sm" /> Create Course</>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600 rounded-3xl w-full h-full max-w-5xl max-h-[95vh] p-0 overflow-y-auto shadow-2xl flex flex-col relative"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            {/* Close Button */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-400 text-3xl z-20 transition-colors duration-200"
              aria-label="Close"
            >
              &times;
            </button>
            
            <div className="relative z-10 p-10">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-600 pb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaEdit className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Edit Course</h3>
                  <p className="text-gray-400 mt-1">Update your course information</p>
                </div>
              </div>
              <form onSubmit={handleEditCourse} className="space-y-8">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="edit-title">
                    Course Title
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                                    <div>
                      <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="edit-description">
                        Description
                      </label>
                      <div className="ql-dark-theme">
                        <ReactQuill
                          theme="snow"
                          value={description}
                          onChange={setDescription}
                          placeholder="Enter course description..."
                        />
                      </div>
                    </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="edit-image">
                    Image URL (optional)
                  </label>
                  <input
                    id="edit-image"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="edit-teacher">
                    Assign Teacher (Optional)
                  </label>
                  <select
                    id="edit-teacher"
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-600">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600 rounded-xl text-gray-300 transition-all duration-200 border border-gray-500 backdrop-blur-sm"
                    disabled={isLoading}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Updating...</>
                    ) : (
                      <><FaEdit className="text-sm" /> Update Course</>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CoursesTab; 