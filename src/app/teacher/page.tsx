'use client'
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { FaSignOutAlt, FaFileExcel } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Spinner from '@/components/ui/Spinner';
import { Teacher, Course, AttendanceRecord } from '@/types/teacher';
import { db, auth } from '@/firebase';
import AttendanceControl from '@/components/teacher/AttendanceControl';

// Separate components for better code organization and rendering performance
const TeacherProfile = memo(({ teacher }: { teacher: Teacher }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-8 border border-gray-600 overflow-hidden"
  >
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full translate-y-12 -translate-x-12"></div>
    
    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">
            {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </span>
        </div>
        
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">{teacher.name}</h2>
          <p className="text-gray-400 text-lg mb-3">{teacher.email}</p>
          <div className="flex items-center gap-2">
            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
              teacher.role === 'admin' 
                ? 'bg-purple-600 text-white' 
                : 'bg-blue-600 text-white'
            } shadow-lg`}>
              {teacher.role === 'admin' ? '👑 Admin' : '👨‍🏫 Teacher'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="ml-auto">
        <div className="text-center">
          <p className="text-gray-400 text-sm uppercase tracking-wide">Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
));

TeacherProfile.displayName = 'TeacherProfile';

const CoursesList = memo(({ courses }: { courses: Course[] }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-8 border border-gray-600 overflow-hidden"
  >
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-y-12 translate-x-12"></div>
    <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full translate-y-10 -translate-x-10"></div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl">📚</span>
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">My Courses</h2>
          <p className="text-gray-400">Manage your assigned courses</p>
        </div>
      </div>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Card decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {course.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors">
                    {course.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: course.description }} />
                
                <div className="mt-4 pt-4 border-t border-gray-600/50">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Active Course</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center">
            <span className="text-gray-400 text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Courses Assigned</h3>
          <p className="text-gray-400">Contact your administrator to get courses assigned.</p>
        </motion.div>
      )}
    </div>
  </motion.div>
));

CoursesList.displayName = 'CoursesList';

interface AttendanceManagementProps {
  attendanceRecords: AttendanceRecord[];
  classNames: {[key: string]: string};
  onDeleteAttendance: () => Promise<void>;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const AttendanceManagement = memo(({ 
  attendanceRecords, 
  classNames, 
  onDeleteAttendance, 
  selectedDate, 
  onDateChange 
}: AttendanceManagementProps) => {
  // Group records by date with more robust date handling
  const recordsByDate = useMemo(() => {
    const grouped: { [key: string]: AttendanceRecord[] } = {};
    
    attendanceRecords.forEach(record => {
      // Normalize date to YYYY-MM-DD format to ensure consistent grouping
      const date = new Date(record.timestamp);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(record);
    });
    
    return grouped;
  }, [attendanceRecords]);

  // Get unique dates for the date selector
  const dates = useMemo(() => Object.keys(recordsByDate).sort().reverse(), [recordsByDate]);

  // Get the records for the selected date
  const selectedDateRecords = useMemo(() => 
    selectedDate ? (recordsByDate[selectedDate] || []) : [],
  [selectedDate, recordsByDate]);

  // Group selected records by class
  const recordsByClass = useMemo(() => {
    const grouped: { [key: string]: AttendanceRecord[] } = {};
    
    selectedDateRecords.forEach(record => {
      if (!grouped[record.studentClass]) {
        grouped[record.studentClass] = [];
      }
      grouped[record.studentClass].push(record);
    });
    
    return grouped;
  }, [selectedDateRecords]);

  // Add this function to handle Excel export
  const exportAttendanceToExcel = useCallback(() => {
    try {
      // Determine which records to export (all or filtered by date)
      const recordsToExport = selectedDate 
        ? attendanceRecords.filter(record => {
            const recordDate = record.timestamp.toISOString().split('T')[0];
            return recordDate === selectedDate;
          })
        : attendanceRecords;
        
      if (recordsToExport.length === 0) {
        toast.info('No records to export');
        return;
      }
      
      // Format data for Excel
      const formattedRecords = recordsToExport.map(record => {
        // Use Record<string, string> to allow dynamic property names
        const data: Record<string, string> = {
          'Student Name': record.name,
          'Student ID': record.studentId,
          'Status': record.attendance,
          'Course': classNames[record.studentClass] || record.studentClass,
          'Date': record.timestamp.toLocaleDateString(),
          'Time': record.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        // Add reason field if it's a permission status
        if (record.attendance === 'permission' && record.reason) {
          data['Reason'] = record.reason;
        }
        
        return data;
      });
      
      // Create worksheet with formatting
      const worksheet = XLSX.utils.json_to_sheet(formattedRecords);
      
      // Set column widths for better readability
      const columnWidths = [
        { wch: 25 }, // Student Name
        { wch: 15 }, // Student ID
        { wch: 10 }, // Status
        { wch: 25 }, // Course
        { wch: 15 }, // Date
        { wch: 10 }, // Time
        { wch: 40 }  // Reason (if applicable)
      ];
      worksheet['!cols'] = columnWidths;
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Records");
      
      // Generate filename with date filter if applicable
      const dateStr = selectedDate || new Date().toISOString().split('T')[0];
      const filename = `attendance_records_${dateStr}.xlsx`;
      
      XLSX.writeFile(workbook, filename);
      toast.success('Attendance records exported successfully');
    } catch (error) {
      console.error('Error exporting attendance records:', error);
      toast.error('Failed to export attendance records');
    }
  }, [attendanceRecords, selectedDate, classNames]);

  // DEBUG: Add this to help troubleshoot
  useEffect(() => {
    if (selectedDate) {
      console.log('Selected date:', selectedDate);
      console.log('Records for date:', recordsByDate[selectedDate] || []);
      console.log('Classes for date:', Object.keys(recordsByClass));
    }
  }, [selectedDate, recordsByDate, recordsByClass]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-8 border border-gray-600 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-12 translate-x-12"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-rose-500/10 rounded-full translate-y-10 -translate-x-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">📊</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Attendance Records</h2>
            <p className="text-gray-400">View and manage student attendance</p>
          </div>
        </div>
      
              <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Date to View Records
              </label>
              <select
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">-- Select a date --</option>
                {dates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportAttendanceToExcel}
                className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl flex items-center gap-2 font-medium shadow-lg transition-all duration-200"
                disabled={attendanceRecords.length === 0}
              >
                <FaFileExcel className="text-sm" /> Export
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDeleteAttendance}
                disabled={!selectedDate}
                className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Delete Records
              </motion.button>
            </div>
          </div>
        </div>
      
              {selectedDate ? (
          Object.keys(recordsByClass).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(recordsByClass).map(([classId, records]) => (
                <motion.div 
                  key={classId} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-700/50 border border-gray-600 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm">📚</span>
                    </div>
                    {classNames[classId] || 'Unknown Class'}
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-gray-600">
                    <table className="min-w-full divide-y divide-gray-600">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Student Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Student ID
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          {records.some(record => record.attendance === 'permission') && (
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                              Reason
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-gray-700/30 divide-y divide-gray-600">
                        {records.map(record => (
                          <tr key={record.id} className="hover:bg-gray-600/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{record.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">{record.studentId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                record.attendance === 'present' 
                                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' 
                                  : record.attendance === 'absent'
                                    ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                                    : record.attendance === 'permission'
                                      ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                                      : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {record.attendance}
                              </span>
                            </td>
                            {records.some(record => record.attendance === 'permission') && (
                              <td className="px-6 py-4 whitespace-normal">
                                {record.attendance === 'permission' && record.reason ? (
                                  <div className="text-sm text-gray-300 max-w-xs">{record.reason}</div>
                                ) : (
                                  <div className="text-sm text-gray-500">-</div>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center">
                <span className="text-gray-400 text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Records Found</h3>
              <p className="text-gray-400">No attendance records found for the selected date.</p>
            </motion.div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Select a Date</h3>
            <p className="text-gray-400">Choose a date from the dropdown to view attendance records.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

AttendanceManagement.displayName = 'AttendanceManagement';

const TeacherPage = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [classNames, setClassNames] = useState<{[key: string]: string}>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get teacher data
          const teacherDocRef = doc(db, 'teachers', user.uid);
          const teacherDocSnap = await getDoc(teacherDocRef);
          
          if (teacherDocSnap.exists()) {
            const teacherData = teacherDocSnap.data() as Teacher;
            setTeacher({
              ...teacherData,
              id: user.uid,
              name: teacherData.name || 'Unknown Teacher',
              role: teacherData.role || 'Teacher',
              courses: teacherData.courses || []
            });
            
            // Get courses and attendance in parallel for better performance
            const [coursesSnapshot, attendanceSnapshot] = await Promise.all([
              getDocs(collection(db, 'courses')),
              teacherData.courses?.length > 0 
                ? getDocs(query(collection(db, 'attendance'), where('studentClass', 'in', teacherData.courses))) 
                : Promise.resolve({ docs: [] })
            ]);
            
            const coursesList: Course[] = [];
            const classNamesMap: {[key: string]: string} = {};
            
            coursesSnapshot.docs.forEach(doc => {
              classNamesMap[doc.id] = doc.data().title;
              
              if (teacherData.courses?.includes(doc.id)) {
                coursesList.push({
                  id: doc.id,
                  title: doc.data().title,
                  description: doc.data().description
                });
              }
            });
            
            setCourses(coursesList);
            setClassNames(classNamesMap);
            
            const records: AttendanceRecord[] = attendanceSnapshot.docs.map(doc => ({
              id: doc.id,
              studentId: doc.data().studentId,
              name: doc.data().name,
              studentClass: doc.data().studentClass,
              attendance: doc.data().attendance,
              reason: doc.data().reason,
              timestamp: doc.data().timestamp.toDate()
            }));
            
            setAttendanceRecords(records);
          } else {
            router.push('/login');
          }
        } catch (error) {
          console.error("Error fetching teacher data: ", error);
          toast.error("Error loading teacher data");
        }
      } else {
        router.push('/login');
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error("Error signing out");
    }
  }, [router]);

  const handleDeleteAttendance = useCallback(async () => {
    if (!selectedDate) {
      toast.error("Please select a date first");
      return;
    }

    if (!confirm(`Are you sure you want to delete all attendance records for ${new Date(selectedDate).toLocaleDateString()}?`)) {
      return;
    }

    try {
      // Create a loading toast
      const loadingToast = toast.loading("Deleting attendance records...");
      
      // Get normalized date strings for comparison (YYYY-MM-DD format)
      const targetDateStr = selectedDate; // Already in YYYY-MM-DD format
      
      // Find records by comparing date strings instead of Date objects
      const recordsToDelete = attendanceRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        const recordDateStr = recordDate.toISOString().split('T')[0];
        return recordDateStr === targetDateStr;
      });
      
      if (recordsToDelete.length === 0) {
        toast.update(loadingToast, { 
          render: "No records found for the selected date", 
          type: "info", 
          isLoading: false,
          autoClose: 3000
        });
        return;
      }
      
      // Log for debugging
      console.log(`Deleting ${recordsToDelete.length} records for date ${targetDateStr}`);
      console.log('Record IDs to delete:', recordsToDelete.map(r => r.id));
      
      // Delete from Firestore
      await Promise.all(
        recordsToDelete.map(record => 
          deleteDoc(doc(db, 'attendance', record.id))
        )
      );
      
      // Update local state with the new filtered list
      setAttendanceRecords(prev => 
        prev.filter(record => {
          const recordDate = new Date(record.timestamp);
          const recordDateStr = recordDate.toISOString().split('T')[0];
          return recordDateStr !== targetDateStr;
        })
      );
      
      // Update toast
      toast.update(loadingToast, { 
        render: `Successfully deleted ${recordsToDelete.length} attendance records`, 
        type: "success", 
        isLoading: false,
        autoClose: 3000
      });
      
      // Reset the selected date
      setSelectedDate('');
      
    } catch (error) {
      console.error("Error deleting attendance:", error);
      toast.error("Failed to delete records. Please try again.");
    }
  }, [selectedDate, attendanceRecords]);

  if (!teacher) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex flex-col">
      <Nav />
      <ToastContainer 
        limit={3}
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{
          backgroundColor: '#374151',
          color: '#fff'
        }}
      /> 
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8 flex-grow mt-16"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-center">
            <h1 className="text-5xl font-black text-white tracking-tight mb-3">Teacher Dashboard</h1>
            <p className="text-gray-400 text-xl">Manage your courses and track student attendance</p>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <TeacherProfile teacher={teacher} />
            
            <CoursesList courses={courses} />
            
            <AttendanceControl 
              teacherId={teacher.id}
              courses={courses}
              classNames={classNames}
            />
            
            <AttendanceManagement 
              attendanceRecords={attendanceRecords}
              classNames={classNames}
              onDeleteAttendance={handleDeleteAttendance}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center gap-3 mx-auto border border-red-500/30"
              >
                <FaSignOutAlt className="text-xl" /> Sign Out
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default TeacherPage;