'use client'
import React, { useState, useEffect } from 'react';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { db, auth } from '../../firebase';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import UploadEvent from '../../components/uploadEvent';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FaPlus, FaTrash, FaSignOutAlt, FaCalendarPlus } from 'react-icons/fa';

interface Teacher {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
}

const AdminPage = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUploadEvent, setShowUploadEvent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
      } else {
        const docRef = doc(db, 'teachers', user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || docSnap.data().specialRole !== 'admin') {
          router.push('/login');
        }
      }
    });

    const fetchData = async () => {
      const teachersSnapshot = await getDocs(collection(db, 'teachers'));
      const teachersList = teachersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Teacher[];
      setTeachers(teachersList);

      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Course[];
      setCourses(coursesList);
    };

    fetchData();

    return () => unsubscribe();
  }, [router]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const courseRef = await addDoc(collection(db, 'courses'), {
        title: courseTitle,
        description: courseDescription,
        teacherId
      });

      await updateDoc(doc(db, 'teachers', teacherId), {
        courses: arrayUnion(courseRef.id)
      });

      setCourses([...courses, { id: courseRef.id, title: courseTitle, description: courseDescription, teacherId }]);
      setSuccess('Course created successfully!');
      setCourseTitle('');
      setCourseDescription('');
      setTeacherId('');
      setShowCreateForm(false);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        const courseData = courseDoc.data() as Course;
        await deleteDoc(doc(db, 'courses', courseId));
        await updateDoc(doc(db, 'teachers', courseData.teacherId), {
          courses: arrayRemove(courseId)
        });
        setCourses(courses.filter(course => course.id !== courseId));
        setSuccess('Course deleted successfully!');
      } else {
        setError('Course not found.');
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <div className="bg-white shadow-2xl rounded-xl p-10">
          <h1 className="text-5xl font-extrabold mb-8 text-center text-purple-800 tracking-tight">Admin Dashboard</h1>
          {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4 font-semibold">{success}</p>}
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-purple-800">Courses</h2>
            <div className="space-x-4">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
              >
                <FaPlus className="mr-2" /> {showCreateForm ? 'Cancel' : 'Create Course'}
              </button>
              <button
                onClick={() => setShowUploadEvent(!showUploadEvent)}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
              >
                <FaCalendarPlus className="mr-2" /> {showUploadEvent ? 'Cancel' : 'Upload Event'}
              </button>
            </div>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateCourse} className="bg-purple-100 p-8 rounded-lg shadow-md mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    id="courseTitle"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-150 ease-in-out"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">Assign Teacher</label>
                  <select
                    id="teacherId"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-150 ease-in-out"
                    required
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
                <textarea
                  id="courseDescription"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-150 ease-in-out"
                  required
                  rows={4}
                />
              </div>
              <div className="mt-6 text-right">
                <button
                  type="submit"
                  className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
                >
                  <FaPlus className="mr-2" /> Create Course
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-900 transition duration-300 transform hover:scale-110"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
      {showUploadEvent && <UploadEvent />}
      <Footer />
    </div>
  );
}

export default AdminPage;
