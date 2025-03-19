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
  loading: () => <Spinner size="lg" /> 
});
const TeachersTab = dynamic(() => import('./components/TeachersTab'), { 
  loading: () => <Spinner size="lg" /> 
});
const CoursesTab = dynamic(() => import('./components/CoursesTab'), { 
  loading: () => <Spinner size="lg" /> 
});
const EventsTab = dynamic(() => import('./components/EventsTab'), { 
  loading: () => <Spinner size="lg" /> 
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
        <Spinner size="lg" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-primary mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">{authError}</p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-primary to-primary-light text-white font-bold py-2 px-4 rounded-lg hover:from-primary-dark hover:to-primary transition-all duration-300"
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold text-primary mb-8">Admin Dashboard</h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <AdminTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          <Suspense fallback={<Spinner size="lg" />}>
            {renderActiveTab()}
          </Suspense>
        </div>
      </div>
      <Footer />
      
      <ToastContainer limit={3} />
    </div>
  );
};

export default AdminPage;
