'use client'
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '@/firebase';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import AdminTabs from './components/AdminTabs';
import Spinner from '@/components/ui/Spinner';
import { Teacher, Course, AdminTab } from './types';

// Lazy load heavy components
const DashboardTab = dynamic(() => import('./components/DashboardTab'), { 
  loading: () => <Spinner size="lg" />,
  ssr: false
});
const TeachersTab = dynamic(() => import('./components/TeachersTab'), { 
  loading: () => <Spinner size="lg" />,
  ssr: false
});
const CoursesTab = dynamic(() => import('./components/CoursesTab'), { 
  loading: () => <Spinner size="lg" />,
  ssr: false
});
const EventsTab = dynamic(() => import('./components/EventsTab'), { 
  loading: () => <Spinner size="lg" />,
  ssr: false
});
const ChallengesTab = dynamic(() => import('./components/ChallengesTab'), { 
  loading: () => <Spinner size="lg" />,
  ssr: false
});
const SettingsTab = dynamic(() => import('./components/SettingsTab'), { 
  loading: () => <Spinner size="lg" />,
  ssr: false
});

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  // Memoize toast functions to prevent recreating on each render
  const showSuccess = useCallback((message: string) => toast.success(message), []);
  const showError = useCallback((message: string) => toast.error(message), []);

  // Handle logout with useCallback to maintain reference
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      showError('Error logging out: ' + (error as Error).message);
    }
  }, [router, showError]);

  // Authentication effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log("User authenticated:", user.uid);
          
          // Check if user is admin
          const userDocRef = doc(db, 'teachers', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const isUserAdmin = 
              userData.role === 'admin' || 
              userData.role === 'ADMIN' || 
              userData.isAdmin === true ||
              userData.specialRole === 'admin';
            
            if (isUserAdmin) {
              setIsAdmin(true);
              setAuthError(null);
            } else {
              setIsAdmin(false);
              setAuthError("You don't have admin privileges");
              router.push('/login');
            }
          } else {
            setIsAdmin(false);
            setAuthError("User profile not found");
            router.push('/login');
          }
        } else {
          setIsAdmin(false);
          setAuthError("Please log in to access admin panel");
          router.push('/login');
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setAuthError(`Error verifying admin status: ${(error as Error).message}`);
        setIsAdmin(false);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Data fetching effect - separate from auth check for better performance
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchData = async () => {
      try {
        // Use Promise.all to parallelize requests
        const [teachersSnapshot, coursesSnapshot] = await Promise.all([
          getDocs(collection(db, 'teachers')),
          getDocs(collection(db, 'courses'))
        ]);
        
        const teachersList = teachersSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Teacher[];
        
        const coursesList = coursesSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Course[];
        
        setTeachers(teachersList);
        setCourses(coursesList);
      } catch (error) {
        showError('Error loading data: ' + (error as Error).message);
      }
    };

    fetchData();
  }, [isAdmin, showError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
        <Spinner size="lg" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 px-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-700">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">{authError}</p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Only render the active tab to reduce DOM size
  const renderActiveTab = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardTab teachers={teachers} courses={courses} handleLogout={handleLogout} />;
      case 'teachers':
        return <TeachersTab 
          teachers={teachers} 
          courses={courses} 
          setTeachers={setTeachers} 
          showSuccess={showSuccess}
          showError={showError}
        />;
      case 'courses':
        return <CoursesTab 
          courses={courses} 
          teachers={teachers} 
          setCourses={setCourses} 
          showSuccess={showSuccess}
          showError={showError}
        />;
      case 'events':
        return <EventsTab />;
      case 'challenges':
        return <ChallengesTab 
          showSuccess={showSuccess}
          showError={showError}
        />;
      case 'settings':
        return <SettingsTab 
          showSuccess={showSuccess}
          showError={showError}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-8 flex-grow mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Manage your school's resources and settings</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 border border-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v3a1 1 0 102 0V9z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-700">
          <AdminTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          <div className="mt-8">
            <Suspense fallback={
              <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
              </div>
            }>
              {renderActiveTab()}
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        limit={3}
      />
    </div>
  );
};

export default AdminPage;
