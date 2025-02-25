'use client'; // Mark this as a Client Component

import Link from 'next/link';

import { useUser } from '@/context/UserContext';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const { user } = useUser();  // Get user from context
  const router = useRouter();

  // Fetch the user's name (replace with your logic)
  const userName = 'John Doe'; // Example: Replace with session or context data

  useEffect(() => {
    if (!user) {
      router.replace('/login'); // Redirect to login if no user
    }
  }, [user, router]);

  if (!user) return null; // Don't render anything if no user

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
