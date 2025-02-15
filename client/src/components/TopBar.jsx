'use client'; // Mark this as a Client Component
import { useUser } from '@/context/UserContext';

const TopBar = () => {
  const { user } = useUser();

  return (
    <div className="bg-white p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Noted!</h2>
      <div className="container mx-auto flex justify-center">
        <p className="text-gray-700">
          Welcome, <strong>{user.name}</strong>
        </p>
      </div>
    </div>
  );
};

export default TopBar;
