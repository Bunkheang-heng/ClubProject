'use client'
import React, { Fragment, useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaUserPlus, FaEdit, FaSpinner, FaFileExcel } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { getDocs, collection, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Teacher, Course } from '../types';
import { toast } from 'react-toastify';
import { formatFirebaseError } from '@/utils/errorHandling';
import Spinner from '@/components/ui/Spinner';
import * as XLSX from 'xlsx';

// Optimized TeacherCard with memoization
const TeacherCard = memo(({ 
  teacher, 
  courses, 
  onEdit
}: { 
  teacher: Teacher; 
  courses: Course[]; 
  onEdit: (t: Teacher) => void; 
}) => {
  // Use useMemo to avoid recalculation on every render
  const assignedCourses = useMemo(() => 
    courses.filter(course => teacher.courses?.includes(course.id)),
    [courses, teacher.courses]
  );

  const roleBadgeClass = teacher.role === 'admin' 
    ? 'bg-accent text-white' 
    : 'bg-primary-light text-white';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="card hover:shadow-md transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-primary">{teacher.name}</h3>
            <p className="text-gray-600">{teacher.email}</p>
            <span className={`px-2 py-1 text-xs rounded-full ${roleBadgeClass} mt-2 inline-block`}>
              {teacher.role || 'Teacher'}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(teacher)}
              className="p-2 text-primary hover:bg-gray-100 rounded-full transition-colors"
              title="Edit teacher"
            >
              <FaEdit />
            </button>
          </div>
        </div>
        
        {assignedCourses.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Assigned Courses:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {assignedCourses.map(course => (
                <li key={course.id}>{course.title}</li>
              ))}
            </ul>
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  
  // Form states with proper types
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'admin'>('teacher');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

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

  // Memoize handlers to prevent recreation on each render
  const openCreateModal = useCallback(() => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('teacher');
    setSelectedCourses([]);
    setShowCreateModal(true);
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

  const handleCreateTeacher = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Sanitize input data before sending
      const sanitizedName = name.trim();
      const sanitizedEmail = email.trim().toLowerCase();
      
      if (!sanitizedName || !sanitizedEmail || !password) {
        showError("All fields are required");
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('/api/create-teacher', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': sessionStorage.getItem('csrfToken') || '' // Add CSRF protection
        },
        credentials: 'same-origin', // Important for security
        body: JSON.stringify({ 
          name: sanitizedName, 
          email: sanitizedEmail, 
          password, 
          role, 
          courses: selectedCourses 
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create teacher");
      }
      
      const data = await response.json();
      
      showSuccess("Teacher created successfully");
      setTeachers(prev => [...prev, {
        id: data.uid,
        name: sanitizedName,
        email: sanitizedEmail,
        role,
        courses: selectedCourses
      }]);
      
      setShowCreateModal(false);
    } catch (error) {
      showError(formatFirebaseError(error));
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, role, selectedCourses, setTeachers, showSuccess, showError]);

  const handleEditTeacher = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTeacher) return;
    setIsLoading(true);
    
    try {
      // Sanitize input data
      const sanitizedName = name.trim();
      const sanitizedEmail = email.trim().toLowerCase();
      
      if (!sanitizedName || !sanitizedEmail) {
        showError("Name and email are required");
        setIsLoading(false);
        return;
      }
      
      // First update teacher in Firestore
      const teacherRef = doc(db, 'teachers', selectedTeacher.id);
      await updateDoc(teacherRef, {
        name: sanitizedName,
        email: sanitizedEmail,
        role,
        courses: selectedCourses,
        updatedAt: new Date().toISOString() // Add timestamp for tracking changes
      });
      
      showSuccess("Teacher updated successfully");
      
      // Update the teacher in our state using immutable pattern
      setTeachers(prev => prev.map(teacher => 
        teacher.id === selectedTeacher.id 
          ? { 
              ...teacher, 
              name: sanitizedName, 
              email: sanitizedEmail, 
              role, 
              courses: selectedCourses 
            }
          : teacher
      ));
      
      setShowEditModal(false);
    } catch (error) {
      showError(formatFirebaseError(error));
    } finally {
      setIsLoading(false);
    }
  }, [selectedTeacher, name, email, role, selectedCourses, setTeachers, showSuccess, showError]);

  const handleDeleteTeacher = useCallback(async (teacherId: string) => {
    if (!confirm("Are you sure you want to delete this teacher? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(teacherId);
    
    try {
      // Get teacher's courses for reassignment
      const teacherToDelete = teachers.find(t => t.id === teacherId);
      const coursesToReassign = teacherToDelete?.courses || [];
      
      const response = await fetch('/api/delete-teacher', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, coursesToReassign }),
      });
      
      if (response.ok) {
        showSuccess("Teacher deleted successfully");
        setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
      } else {
        const data = await response.json();
        showError(data.error || "Failed to delete teacher");
      }
    } catch (error) {
      showError(formatFirebaseError(error));
    } finally {
      setIsDeleting(null);
    }
  }, [teachers, setTeachers, showSuccess, showError]);

  // Use useMemo to sort teachers by role (admins first)
  const sortedTeachers = useMemo(() => {
    return [...teachers].sort((a, b) => {
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (a.role !== 'admin' && b.role === 'admin') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [teachers]);

  // Add this function to download teachers data as Excel
  const downloadTeachersAsExcel = useCallback(() => {
    try {
      // Prepare data for excel export
      const teachersData = teachers.map(teacher => {
        // Get assigned course names for this teacher
        const teacherCourses = courses
          .filter(course => teacher.courses?.includes(course.id))
          .map(course => course.title)
          .join(', ');
        
        return {
          'Name': teacher.name,
          'Email': teacher.email,
          'Role': teacher.role || 'Teacher',
          'Assigned Courses': teacherCourses || 'None',
        };
      });
      
      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(teachersData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");
      
      // Generate and download the file
      XLSX.writeFile(workbook, "teachers_data.xlsx");
      
      showSuccess("Teachers data exported successfully");
    } catch (error) {
      console.error("Error exporting teachers data:", error);
      showError("Failed to export teachers data");
    }
  }, [teachers, courses, showSuccess, showError]);

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
        <div className="bg-indigo-50 rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Teacher Management</h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadTeachersAsExcel}
                className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={teachers.length === 0}
              >
                <FaFileExcel /> Export Excel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCreateModal}
                className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaPlus /> Create Teacher
              </motion.button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                courses={courses}
                onEdit={openEditModal}
              />
            ))}
          </div>
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
                  <Dialog.Panel className="max-w-md w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      Create New Teacher
                    </Dialog.Title>
                    <form onSubmit={handleCreateTeacher}>
                      <div className="mb-4">
                        <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="teacherName"
                          value={teacherName}
                          onChange={(e) => setTeacherName(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="teacherEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="teacherEmail"
                          value={teacherEmail}
                          onChange={(e) => setTeacherEmail(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="teacherPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                          type="password"
                          id="teacherPassword"
                          value={teacherPassword}
                          onChange={(e) => setTeacherPassword(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                          required
                          minLength={6}
                        />
                        <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setIsTeacherModalOpen(false)}
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
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
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Edit Teacher</h3>
              <form onSubmit={handleEditTeacher}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                    Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-email">
                    Email
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-role">
                    Role
                  </label>
                  <select
                    id="edit-role"
                    className="input-field"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'teacher' | 'admin')}
                  >
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Assign Courses
                  </label>
                  <div className="max-h-40 overflow-y-auto border rounded p-2">
                    {courses.length > 0 ? (
                      courses.map(course => (
                        <div key={course.id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`edit-course-${course.id}`}
                            checked={selectedCourses.includes(course.id)}
                            onChange={() => handleCourseToggle(course.id)}
                            className="mr-2 focus:ring-primary text-primary"
                          />
                          <label htmlFor={`edit-course-${course.id}`} className="text-gray-700">
                            {course.title}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No courses available</p>
                    )}
                  </div>
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
                      'Update Teacher'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeachersTab; 