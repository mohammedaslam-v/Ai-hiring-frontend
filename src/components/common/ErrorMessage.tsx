import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  variant?: 'default' | 'destructive' | 'warning';
  className?: string;
  showIcon?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  variant = 'default',
  className = '',
  showIcon = true
}) => {
  const variantClasses = {
    default: 'text-red-600 bg-red-50 border-red-200',
    destructive: 'text-red-700 bg-red-100 border-red-300',
    warning: 'text-amber-600 bg-amber-50 border-amber-200'
  };

  if (!message) return null;

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-md border ${variantClasses[variant]} ${className}`}>
      {showIcon && (
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
      )}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default ErrorMessage;
