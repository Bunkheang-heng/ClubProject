'use client'
import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaClock, FaSave, FaUndo } from 'react-icons/fa';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { Student, Course } from '@/types/teacher';
import Spinner from '@/components/ui/Spinner';

interface StudentWithAttendance extends Student {
  attendance: 'present' | 'absent' | 'late' | null;
}

interface AttendanceFormProps {
  students: Student[];
  courses: Course[];
  teacherId: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

// Memoized student row component
const StudentRow = memo(({
  student,
  onStatusChange,
}: {
  student: StudentWithAttendance;
  onStatusChange: (studentId: string, status: 'present' | 'absent' | 'late') => void;
}) => {
  // Callbacks for each status change button
  const markPresent = useCallback(() => {
    onStatusChange(student.id, 'present');
  }, [student.id, onStatusChange]);

  const markAbsent = useCallback(() => {
    onStatusChange(student.id, 'absent');
  }, [student.id, onStatusChange]);

  const markLate = useCallback(() => {
    onStatusChange(student.id, 'late');
  }, [student.id, onStatusChange]);

  // Determine the active status button
  const getButtonClass = (status: 'present' | 'absent' | 'late') => {
    if (student.attendance === status) {
      const baseClasses = "flex items-center justify-center w-10 h-10 rounded-full";
      
      switch (status) {
        case 'present':
          return `${baseClasses} bg-green-500 text-white`;
        case 'absent':
          return `${baseClasses} bg-red-500 text-white`;
        case 'late':
          return `${baseClasses} bg-yellow-500 text-white`;
      }
    }
    
    return "flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 border-b"
    >
      <div>
        <h3 className="font-medium text-gray-800">{student.name}</h3>
        <p className="text-sm text-gray-500">ID: {student.studentId}</p>
      </div>
      
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={markPresent}
          className={getButtonClass('present')}
          title="Mark as present"
          aria-label="Mark as present"
        >
          <FaCheck />
        </button>
        
        <button
          type="button"
          onClick={markAbsent}
          className={getButtonClass('absent')}
          title="Mark as absent"
          aria-label="Mark as absent"
        >
          <FaTimes />
        </button>
        
        <button
          type="button"
          onClick={markLate}
          className={getButtonClass('late')}
          title="Mark as late"
          aria-label="Mark as late"
        >
          <FaClock />
        </button>
      </div>
    </motion.div>
  );
});

StudentRow.displayName = 'StudentRow';

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  students,
  courses,
  teacherId,
  onSuccess,
  onError
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<StudentWithAttendance[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Update attendance data when students change or reset
  useMemo(() => {
    const initialData = students.map(student => ({
      ...student,
      attendance: null
    }));
    setAttendanceData(initialData);
  }, [students]);

  const selectedCourseTitle = useMemo(() => {
    const course = courses.find(c => c.id === selectedCourse);
    return course ? course.title : '';
  }, [selectedCourse, courses]);

  // Count students by attendance status
  const attendanceCounts = useMemo(() => {
    return attendanceData.reduce(
      (counts, student) => {
        if (student.attendance === 'present') counts.present++;
        else if (student.attendance === 'absent') counts.absent++;
        else if (student.attendance === 'late') counts.late++;
        else counts.unmarked++;
        return counts;
      },
      { present: 0, absent: 0, late: 0, unmarked: 0 }
    );
  }, [attendanceData]);

  // Update the status of a specific student
  const handleStatusChange = useCallback((studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.id === studentId
          ? { ...student, attendance: student.attendance === status ? null : status }
          : student
      )
    );
  }, []);

  // Set all students to the same status
  const markAllAs = useCallback((status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => 
      prev.map(student => ({ ...student, attendance: status }))
    );
  }, []);

  // Reset all attendance statuses
  const resetAll = useCallback(() => {
    setAttendanceData(prev => 
      prev.map(student => ({ ...student, attendance: null }))
    );
  }, []);

  // Submit attendance records to Firestore
  const submitAttendance = useCallback(async () => {
    if (!selectedCourse) {
      onError('Please select a course');
      return;
    }

    const unmarkedStudents = attendanceData.filter(student => student.attendance === null);
    if (unmarkedStudents.length > 0) {
      if (!confirm(`${unmarkedStudents.length} students are unmarked. Continue anyway?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      // Create a timestamp for the selected date
      const selectedDate = new Date(date);
      
      // Process all students with attendance status
      const attendancePromises = attendanceData
        .filter(student => student.attendance !== null)
        .map(student => 
          addDoc(collection(db, 'attendance'), {
            teacherId,
            studentId: student.id,
            name: student.name,
            studentClass: selectedCourse,
            attendance: student.attendance,
            timestamp: selectedDate,
            created: serverTimestamp()
          })
        );
      
      await Promise.all(attendancePromises);
      
      onSuccess(`Attendance recorded for ${selectedCourseTitle}`);
      resetAll();
    } catch (error) {
      console.error('Error submitting attendance:', error);
      onError('Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCourse, selectedCourseTitle, attendanceData, date, teacherId, onSuccess, onError, resetAll]);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-xl font-bold text-primary mb-4">Record Attendance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              disabled={isSubmitting}
            >
              <option value="">-- Select a course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              max={new Date().toISOString().split('T')[0]}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        {/* Status bar */}
        <div className="flex flex-wrap justify-between items-center p-3 bg-gray-100 rounded-lg">
          <div className="flex space-x-4 mb-2 sm:mb-0">
            <div className="text-center">
              <span className="block text-sm font-medium text-gray-500">Present</span>
              <span className="text-xl font-bold text-green-600">{attendanceCounts.present}</span>
            </div>
            <div className="text-center">
              <span className="block text-sm font-medium text-gray-500">Absent</span>
              <span className="text-xl font-bold text-red-600">{attendanceCounts.absent}</span>
            </div>
            <div className="text-center">
              <span className="block text-sm font-medium text-gray-500">Late</span>
              <span className="text-xl font-bold text-yellow-600">{attendanceCounts.late}</span>
            </div>
            <div className="text-center">
              <span className="block text-sm font-medium text-gray-500">Unmarked</span>
              <span className="text-xl font-bold text-gray-600">{attendanceCounts.unmarked}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => markAllAs('present')}
              className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200"
              disabled={isSubmitting}
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => markAllAs('absent')}
              className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200"
              disabled={isSubmitting}
            >
              All Absent
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Student list */}
      <div className="max-h-96 overflow-y-auto">
        {attendanceData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No students available for this course.
          </div>
        ) : (
          attendanceData.map(student => (
            <StudentRow
              key={student.id}
              student={student}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
      
      {/* Submit button */}
      <div className="p-4 border-t bg-gray-50 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={submitAttendance}
          disabled={isSubmitting || !selectedCourse}
          className="px-6 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" color="white" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <FaSave />
              <span>Save Attendance</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default memo(AttendanceForm); 