import React from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Dynamically import useAuth from auth micro frontend
const useAuth = dynamic(() => import('auth/useAuth'), {
  ssr: false,
});

export const TopBar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Noted
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FaUser className="h-5 w-5 text-gray-400 dark:text-gray-300" />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.name || 'User'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <FaSignOutAlt className="h-5 w-5" />
            <span className="ml-2 text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 