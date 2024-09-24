"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaInfoCircle, FaCalendarCheck, FaCalendarAlt, FaEnvelope, FaChalkboardTeacher, FaUserCog } from "react-icons/fa";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [specialRole, setSpecialRole] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check user role from the 'teacher' collection
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: FaHome },
    { href: "/aboutus", label: "About Us", icon: FaInfoCircle },
    { href: "/attendance", label: "Attendance", icon: FaCalendarCheck },
    { href: "/events", label: "Events", icon: FaCalendarAlt },
    { href: "/contact", label: "Contact", icon: FaEnvelope },
  ];

  if (userRole === 'teacher') {
    navItems.push({ href: "/teacher", label: "Teacher Dashboard", icon: FaChalkboardTeacher });
  }

  if (specialRole === 'admin') {
    navItems.push({ href: "/admin", label: "Admin Dashboard", icon: FaUserCog });
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-blue-800 shadow-lg" : "bg-blue-800"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0 flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" legacyBehavior>
              <a className="text-white font-bold text-xl hover:text-blue-300 transition-colors duration-300">
                ByteBuilders Club
              </a>
            </Link>
          </motion.div>

          {/* Menu for larger screens */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={item.href} legacyBehavior>
                  <a className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center">
                    <item.icon className="mr-2" />
                    {item.label}
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-blue-300 focus:outline-none transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-blue-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} legacyBehavior>
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700 hover:text-blue-300 transition-colors duration-300 flex items-center">
                    <item.icon className="mr-2" />
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
