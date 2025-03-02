'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { fetchSummaries } from '@/services/api';

export default function Summaries() {
  const router = useRouter();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummaries();
  }, []);

  const loadSummaries = async () => {
    try {
      const response = await fetchSummaries();
      if (response.success) {
        setSummaries(response.summaries);
      }
    } catch (error) {
      console.error('Error loading summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Create Summary Card */}
        <div 
          onClick={() => router.push('/dashboard/summaries/upload')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 dark:border-gray-600"
        >
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <span className="text-4xl mb-2">➕</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                Create New Summary
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload a PDF to generate a new summary
              </p>
            </div>
          </div>
        </div>

        {/* Summaries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div>Loading summaries...</div>
          ) : summaries.length > 0 ? (
            summaries.map((summary) => (
              <div 
                key={summary._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {summary.title || 'Untitled Summary'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {new Date(summary.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => router.push(`/dashboard/summaries/${summary._id}`)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                  >
                    View Summary →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              No summaries yet. Create your first one!
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 