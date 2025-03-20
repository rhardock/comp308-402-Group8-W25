import React from 'react';

export const Input = React.forwardRef(({ 
  label,
  type = 'text',
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3 py-2 border rounded-lg
          bg-white dark:bg-gray-800
          border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-gray-100
          focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          focus:border-transparent
          disabled:opacity-50
          ${error ? 'border-red-500 dark:border-red-400' : ''}
          ${className}
        `}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}); 