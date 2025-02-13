import { cn } from '@/lib/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as = 'h1', size = 'lg', children, ...props }, ref) => {
    const Component = as;

    const sizes = {
      sm: 'text-lg font-semibold',
      md: 'text-xl font-semibold',
      lg: 'text-2xl font-semibold',
      xl: 'text-3xl font-semibold',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          'scroll-m-20 tracking-tight',
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
); 