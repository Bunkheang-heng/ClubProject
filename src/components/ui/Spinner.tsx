import React, { memo } from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

// Use memo to prevent unnecessary re-renders
const Spinner: React.FC<SpinnerProps> = memo(({ 
  size = 'md', 
  color = 'primary',
  className = ''
}) => {
  // Pre-calculate size classes for better performance
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[size];
  
  // Determine border color
  const borderColor = color === 'white' ? 'border-white' : `border-${color}`;
  
  return (
    <div 
      className={`${sizeClass} border-4 ${borderColor} border-t-transparent rounded-full animate-spin ${className}`}
      aria-label="Loading" 
      role="status"
    />
  );
});

// Set display name for debugging
Spinner.displayName = 'Spinner';

export default Spinner; 