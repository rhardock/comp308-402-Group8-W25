'use client';

import { NotesProvider } from '@/context/NotesContext';
import dynamic from 'next/dynamic';
import '@/styles/globals.css';

// Dynamically import AuthProvider from auth micro frontend
const AuthProvider = dynamic(() => import('auth/AuthProvider'), {
  ssr: false,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NotesProvider>
            {children}
          </NotesProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 