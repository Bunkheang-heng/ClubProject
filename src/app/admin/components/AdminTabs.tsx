'use client'
import React, { memo, useCallback } from 'react';
import { FaHome, FaChalkboardTeacher, FaBook, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AdminTab } from '../types';

interface TabButtonProps {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: (id: AdminTab) => void;
}

// Memoize TabButton to prevent unnecessary re-renders
const TabButton = memo(({ id, label, icon, active, onClick }: TabButtonProps) => {
  // Use callback to memoize the onClick handler
  const handleClick = useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      onClick={handleClick}
      className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg' 
          : 'bg-white text-gray-700 hover:bg-gray-light border border-gray-200'
      }`}
      aria-pressed={active}
      role="tab"
      aria-controls={`${id}-panel`}
      id={`${id}-tab`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </motion.button>
  );
});

// Set display name for debugging
TabButton.displayName = 'TabButton';

interface AdminTabsProps {
  activeTab: AdminTab;
  setActiveTab: (id: AdminTab) => void;
}

// Define tab data outside component to prevent recreation on each render
const tabs: Array<{id: AdminTab; label: string; icon: JSX.Element}> = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaHome className="text-xl" /> },
  { id: 'teachers', label: 'Teachers', icon: <FaChalkboardTeacher className="text-xl" /> },
  { id: 'courses', label: 'Courses', icon: <FaBook className="text-xl" /> },
  { id: 'events', label: 'Events', icon: <FaCalendarAlt className="text-xl" /> }
];

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div 
      className="flex flex-wrap gap-4 mb-8"
      role="tablist"
      aria-label="Admin Dashboard Sections"
    >
      {tabs.map(tab => (
        <TabButton 
          key={tab.id}
          id={tab.id}
          label={tab.label}
          icon={tab.icon}
          active={activeTab === tab.id}
          onClick={setActiveTab}
        />
      ))}
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(AdminTabs); 