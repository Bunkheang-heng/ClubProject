export type AdminTab = 'dashboard' | 'teachers' | 'courses' | 'events' | 'challenges' | 'settings';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: string;
  courses: string[];
  specialRole?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
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

export interface Challenge {
  id?: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  example: string;
  constraints: string[];
  points: number;
  timeLimit: number; // in minutes
  functionName: string;
  testCases: Array<{input: any, expected: any}>;
  createdAt?: any;
  createdBy?: string;
  maxAttempts?: number; // Optional: if set, limits attempts for this challenge
}

export interface AppSettings {
  id?: string;
  challengesEnabled: boolean;
  lastUpdated?: any;
  updatedBy?: string;
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