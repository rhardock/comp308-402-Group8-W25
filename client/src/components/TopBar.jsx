'use client'; // Mark this as a Client Component
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

const TopBar = () => {
  const { user, logoutUser } = useUser();

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
      <h2 className="text-xl font-semibold  text-slate-800 dark:text-white">Noted!</h2>
        {user && ( 
          <>
            <p className="text-gray-700"></p>
            <button onClick={handleLogout}
                    className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </>
        )}
        {!user && (
          <div>
            <Link href="/login">
              <button className='bg-gray-900 dark:bg-gray-600 py-2 px-4 text-white rounded-lg mr-3 shadow-xl'>Log In</button>
            </Link>
            <Link href="/register">
              <button className='bg-gray-900 dark:bg-gray-600 py-2 px-4 text-white rounded-lg shadow-xl'>Register</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
