export type AdminTab = 'dashboard' | 'teachers' | 'courses' | 'events';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: string;
  courses: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
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
  studentName: string;
  courseId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

// Type guards for runtime validation
export const isTeacher = (obj: any): obj is Teacher => {
  return obj && 
    typeof obj.id === 'string' && 
    typeof obj.name === 'string' && 
    typeof obj.email === 'string';
};

export const isCourse = (obj: any): obj is Course => {
  return obj && 
    typeof obj.id === 'string' && 
    typeof obj.title === 'string' && 
    typeof obj.description === 'string';
}; 