"use client";

import Link from "next/link";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from "react";

const Navbar = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [specialRole, setSpecialRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'teachers', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData.role || null);
          setSpecialRole(userData.specialRole || null);
        } else {
          setUserRole(null);
          setSpecialRole(null);
        }
      } else {
        setUserRole(null);
        setSpecialRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/aboutus", label: "About Us" },
    { href: "/attendance", label: "Attendance" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact" },
  ];

  if (userRole === 'teacher') {
    navItems.push({ href: "/teacher", label: "Teacher Dashboard" });
  }

  if (specialRole === 'admin') {
    navItems.push({ href: "/admin", label: "Admin Dashboard" });
  }

  return (
    <nav className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 18L22 12L16 6"></path>
                <path d="M8 6L2 12L8 18"></path>
              </svg>
              <span className="font-bold text-lg">ByteBuilders</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded hover:bg-primary-dark"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
