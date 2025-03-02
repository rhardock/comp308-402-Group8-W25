'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Modal } from '@/components/ui/Modal';
import { fetchSummaries } from '@/services/api';
import { FiUpload, FiFileText } from 'react-icons/fi';
import FileUploadModal from './components/FileUploadModal';
import TextInputModal from './components/TextInputModal';

export default function Summaries() {
  const router = useRouter();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);

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
          onClick={() => setIsMethodModalOpen(true)}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 dark:border-gray-600"
        >
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <span className="text-4xl mb-2">➕</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                Create New Summary
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload a PDF or paste text to generate a summary
              </p>
            </div>
          </div>
        </div>

        {/* Method Selection Modal */}
        <Modal 
          isOpen={isMethodModalOpen} 
          onClose={() => setIsMethodModalOpen(false)}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Choose Summary Method
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              How do you want to provide your content?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setIsMethodModalOpen(false);
                setIsFileModalOpen(true);
              }}
              className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiUpload className="w-8 h-8 mb-3 text-rose-500" />
              <span className="text-gray-900 dark:text-white font-medium">File upload</span>
            </button>

            <button
              onClick={() => {
                setIsMethodModalOpen(false);
                setIsTextModalOpen(true);
              }}
              className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiFileText className="w-8 h-8 mb-3 text-rose-500" />
              <span className="text-gray-900 dark:text-white font-medium">Paste text</span>
            </button>
          </div>

          <button
            onClick={() => setIsMethodModalOpen(false)}
            className="mt-6 w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Skip
          </button>
        </Modal>

        {/* File Upload Modal */}
        <FileUploadModal 
          isOpen={isFileModalOpen}
          onClose={() => setIsFileModalOpen(false)}
        />

        {/* Text Input Modal */}
        <TextInputModal 
          isOpen={isTextModalOpen}
          onClose={() => setIsTextModalOpen(false)}
        />

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