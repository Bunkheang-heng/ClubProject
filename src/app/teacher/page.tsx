'use client'
import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { db, auth } from '../../firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Define the Teacher and Course interfaces
interface Teacher {
    name: string;
    role: string;
    courses: string[]; // Add 'courses' here
}

interface Course {
    title: string;
    description: string;
}

const TeacherPage = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]); // Add state for attendance records
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
      } else {
        const docRef = doc(db, 'teachers', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const teacherData = docSnap.data() as Teacher;
          setTeacher(teacherData);

          // Fetch courses
          if (teacherData.courses && teacherData.courses.length > 0) {
            const coursePromises = teacherData.courses.map(courseId => getDoc(doc(db, 'courses', courseId)));
            const courseDocs = await Promise.all(coursePromises);
            const courseList = courseDocs.map(courseDoc => {
              const courseData = courseDoc.data();
              return courseData ? (courseData as Course) : { title: 'Unknown', description: 'No description available' };
            });
            setCourses(courseList);

            // Fetch attendance for teacher's courses only
            const attendanceQuery = query(collection(db, 'attendance'), where('studentClass', 'in', teacherData.courses));
            const attendanceSnapshot = await getDocs(attendanceQuery);
            const attendanceList = attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAttendanceRecords(attendanceList);
          }
        } else {
          console.log("No such document!");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 text-gray-900 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <div className="bg-white shadow-lg rounded-xl p-10">
          <h1 className="text-5xl font-extrabold mb-8 text-center text-green-800">Teacher Profile</h1>
          {teacher ? (
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">{teacher.name}</h2>
              <p className="text-lg">Role: {teacher.role}</p>
              <h3 className="text-xl font-bold mt-4">Courses:</h3>
              {courses.length > 0 ? (
                <ul className="list-disc list-inside">
                  {courses.map((course, index) => (
                    <li key={index} className="text-lg">{course.title}: {course.description}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg">No courses assigned.</p>
              )}
              <h3 className="text-xl font-bold mt-4">Attendance Records:</h3>
              {attendanceRecords.length > 0 ? (
                <ul className="list-disc list-inside">
                  {attendanceRecords.map((record, index) => (
                    <li key={index} className="text-lg">{record.name} (ID: {record.studentId}) - {record.attendance}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg">No attendance records found.</p>
              )}
              <div className="text-center mt-6">
                <button
                  onClick={handleLogout}
                  className="inline-block bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-lg">Loading...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TeacherPage;