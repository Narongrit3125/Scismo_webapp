import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  overlay?: boolean;
}

export default function Loading({ 
  size = 'md', 
  text = 'กำลังโหลด...', 
  overlay = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Enhanced spinning loader with gradient */}
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-200`}></div>
        <div className={`${sizeClasses[size]} rounded-full border-4 border-transparent border-t-orange-500 border-r-red-500 absolute top-0 left-0 animate-spin`}></div>
        
        {/* Pulsing center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-1 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {text && (
        <div className={`${textSizeClasses[size]} text-gray-600 font-medium animate-pulse text-center`}>
          {text}
          <span className="loading-dots">...</span>
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 fade-in">
        <div className="bg-white rounded-xl shadow-xl p-8 scale-in">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8 fade-in">
      <LoadingSpinner />
    </div>
  );
}