import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  variant?: 'default' | 'success' | 'info';
  className?: string;
  showIcon?: boolean;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  variant = 'default',
  className = '',
  showIcon = true
}) => {
  const variantClasses = {
    default: 'text-green-600 bg-green-50 border-green-200',
    success: 'text-green-700 bg-green-100 border-green-300',
    info: 'text-blue-600 bg-blue-50 border-blue-200'
  };

  if (!message) return null;

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-md border ${variantClasses[variant]} ${className}`}>
      {showIcon && (
        <CheckCircle className="w-4 h-4 flex-shrink-0" />
      )}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default SuccessMessage;
