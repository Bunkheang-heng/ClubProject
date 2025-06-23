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
      className="fixed w-full top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-cyan-500/30"
    >
      {/* Holographic glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-green-500/10" />
      
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group relative">
            <motion.div
              whileHover={{ 
                rotate: 360,
                scale: 1.1
              }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <FaCode className="h-10 w-10 text-cyan-400 relative z-10" />
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="font-black text-2xl bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                BYTEBUILDER
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
            </motion.div>
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
          <div className="hidden md:flex space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="relative px-6 py-3 font-mono text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group overflow-hidden rounded-lg"
                >
                  {/* Holographic background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Border glow */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-cyan-400/50 rounded-lg transition-all duration-300" />
                  
                  {/* Text */}
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Animated underline */}
                  <motion.div
                    className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-green-400 group-hover:w-4/5 transition-all duration-300"
                    style={{ transform: 'translateX(-50%)' }}
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
          className="md:hidden overflow-hidden backdrop-blur-xl bg-black/40 border-t border-cyan-500/30"
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="block px-4 py-3 rounded-lg text-base font-mono font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-green-500/20 transition-all duration-300 border border-transparent hover:border-cyan-400/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
