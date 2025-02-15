import Link from 'next/link';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function DashboardLayout({ children }) {
  // Fetch the user's name (replace with your logic)
  const userName = 'John Doe'; // Example: Replace with session or context data

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* TopBar */}
        <TopBar userName={userName} />

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
