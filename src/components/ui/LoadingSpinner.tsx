import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'sm', className}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-3 h-3',
    lg: 'w-5 h-5'
  };

  return (
    <div className={cn('relative', className)}>
      <div style={{ fontSize: sizeClasses[size], animationDuration: '3s'}} className='loader'></div>
    </div>
  );
} 