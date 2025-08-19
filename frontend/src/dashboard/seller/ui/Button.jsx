import React from 'react';

export const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
