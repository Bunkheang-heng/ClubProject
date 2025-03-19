// Define basic teacher types
export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: string;
  courses: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  email?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  name: string;
  studentClass: string;
  attendance: string;
  timestamp: Date;
} 