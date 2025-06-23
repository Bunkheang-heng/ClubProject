'use client'
import React from 'react'
import { motion } from 'framer-motion'

const programmingLogos = [
  {
    name: 'JavaScript',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    size: 40
  },
  {
    name: 'Python',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    size: 40
  },
  {
    name: 'Java',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    size: 40
  },
  {
    name: 'React',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    size: 40
  },
  {
    name: 'TypeScript',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    size: 40
  },
  {
    name: 'Node.js',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    size: 40
  },
  {
    name: 'HTML5',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    size: 40
  },
  {
    name: 'CSS3',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    size: 40
  },
  {
    name: 'MongoDB',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    size: 40
  },
  {
    name: 'Docker',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    size: 40
  },
  {
    name: 'Git',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    size: 40
  },
  {
    name: 'PHP',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    size: 40
  },
  {
    name: 'Firebase',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
    size: 40
  },
  {
    name: 'Tailwind CSS',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
    size: 40
  },
  {
    name: 'Next.js',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    size: 40
  },
  {
    name: 'Framer Motion',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framer/framer-original.svg',
    size: 40
  }
];

export const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {programmingLogos.map((logo, i) => (
        <motion.div
          key={logo.name}
          className="absolute"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            rotate: Math.random() * 360
          }}
          animate={{
            x: [
              null,
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
            ],
            y: [
              null,
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
            ],
            rotate: [
              null,
              Math.random() * 360,
              Math.random() * 360
            ]
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="relative group"
          >
            <img
              src={logo.url}
              alt={logo.name}
              width={logo.size}
              height={logo.size}
              className="opacity-40 hover:opacity-80 transition-opacity duration-300 filter brightness-110"
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1E1E1E]/80 backdrop-blur-sm text-green-400 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {logo.name}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}; 