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

// Separate components for better code organization and rendering performance
const TeacherProfile = memo(({ teacher }: { teacher: Teacher }) => (
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-md"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="text-2xl font-bold text-primary mb-2">{teacher.name}</h2>
    <p className="text-gray-600 mb-4">{teacher.email}</p>
    <div className="inline-block px-3 py-1 bg-gradient-to-r from-primary to-primary-light text-white rounded-full text-sm">
      {teacher.role || 'Teacher'}
    </div>
  </motion.div>
));

TeacherProfile.displayName = 'TeacherProfile';

const CoursesList = memo(({ courses }: { courses: Course[] }) => (
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-md"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
  >
    <h2 className="text-2xl font-bold text-primary mb-4">My Courses</h2>
    {courses.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => (
          <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-primary-dark">{course.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{course.description}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center py-4">No courses assigned yet.</p>
    )}
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
        return {
          'Student Name': record.name,
          'Student ID': record.studentId,
          'Status': record.attendance,
          'Course': classNames[record.studentClass] || record.studentClass,
          'Date': record.timestamp.toLocaleDateString(),
          'Time': record.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
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
      className="bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-primary mb-4">Attendance Records</h2>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
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
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportAttendanceToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              disabled={attendanceRecords.length === 0}
            >
              <FaFileExcel /> Export Excel
            </motion.button>
            
            <button
              onClick={onDeleteAttendance}
              disabled={!selectedDate}
              className="px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Selected Date Records
            </button>
          </div>
        </div>
      </div>
      
      {selectedDate ? (
        Object.keys(recordsByClass).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(recordsByClass).map(([classId, records]) => (
              <div key={classId} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg text-primary-dark mb-3">
                  {classNames[classId] || 'Unknown Class'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {records.map(record => (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{record.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              record.attendance === 'present' 
                                ? 'bg-green-100 text-green-800' 
                                : record.attendance === 'absent'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.attendance}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No records found for the selected date.</p>
        )
      ) : (
        <p className="text-gray-500 text-center py-4">Please select a date to view attendance records.</p>
      )}
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen flex flex-col">
      <Nav />
      <ToastContainer limit={3} /> 
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8 flex-grow"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <TeacherProfile teacher={teacher} />
            
            <CoursesList courses={courses} />
            
            <AttendanceManagement 
              attendanceRecords={attendanceRecords}
              classNames={classNames}
              onDeleteAttendance={handleDeleteAttendance}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl flex items-center gap-2 mx-auto"
              >
                <FaSignOutAlt /> Sign Out
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