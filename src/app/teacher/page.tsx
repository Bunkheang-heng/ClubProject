'use client'
import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { db, auth } from '../../firebase';
import { doc, getDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import * as XLSX from 'xlsx';
import { FaChalkboardTeacher, FaBook, FaUserGraduate, FaFileExcel, FaSignOutAlt, FaTrash } from 'react-icons/fa';

interface Teacher {
    name: string;
    role: string;
    courses: string[];
}

interface Course {
    title: string;
    description: string;
}

interface AttendanceRecord {
    id: string;
    name: string;
    studentId: string;
    attendance: string;
    studentClass: string;
    timestamp: Date;
}

const TeacherPage = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [classNames, setClassNames] = useState<{[key: string]: string}>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
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

          if (teacherData.courses && teacherData.courses.length > 0) {
            const coursePromises = teacherData.courses.map(courseId => getDoc(doc(db, 'courses', courseId)));
            const courseDocs = await Promise.all(coursePromises);
            const courseList = courseDocs.map(courseDoc => {
              const courseData = courseDoc.data();
              return courseData ? (courseData as Course) : { title: 'Unknown', description: 'No description available' };
            });
            setCourses(courseList);

            const classNamesMap = courseDocs.reduce((acc, courseDoc) => {
              const courseData = courseDoc.data();
              if (courseData) {
                acc[courseDoc.id] = courseData.title;
              }
              return acc;
            }, {} as {[key: string]: string});
            setClassNames(classNamesMap);

            await fetchAttendanceRecords(teacherData.courses);
          }
        } else {
          console.log("No such document!");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchAttendanceRecords = async (courses: string[]) => {
    const attendanceQuery = query(collection(db, 'attendance'), where('studentClass', 'in', courses));
    const attendanceSnapshot = await getDocs(attendanceQuery);
    const attendanceList = attendanceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<AttendanceRecord, 'id'>),
      timestamp: doc.data().timestamp.toDate()
    }));
    setAttendanceRecords(attendanceList);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const downloadAttendanceAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(attendanceRecords.map(record => ({
      Name: record.name,
      Timestamp: record.timestamp,
      'Student ID': record.studentId,
      Course: classNames[record.studentClass] || record.studentClass
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance.xlsx");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const deleteAttendanceByDate = async () => {
    if (!selectedDate) {
      alert("Please select a date to delete attendance records.");
      return;
    }

    const selectedDateStart = new Date(selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);
    const selectedDateEnd = new Date(selectedDate);
    selectedDateEnd.setHours(23, 59, 59, 999);

    const recordsToDelete = attendanceRecords.filter(record => 
      record.timestamp >= selectedDateStart && record.timestamp <= selectedDateEnd
    );

    if (recordsToDelete.length === 0) {
      alert("No attendance records found for the selected date.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${recordsToDelete.length} attendance records for ${selectedDate}?`)) {
      try {
        await Promise.all(recordsToDelete.map(record => 
          deleteDoc(doc(db, 'attendance', record.id))
        ));
        alert("Attendance records deleted successfully.");
        await fetchAttendanceRecords(teacher?.courses || []);
      } catch (error) {
        console.error("Error deleting attendance records: ", error);
        alert("An error occurred while deleting attendance records.");
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 text-gray-900 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <div className="bg-white shadow-2xl rounded-3xl p-10">
          <h1 className="text-5xl font-extrabold mb-8 text-center text-indigo-800 tracking-tight">Teacher Dashboard</h1>
          {teacher ? (
            <div className="space-y-8">
              <div className="bg-indigo-50 p-6 rounded-2xl shadow-md">
                <div className="flex items-center mb-4">
                  <FaChalkboardTeacher className="text-4xl text-indigo-600 mr-4" />
                  <div>
                    <h2 className="text-3xl font-bold text-indigo-800">{teacher.name}</h2>
                    <p className="text-xl text-indigo-600">{teacher.role}</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-2xl shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-indigo-800 flex items-center">
                  <FaBook className="mr-2" /> Courses
                </h3>
                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map((course, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl shadow">
                        <h4 className="text-xl font-semibold text-indigo-700">{course.title}</h4>
                        <p className="text-gray-600">{course.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg text-gray-600">No courses assigned.</p>
                )}
              </div>

              <div className="bg-indigo-50 p-6 rounded-2xl shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-indigo-800 flex items-center">
                  <FaUserGraduate className="mr-2" /> Attendance Records
                </h3>
                <div className="mb-4 flex items-center">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="mr-2 p-2 border rounded"
                  />
                  <button
                    onClick={deleteAttendanceByDate}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaTrash className="mr-2" /> Delete Attendance by Date
                  </button>
                </div>
                {attendanceRecords.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-xl overflow-hidden">
                        <thead className="bg-indigo-600 text-white">
                          <tr>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Student ID</th>
                            <th className="py-3 px-4 text-left">Attendance</th>
                            <th className="py-3 px-4 text-left">Class</th>
                            <th className="py-3 px-4 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceRecords.map((record, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}>
                              <td className="py-2 px-4">{record.name}</td>
                              <td className="py-2 px-4">{record.studentId}</td>
                              <td className="py-2 px-4">{record.attendance}</td>
                              <td className="py-2 px-4">{classNames[record.studentClass] || record.studentClass}</td>
                              <td className="py-2 px-4">{record.timestamp.toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      onClick={downloadAttendanceAsExcel}
                      className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <FaFileExcel className="mr-2" /> Download Attendance as Excel
                    </button>
                  </>
                ) : (
                  <p className="text-lg text-gray-600">No attendance records found.</p>
                )}
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TeacherPage;