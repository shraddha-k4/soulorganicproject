import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-6 sm:p-8 text-gray-800 ${className}`}>
      {children}
    </div>
  );
};