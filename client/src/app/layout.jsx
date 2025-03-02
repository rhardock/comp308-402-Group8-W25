'use client';

import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Providers from './Providers';
import TopBar from "@/components/TopBar";
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          <AuthProvider>
            {!isDashboard && <TopBar />}
            <Providers>
              {children}
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 
