'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  teacher?: {
    name: string;
    email: string;
  };
}

interface CourseModalProps {
  isOpen: boolean;
  course: Course | null;
  onClose?: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ isOpen, course, onClose }) => {
  const [displayedContent, setDisplayedContent] = useState<string>('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (isOpen && course) {
      setIsTyping(true);
      setDisplayedContent('');
      
      const content = `const course = {
  "title": "${course.title}",
  "description": \`${course.description}\`,
  ${course.teacher ? `"instructor": {
    "name": "${course.teacher.name}",
    "email": "${course.teacher.email}"
  },` : ''}
  "status": "available"
};`;

      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedContent(prev => prev + content[currentIndex]);
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    }
  }, [isOpen, course]);

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50" onClick={() => onClose?.()}>
      <div 
        className="bg-[#0D1117] rounded-lg border border-[#30363D] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="bg-[#161B22] border-b border-[#30363D] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27CA3F]"></div>
            </div>
            <span className="text-[#8B949E] text-sm font-mono ml-4">course-details.json</span>
          </div>
          <button 
            onClick={() => onClose?.()}
            className="text-[#8B949E] hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Terminal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-60px)] font-mono text-sm">
          <div className="text-[#8B949E] mb-4">
            <span className="text-[#7C3AED]">// Course Information</span>
          </div>
          
          <pre className="text-[#A5D6FF] whitespace-pre-wrap">
            {displayedContent}
            {isTyping && <span className="animate-pulse">|</span>}
          </pre>

          {/* Action Buttons */}
          <AnimatePresence>
            {!isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-4 border-t border-[#30363D]"
              >
                <div className="text-[#8B949E] mb-4">
                  <span className="text-[#7C3AED]">// Available Actions</span>
                </div>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-[#238636] hover:bg-[#2EA043] text-white rounded-lg transition-colors font-mono text-sm">
                    console.log("enroll_now");
                  </button>
                  <button 
                    onClick={() => onClose?.()}
                    className="px-4 py-2 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#F0F6FC] rounded-lg transition-colors font-mono text-sm"
                  >
                    process.exit(0);
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};