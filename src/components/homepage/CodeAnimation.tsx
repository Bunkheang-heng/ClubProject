'use client'
import React from 'react'
import { motion } from 'framer-motion'

export const CodeAnimation = () => {
  const codeLines = [
    "class ByteBuilder {",
    "  constructor() {",
    "    this.passion = 'coding';",
    "    this.mission = 'educate';",
    "  }",
    "  build() {",
    "    return 'future';",
    "  }",
    "}"
  ];

  return (
    <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 overflow-hidden">
      {codeLines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="font-mono text-green-400 text-lg"
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}; 