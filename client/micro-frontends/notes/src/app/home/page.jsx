'use client';

import MainLayout from '@/components/MainLayout';
import { Button } from '@shared/components';
import { useRouter } from 'next/navigation';
import { useAuth } from '@auth/useAuth';
import { FaPlus, FaChartBar } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            What would you like to do today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaPlus className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Note
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Start writing a new note or upload a PDF to get started.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Create Note
              </Button>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaChartBar className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  View Summary
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Get insights and summaries of your notes.
              </p>
              <Button onClick={() => router.push('/summary')}>
                View Summary
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Note Taking"
              description="Create, edit, and organize your notes with a rich text editor."
            />
            <FeatureCard
              title="PDF Support"
              description="Upload PDFs and extract text content automatically."
            />
            <FeatureCard
              title="Smart Summaries"
              description="Get AI-powered summaries of your notes and documents."
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
} 