'use client'; // Mark this as a Client Component
import { useUser } from '@/context/UserContext';

const TopBar = () => {
  const { user, logoutUser } = useUser();

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="bg-white p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Noted!</h2>
      <div className="container mx-auto flex justify-center">
        <p className="text-gray-700">
          Welcome, <strong>{user.email}</strong>
        </p>
        <button onClick={handleLogout}
                className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
