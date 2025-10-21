import React from 'react';
import { Loader2 } from 'lucide-react';

function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-primary-600 ${sizeClasses[size]}`} />
    </div>
  );
}

export default LoadingSpinner;