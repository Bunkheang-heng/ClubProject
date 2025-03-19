'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '../../components/nav';
import Footer from '../../components/footer';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const showSuccess = (message: string) => toast.success(message);
  const showError = (message: string) => toast.error(message);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user is a teacher
      const userDocRef = doc(db, 'teachers', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        showSuccess('Login successful!');
        // Redirect to teacher page
        router.push('/teacher');
      } else {
        showError('Access denied. You are not registered as a teacher.');
        // Sign out the user if they're not a teacher
        await auth.signOut();
      }
    } catch (error) {
      showError((error as Error).message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-6 flex-grow mt-20">
        <div className="bg-white shadow-lg rounded-xl p-10">
          <h1 className="text-5xl font-extrabold mb-8 text-center text-primary">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="inline-block bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
