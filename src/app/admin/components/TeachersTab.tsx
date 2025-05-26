'use client'
import React, { Fragment, useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaUserPlus, FaEdit, FaSpinner, FaFileExcel, FaChalkboardTeacher } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { getDocs, collection, doc, updateDoc, getDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { Teacher, Course } from '../types';
import { toast } from 'react-toastify';
import { formatFirebaseError } from '@/utils/errorHandling';
import Spinner from '@/components/ui/Spinner';
import * as XLSX from 'xlsx';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

// Optimized TeacherCard with memoization
const TeacherCard = memo(({ 
  teacher, 
  courses, 
  onEdit,
  onDelete,
  isDeleting
}: { 
  teacher: Teacher; 
  courses: Course[]; 
  onEdit: (t: Teacher) => void; 
  onDelete: (t: Teacher) => void;
  isDeleting: boolean;
}) => {
  // Use useMemo to avoid recalculation on every render
  const assignedCourses = useMemo(() => 
    courses.filter(course => teacher.courses?.includes(course.id)),
    [courses, teacher.courses]
  );

  const roleBadgeClass = teacher.role === 'admin' 
    ? 'bg-purple-600 text-white' 
    : 'bg-blue-600 text-white';

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600 rounded-2xl hover:shadow-2xl hover:border-gray-500 transition-all duration-500 overflow-hidden group"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
      
      <div className="relative z-10 p-6">
        {/* Header with avatar and actions */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{teacher.name}</h3>
              <p className="text-gray-400 text-sm">{teacher.email}</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(teacher)}
              className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl transition-colors backdrop-blur-sm"
              title="Edit teacher"
              disabled={isDeleting}
            >
              <FaEdit className="text-sm" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(teacher)}
              className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-colors backdrop-blur-sm"
              title="Delete teacher"
              disabled={isDeleting}
            >
              {isDeleting ? <FaSpinner className="animate-spin text-sm" /> : <FaTrash className="text-sm" />}
            </motion.button>
          </div>
        </div>

        {/* Role badge */}
        <div className="mb-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${roleBadgeClass} shadow-lg`}>
            {teacher.role === 'admin' ? '👑 Admin' : '👨‍🏫 Teacher'}
          </span>
        </div>
        
        {/* Courses section */}
        {assignedCourses.length > 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <h4 className="font-semibold text-gray-200 text-sm">Assigned Courses</h4>
            </div>
            <div className="space-y-2">
              {assignedCourses.slice(0, 3).map(course => (
                <div key={course.id} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">{course.title}</span>
                </div>
              ))}
              {assignedCourses.length > 3 && (
                <div className="text-gray-400 text-xs mt-2">
                  +{assignedCourses.length - 3} more courses
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-600/30 border-dashed">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-gray-400 text-xs">📚</span>
              </div>
              <p className="text-gray-400 text-sm">No courses assigned</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

TeacherCard.displayName = 'TeacherCard';

interface TeachersTabProps {
  teachers: Teacher[];
  courses: Course[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const TeachersTab = ({ teachers, courses, setTeachers, showSuccess, showError }: TeachersTabProps) => {
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  
  // Form states for editing
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'admin'>('teacher');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Teacher creation state variables
  const [showCreateTeacherModal, setShowCreateTeacherModal] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [newTeacherCourses, setNewTeacherCourses] = useState<string[]>([]);
  const [isCreatingTeacher, setIsCreatingTeacher] = useState(false);

  // Add a debugging reference
  const buttonClickedRef = useRef(false);

  useEffect(() => {
    const fetchTeachersAndCourses = async () => {
      try {
        // Fetch courses first
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesData: Course[] = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title as string,
          description: doc.data().description as string
        }));
        // setTeachers(teachers => [...teachers, ...coursesData]);
        
        // Then fetch teachers
        const teachersSnapshot = await getDocs(collection(db, 'teachers'));
        const teachersData: Teacher[] = teachersSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name as string,
          email: doc.data().email as string,
          role: doc.data().role as string,
          courses: doc.data().courses as string[] || []
        }));
        setTeachers(teachersData);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        toast.error("Failed to load teachers");
        setIsLoading(false);
      }
    };
    
    fetchTeachersAndCourses();
  }, []);

  const openEditModal = useCallback((teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setName(teacher.name);
    setEmail(teacher.email);
    setRole((teacher.role as 'teacher' | 'admin') || 'teacher');
    setSelectedCourses(teacher.courses || []);
    setShowEditModal(true);
  }, []);

  const handleCourseToggle = useCallback((courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  }, []);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTeacherName || !newTeacherEmail || !newTeacherPassword) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setIsCreatingTeacher(true);
      
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        newTeacherEmail, 
        newTeacherPassword
      );
      
      const userId = userCredential.user.uid;
      
      // Save teacher data to Firestore
      await setDoc(doc(db, 'teachers', userId), {
        name: newTeacherName,
        email: newTeacherEmail,
        role: 'teacher',
        courses: newTeacherCourses,
        createdAt: serverTimestamp(),
        createdBy: 'admin'
      });
      
      // Add the new teacher to the local state
      const newTeacher = {
        id: userId,
        name: newTeacherName,
        email: newTeacherEmail,
        role: 'teacher',
        courses: newTeacherCourses
      };
      
      setTeachers([...teachers, newTeacher]);
      
      // Reset form and close modal
      setNewTeacherName('');
      setNewTeacherEmail('');
      setNewTeacherPassword('');
      setNewTeacherCourses([]);
      setShowCreateTeacherModal(false);
      
      toast.success("Teacher account created successfully!");
    } catch (error) {
      console.error("Error creating teacher account:", error);
      toast.error(formatFirebaseError(error) || "Failed to create teacher account");
    } finally {
      setIsCreatingTeacher(false);
    }
  };
  
  // Add this function to handle course selection change
  const handleCourseSelectionChange = (courseId: string, isChecked: boolean) => {
    if (isChecked) {
      setNewTeacherCourses([...newTeacherCourses, courseId]);
    } else {
      setNewTeacherCourses(newTeacherCourses.filter(id => id !== courseId));
    }
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (!confirm(`Are you sure you want to delete ${teacher.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(teacher.id);
      
      // Delete the teacher document from Firestore
      await deleteDoc(doc(db, 'teachers', teacher.id));
      
      // Remove teacher from local state
      setTeachers(prevTeachers => prevTeachers.filter(t => t.id !== teacher.id));
      
      showSuccess(`Teacher ${teacher.name} deleted successfully`);
    } catch (error) {
      console.error("Error deleting teacher:", error);
      showError(`Failed to delete teacher: ${(error as Error).message}`);
    } finally {
      setIsDeleting(null);
    }
  };

  // Add explicit debugging function
  const handleCreateButtonClick = () => {
    console.log("Create button clicked - before state update");
    buttonClickedRef.current = true;
    setShowCreateTeacherModal(true);
    console.log("Create button clicked - after state update");
    
    // Force re-render in case the state update isn't triggering properly
    setTimeout(() => {
      console.log("Timeout fired, modal state:", showCreateTeacherModal);
    }, 100);
  };

  // Add debugging effect to monitor state changes
  useEffect(() => {
    console.log("Modal state changed:", showCreateTeacherModal);
  }, [showCreateTeacherModal]);

  if (isLoading && !teachers.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-8 border border-gray-600 overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tight mb-2">Teachers Management</h2>
                <p className="text-gray-400 text-lg">Manage your teaching staff and their course assignments</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>{teachers.filter(t => t.role === 'teacher').length} Teachers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>{teachers.filter(t => t.role === 'admin').length} Admins</span>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateButtonClick}
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-3 border border-blue-500/50"
              >
                <div className="p-2 bg-white/20 rounded-full">
                  <FaUserPlus className="text-lg" />
                </div>
                <span className="text-lg">Add Teacher</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Teachers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TeacherCard
                  teacher={teacher}
                  courses={courses}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTeacher}
                  isDeleting={isDeleting === teacher.id}
                />
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {teachers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-12 border border-gray-600 max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaChalkboardTeacher className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No Teachers Yet</h3>
                <p className="text-gray-400 mb-6">Start building your teaching team by adding your first teacher.</p>
                <button
                  onClick={handleCreateButtonClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <FaUserPlus /> Add First Teacher
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Create Teacher Modal */}
        <Transition appear show={isTeacherModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsTeacherModalOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="max-w-md w-full transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-600 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white mb-4"
                    >
                      Create New Teacher
                    </Dialog.Title>
                    <form onSubmit={handleCreateTeacher}>
                      <div className="mb-4">
                        <label htmlFor="teacherName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="teacherName"
                          value={teacherName}
                          onChange={(e) => setTeacherName(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="teacherEmail" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="teacherEmail"
                          value={teacherEmail}
                          onChange={(e) => setTeacherEmail(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="teacherPassword" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                          type="password"
                          id="teacherPassword"
                          value={teacherPassword}
                          onChange={(e) => setTeacherPassword(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                          minLength={6}
                        />
                        <p className="mt-1 text-xs text-gray-400">Password must be at least 6 characters</p>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setIsTeacherModalOpen(false)}
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 border border-gray-500 rounded-md hover:bg-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        >
                          Create Teacher
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Edit Teacher Modal */}
        {showEditModal && selectedTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-600 rounded-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-white">Edit Teacher</h3>
              <form onSubmit={handleCreateTeacher}>
                                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="edit-name">
                      Name
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="edit-email">
                      Email
                    </label>
                    <input
                      id="edit-email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="edit-role">
                      Role
                    </label>
                    <select
                      id="edit-role"
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'teacher' | 'admin')}
                    >
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                      Assign Courses
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-600 bg-gray-700 rounded p-2">
                      {courses.length > 0 ? (
                        courses.map(course => (
                          <div key={course.id} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={`edit-course-${course.id}`}
                              checked={selectedCourses.includes(course.id)}
                              onChange={() => handleCourseToggle(course.id)}
                              className="mr-2 focus:ring-blue-500 text-blue-500"
                            />
                            <label htmlFor={`edit-course-${course.id}`} className="text-gray-300">
                              {course.title}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No courses available</p>
                      )}
                    </div>
                  </div>
                                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-gray-600 bg-gray-600 rounded-lg text-gray-300 hover:bg-gray-500"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg flex items-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Updating...</>
                      ) : (
                        'Update Teacher'
                      )}
                    </button>
                  </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Simplified Modal Implementation */}
        {showCreateTeacherModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
            onClick={(e) => {
              // Close when clicking outside the modal
              if (e.target === e.currentTarget) {
                setShowCreateTeacherModal(false);
              }
            }}
          >
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-2xl font-bold mb-4 text-white">Create New Teacher</h3>
              
              <form onSubmit={handleCreateTeacher}>
                                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newTeacherName}
                        onChange={(e) => setNewTeacherName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newTeacherEmail}
                        onChange={(e) => setNewTeacherEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={newTeacherPassword}
                        onChange={(e) => setNewTeacherPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minLength={6}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Assign Courses
                      </label>
                      <div className="max-h-40 overflow-y-auto bg-gray-700 border border-gray-600 p-3 rounded-md">
                        {courses.length > 0 ? (
                          courses.map(course => (
                            <div key={course.id} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                id={`create-course-${course.id}`}
                                checked={newTeacherCourses.includes(course.id)}
                                onChange={(e) => handleCourseSelectionChange(course.id, e.target.checked)}
                                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded"
                              />
                              <label htmlFor={`create-course-${course.id}`} className="text-gray-300">
                                {course.title}
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm">No courses available</p>
                        )}
                      </div>
                    </div>
                  </div>
                
                                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setShowCreateTeacherModal(false)}
                      className="bg-gray-600 hover:bg-gray-500 text-gray-300 font-bold py-2 px-4 rounded mr-2 border border-gray-500"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={() => handleCreateTeacher({ preventDefault: () => {} } as any)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      disabled={isCreatingTeacher}
                    >
                      {isCreatingTeacher ? 'Creating...' : 'Create Teacher'}
                    </button>
                  </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeachersTab; 