import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { sanitizeInput } from '@/utils/errorHandling';

// Rate limiting setup
const RATE_LIMIT = 100; // requests per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const ipRequestMap = new Map<string, { count: number, timestamp: number }>();

// Rate limiter middleware
const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const requestData = ipRequestMap.get(ip);
  
  if (!requestData) {
    ipRequestMap.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    // Reset if window has passed
    ipRequestMap.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  if (requestData.count >= RATE_LIMIT) {
    return true; // Rate limit exceeded
  }
  
  // Increment count
  ipRequestMap.set(ip, { 
    count: requestData.count + 1, 
    timestamp: requestData.timestamp 
  });
  
  return false;
};

export async function GET(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        { status: 429 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');
    const date = searchParams.get('date');
    
    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }
    
    // Check if teacher exists and has proper permissions
    const teacherRef = doc(db, 'teachers', teacherId);
    const teacherDoc = await getDoc(teacherRef);
    
    if (!teacherDoc.exists()) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    // Build query
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
    
    // Get attendance records
    const snapshot = await getDocs(attendanceQuery);
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ records }, { status: 200 });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const { teacherId, records, courseId, date } = body;
    
    if (!teacherId || !records || !Array.isArray(records) || !courseId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate teacher exists
    const teacherRef = doc(db, 'teachers', teacherId);
    const teacherDoc = await getDoc(teacherRef);
    
    if (!teacherDoc.exists()) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    // Validate course exists and teacher has access
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    
    if (!courseDoc.exists()) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    const teacherData = teacherDoc.data();
    if (!teacherData.courses?.includes(courseId)) {
      return NextResponse.json(
        { error: 'Teacher does not have access to this course' },
        { status: 403 }
      );
    }
    
    // Sanitize and validate records
    const validRecords = records.filter(record => {
      return (
        record.studentId && 
        record.name && 
        ['present', 'absent', 'late'].includes(record.attendance)
      );
    }).map(record => ({
      teacherId,
      courseId,
      date,
      studentId: sanitizeInput(record.studentId),
      name: sanitizeInput(record.name),
      studentClass: courseId,
      attendance: record.attendance,
      timestamp: serverTimestamp()
    }));
    
    if (validRecords.length === 0) {
      return NextResponse.json(
        { error: 'No valid attendance records provided' },
        { status: 400 }
      );
    }
    
    // Add records to Firestore
    const results = await Promise.all(
      validRecords.map(record => addDoc(collection(db, 'attendance'), record))
    );
    
    return NextResponse.json({
      success: true,
      count: results.length
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving attendance:', error);
    
    return NextResponse.json(
      { error: 'Failed to save attendance' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        { status: 429 }
      );
    }
    
    // Parse request parameters
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('id');
    const teacherId = searchParams.get('teacherId');
    
    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the record exists
    const recordRef = doc(db, 'attendance', recordId);
    const recordDoc = await getDoc(recordRef);
    
    if (!recordDoc.exists()) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }
    
    // Verify the teacher has permission to delete this record
    if (teacherId) {
      const recordData = recordDoc.data();
      if (recordData.teacherId !== teacherId) {
        return NextResponse.json(
          { error: 'You do not have permission to delete this record' },
          { status: 403 }
        );
      }
    }
    
    // Delete the record
    await deleteDoc(recordRef);
    
    return NextResponse.json({
      success: true,
      message: 'Attendance record deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete attendance record' },
      { status: 500 }
    );
  }
} 