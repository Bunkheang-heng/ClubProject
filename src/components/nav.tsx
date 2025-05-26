"use client";

import Link from "next/link";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FaCode, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [specialRole, setSpecialRole] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-[#252526] text-gray-100 fixed w-full top-0 z-50 shadow-lg border-b border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaCode className="h-8 w-8 text-green-400 group-hover:text-green-500 transition-colors" />
            </motion.div>
            <motion.span 
              className="font-bold text-xl text-green-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              &lt;ByteBuilder/&gt;
            </motion.span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[#1E1E1E] focus:outline-none"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronDown className="h-6 w-6 text-green-400" />
              </motion.div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-green-400 hover:bg-[#1E1E1E] transition-colors relative group"
                >
                  {item.label}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                    initial={false}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden bg-[#1E1E1E]"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-green-400 hover:bg-[#252526] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
