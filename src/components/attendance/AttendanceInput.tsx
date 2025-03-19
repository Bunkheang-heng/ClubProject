'use client'
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Student, Course } from '@/types/teacher';
import { debounce } from 'lodash';
import { FaSearch, FaUserCheck, FaUserTimes, FaUserClock } from 'react-icons/fa';

interface AttendanceInputProps {
  students: Student[];
  courses: Course[];
  onSubmit: (data: Array<{
    studentId: string;
    name: string;
    status: 'present' | 'absent' | 'late';
    courseId: string;
  }>) => Promise<void>;
  isLoading?: boolean;
}

// Memoized student card for optimized rendering
const StudentCard = memo(({
  student,
  onStatusChange,
  status,
  disabled
}: {
  student: Student;
  onStatusChange: (id: string, status: 'present' | 'absent' | 'late' | null) => void;
  status: 'present' | 'absent' | 'late' | null;
  disabled: boolean;
}) => {
  const statusClass = useMemo(() => {
    switch (status) {
      case 'present': return 'bg-green-50 border-green-200';
      case 'absent': return 'bg-red-50 border-red-200';
      case 'late': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-white';
    }
  }, [status]);

  const handlePresent = useCallback(() => {
    onStatusChange(student.id, status === 'present' ? null : 'present');
  }, [student.id, status, onStatusChange]);

  const handleAbsent = useCallback(() => {
    onStatusChange(student.id, status === 'absent' ? null : 'absent');
  }, [student.id, status, onStatusChange]);

  const handleLate = useCallback(() => {
    onStatusChange(student.id, status === 'late' ? null : 'late');
  }, [student.id, status, onStatusChange]);

  return (
    <motion.div 
      className={`border rounded-lg p-4 ${statusClass} transition-colors`}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{student.name}</h3>
          <p className="text-sm text-gray-500">ID: {student.studentId}</p>
        </div>
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={handlePresent}
            disabled={disabled}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              status === 'present' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Mark as present"
          >
            <FaUserCheck />
          </button>
          <button
            type="button"
            onClick={handleAbsent}
            disabled={disabled}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              status === 'absent' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Mark as absent"
          >
            <FaUserTimes />
          </button>
          <button
            type="button"
            onClick={handleLate}
            disabled={disabled}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              status === 'late' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Mark as late"
          >
            <FaUserClock />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

StudentCard.displayName = 'StudentCard';

const AttendanceInput: React.FC<AttendanceInputProps> = ({
  students,
  courses,
  onSubmit,
  isLoading = false
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [studentStatus, setStudentStatus] = useState<Record<string, 'present' | 'absent' | 'late' | null>>({});
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Reset student status when course changes
  useEffect(() => {
    setStudentStatus({});
  }, [selectedCourse]);

  // Filter students by search query and selected course
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = searchQuery === '' || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [students, searchQuery]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  // Update student status
  const handleStatusChange = useCallback((studentId: string, status: 'present' | 'absent' | 'late' | null) => {
    setStudentStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  }, []);

  // Prepare and submit attendance data
  const handleSubmit = useCallback(async () => {
    const attendanceData = Object.entries(studentStatus)
      .filter(([_, status]) => status !== null)
      .map(([studentId, status]) => {
        const student = students.find(s => s.id === studentId);
        return {
          studentId,
          name: student?.name || '',
          status: status as 'present' | 'absent' | 'late',
          courseId: selectedCourse
        };
      });
    
    if (attendanceData.length > 0) {
      await onSubmit(attendanceData);
    }
  }, [studentStatus, students, selectedCourse, onSubmit]);

  // Count of each status
  const statusCounts = useMemo(() => {
    return Object.values(studentStatus).reduce(
      (counts, status) => {
        if (status) {
          counts[status] = (counts[status] || 0) + 1;
        }
        return counts;
      },
      {} as Record<string, number>
    );
  }, [studentStatus]);

  // Mark all students with a specific status
  const markAll = useCallback((status: 'present' | 'absent' | 'late' | null) => {
    const newStatus: Record<string, 'present' | 'absent' | 'late' | null> = {};
    
    filteredStudents.forEach(student => {
      newStatus[student.id] = status;
    });
    
    setStudentStatus(prev => ({
      ...prev,
      ...newStatus
    }));
  }, [filteredStudents]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Record Attendance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            onChange={handleSearchChange}
            placeholder="Search students..."
            className="w-full p-2 pl-10 border rounded"
            disabled={isLoading}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <FaSearch />
          </div>
        </div>
      </div>
      
      <div className="mb-4 bg-gray-50 p-4 rounded-lg flex flex-wrap justify-between items-center">
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Present</div>
            <div className="text-xl font-bold text-green-600">{statusCounts.present || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Absent</div>
            <div className="text-xl font-bold text-red-600">{statusCounts.absent || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Late</div>
            <div className="text-xl font-bold text-yellow-600">{statusCounts.late || 0}</div>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={() => markAll('present')}
            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
            disabled={isLoading}
          >
            All Present
          </button>
          <button
            type="button"
            onClick={() => markAll('absent')}
            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
            disabled={isLoading}
          >
            All Absent
          </button>
          <button
            type="button"
            onClick={() => markAll(null)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            disabled={isLoading}
          >
            Reset All
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                status={studentStatus[student.id] || null}
                onStatusChange={handleStatusChange}
                disabled={isLoading}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-8">
              No students found. Try adjusting your search criteria.
            </p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !selectedCourse || Object.keys(studentStatus).length === 0}
          className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Attendance'}
        </button>
      </div>
    </div>
  );
};

export default memo(AttendanceInput); 