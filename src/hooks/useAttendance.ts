import { useState, useCallback } from 'react';
import { AttendanceRecord } from '@/types/teacher';
import { collection, getDocs, query, where, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { formatFirebaseError } from '@/utils/errorHandling';

export function useAttendance(teacherId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Fetch attendance records for a specific teacher
  const fetchAttendance = useCallback(async (courseId?: string, studentId?: string, date?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let attendanceQuery = query(
        collection(db, 'attendance'),
        where('teacherId', '==', teacherId)
      );
      
      if (courseId) {
        attendanceQuery = query(
          attendanceQuery,
          where('studentClass', '==', courseId)
        );
      }
      
      if (studentId) {
        attendanceQuery = query(
          attendanceQuery,
          where('studentId', '==', studentId)
        );
      }
      
      // Can't query by date range in Firestore without a special index,
      // so we'll filter on the client side
      
      const snapshot = await getDocs(attendanceQuery);
      const fetchedRecords: AttendanceRecord[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        const record: AttendanceRecord = {
          id: doc.id,
          studentId: data.studentId,
          name: data.name,
          studentClass: data.studentClass,
          attendance: data.attendance,
          timestamp: data.timestamp?.toDate() || new Date()
        };
        
        // Apply date filter if provided
        if (date) {
          const recordDate = record.timestamp.toISOString().split('T')[0];
          if (recordDate === date) {
            fetchedRecords.push(record);
          }
        } else {
          fetchedRecords.push(record);
        }
      });
      
      // Sort by date (newest first)
      fetchedRecords.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setRecords(fetchedRecords);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError(formatFirebaseError(error));
    } finally {
      setIsLoading(false);
    }
  }, [teacherId]);

  // Delete a specific attendance record
  const deleteAttendance = useCallback(async (recordId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteDoc(doc(db, 'attendance', recordId));
      
      // Update state
      setRecords(prev => prev.filter(record => record.id !== recordId));
      
      return true;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      setError(formatFirebaseError(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit attendance for multiple students
  const submitAttendance = useCallback(async (
    courseId: string,
    attendanceData: Array<{
      studentId: string;
      name: string;
      status: 'present' | 'absent' | 'late';
    }>,
    attendanceDate: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const batch = [];
      
      for (const record of attendanceData) {
        batch.push({
          teacherId,
          studentId: record.studentId,
          name: record.name,
          studentClass: courseId,
          attendance: record.status,
          date: attendanceDate,
          timestamp: serverTimestamp()
        });
      }
      
      // Call the API to save attendance
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacherId,
          courseId,
          date: attendanceDate,
          records: batch
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit attendance');
      }
      
      // Refresh attendance data
      await fetchAttendance(courseId);
      
      return true;
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setError(formatFirebaseError(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, fetchAttendance]);

  return {
    records,
    isLoading,
    error,
    fetchAttendance,
    deleteAttendance,
    submitAttendance
  };
} 