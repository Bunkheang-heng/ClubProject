'use client'
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { FaPlus, FaEdit, FaTrash, FaChalkboardTeacher } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Course, Teacher } from '../types';

interface CoursesTabProps {
  courses: Course[];
  teachers: Teacher[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

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

  const openCreateModal = () => {
    // Reset form fields
    setTitle('');
    setDescription('');
    setSelectedTeacher('');
    setShowCreateModal(true);
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    
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
        description
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
        description
      }]);
      
      // Reset form and close modal
      setTitle('');
      setDescription('');
      setSelectedTeacher('');
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
        description
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
          ? { ...course, title, description }
          : course
      ));
      
      // Reset form and close modal
      setSelectedCourse(null);
      setTitle('');
      setDescription('');
      setSelectedTeacher('');
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
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="admin-heading">Manage Courses</h2>
        <button
          onClick={openCreateModal}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <><FaPlus /> Add Course</>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => {
          const teacher = getTeacherForCourse(course.id);
          
          return (
            <motion.div 
              key={course.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card p-6"
            >
              <h3 className="text-xl font-semibold mb-2 text-primary">{course.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              
              {teacher && (
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
                  <FaChalkboardTeacher />
                  <span>Teacher: {teacher.name}</span>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => openEditModal(course)}
                  className="text-primary hover:text-primary-dark p-2"
                  disabled={isLoading}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                  disabled={isLoading}
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          );
        })}
        
        {courses.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500">
            <p className="mb-4">No courses found. Click the "Add Course" button to create your first course.</p>
          </div>
        )}
      </div>
      
      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">Create New Course</h3>
            <form onSubmit={handleCreateCourse}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Course Title
                </label>
                <input
                  id="title"
                  type="text"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="input-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teacher">
                  Assign Teacher (Optional)
                </label>
                <select
                  id="teacher"
                  className="input-field"
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
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-lg flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Creating...</>
                  ) : (
                    'Create Course'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">Edit Course</h3>
            <form onSubmit={handleEditCourse}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-title">
                  Course Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  rows={4}
                  className="input-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-teacher">
                  Assign Teacher (Optional)
                </label>
                <select
                  id="edit-teacher"
                  className="input-field"
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
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-lg flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Updating...</>
                  ) : (
                    'Update Course'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesTab; 