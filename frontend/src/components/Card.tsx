import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
  delay?: number;
}

export default function Card({ 
  children, 
  className = '', 
  hover = false, 
  animate = false,
  delay = 0
}: CardProps) {
  const baseClasses = 'card';
  const hoverClasses = hover ? 'hover-lift' : '';
  const animateClasses = animate ? 'fade-in-up' : '';
  
  const animationStyle = delay > 0 ? { animationDelay: `${delay}s` } : {};

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${animateClasses} ${className}`}
      style={animationStyle}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
}