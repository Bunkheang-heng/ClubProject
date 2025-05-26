'use client'
import React from 'react'

export const TerminalEffect = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="absolute -top-6 left-0 right-0 h-6 bg-[#1E1E1E] rounded-t-lg flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      {children}
    </div>
  );
}; 