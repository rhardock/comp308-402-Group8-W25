import React from 'react';
import dynamic from 'next/dynamic';
import { TopBar, Sidebar } from '@shared/components';

// Dynamically import ProtectedRoute from auth micro frontend
const ProtectedRoute = dynamic(() => import('auth/ProtectedRoute'), {
  ssr: false,
});

export default function MainLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 