import React from 'react';

interface FormFieldErrorProps {
  error?: string;
  className?: string;
}

export const FormFieldError: React.FC<FormFieldErrorProps> = ({ 
  error, 
  className = '' 
}) => {
  if (!error) return null;

  return (
    <p className={`text-red-500 text-sm mt-1 ${className}`}>
      {error}
    </p>
  );
};

export default FormFieldError;
