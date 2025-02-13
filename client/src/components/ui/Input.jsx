export function Input({ label, error, ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <input
        className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-black dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
          ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 