"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin, FaCode, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#252526] text-gray-100 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 mb-4"
            >
              <FaCode className="h-6 w-6 text-green-400" />
              <span className="text-xl font-bold text-green-400">&lt;ByteBuilder/&gt;</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-300 mb-4"
            >
              Empowering students with coding skills and knowledge for a brighter future.
              <br />
              <code className="text-green-400">while(true) &#123; learn(); grow(); succeed(); &#125;</code>
            </motion.p>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg font-semibold mb-4 text-green-400"
            >
              Quick Links
            </motion.h3>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <li>
                <Link href="/aboutus" className="text-gray-300 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-green-400 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/attendance" className="text-gray-300 hover:text-green-400 transition-colors">
                  Attendance
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </motion.ul>
          </div>

          {/* Social Links */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg font-semibold mb-4 text-green-400"
            >
              Connect With Us
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaGithub className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaTwitter className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaLinkedin className="h-6 w-6" />
              </motion.a>
            </motion.div>
          </div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-gray-700 text-center"
        >
          <p className="text-gray-300 flex items-center justify-center gap-2">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaHeart className="text-red-500" />
            </motion.div>
            <span>by ByteBuilder Team</span>
          </p>
          <p className="text-gray-400 mt-2">
            <code>&copy; {new Date().getFullYear()} ByteBuilder. All rights reserved.</code>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
