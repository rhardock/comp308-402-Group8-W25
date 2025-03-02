'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateSummary, uploadPdf } from '@/services/api';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [status, setStatus] = useState(null);
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryId, setSummaryId] = useState(null);
  const [pageRange, setPageRange] = useState('1-5');

  const MIN_FILE_SIZE = 0.01;
  const MAX_FILE_SIZE = 100;
  const FLASK_API_URL = 'http://127.0.0.1:3003/summarize';

  const handleFileChange = useCallback(async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // File validation logic remains the same
    if (selectedFile.type !== 'application/pdf') {
      setStatus({ message: 'Only PDF files are allowed', type: 'error' });
      setFile(null);
      return;
    }

    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB < MIN_FILE_SIZE || fileSizeMB > MAX_FILE_SIZE) {
      setStatus({ 
        message: `File size must be between ${MIN_FILE_SIZE}MB and ${MAX_FILE_SIZE}MB`, 
        type: 'error' 
      });
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setFileUrl(URL.createObjectURL(selectedFile));
    setSummary('');
    setSummaryId(null);
    setStatus({ message: 'PDF selected', type: 'success' });

    try {
      const uploadResult = await uploadPdf(selectedFile);
      if (uploadResult.success) {
        setFileUrl(uploadResult.filePath);
        setSummaryId(uploadResult.summaryId);
        setStatus({ message: 'PDF ready for summarization', type: 'success' });
      } else {
        setStatus({ message: 'Upload failed: ' + uploadResult.error, type: 'error' });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus({ message: 'Upload failed: ' + error.message, type: 'error' });
    }
  }, []);

  const handleGenerateSummary = async () => {
    // Summary generation logic remains the same
    if (!file) {
      setStatus({ message: 'No PDF available to summarize.', type: 'error' });
      return;
    }

    setIsGenerating(true);
    setStatus({ message: 'Generating summary...', type: 'loading' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pages', pageRange);

      const response = await axios.post(FLASK_API_URL, formData);
      
      if (response.status === 200) {
        const generatedSummary = response.data.summary;
        setSummary(generatedSummary);
        setStatus({ message: '✅ Summary generated successfully!', type: 'success' });

        if (summaryId) {
          const updateResult = await updateSummary(summaryId, generatedSummary);
          if (!updateResult.success) {
            console.error('Error updating summary in MongoDB:', updateResult.error);
          }
        }
      }
    } catch (error) {
      console.error('Summary generation error:', error);
      setStatus({ 
        message: `⚠️ ${error.response?.data?.error || 'Error generating summary'}`, 
        type: 'error' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Create New Summary
          </h2>

          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select a PDF ({MIN_FILE_SIZE}MB - {MAX_FILE_SIZE}MB)
              </label>
              <Input 
                type="file" 
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>

            {/* Status Message */}
            {status && (
              <div className={`p-4 rounded-lg ${
                status.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                status.type === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {status.message}
              </div>
            )}

            {/* Page Range Selection */}
            {file && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Page Range (Max 5 Pages):
                </label>
                <select 
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                >
                  <option value="1-5">Pages 1-5</option>
                  <option value="6-10">Pages 6-10</option>
                  <option value="11-15">Pages 11-15</option>
                  <option value="16-20">Pages 16-20</option>
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {fileUrl && (
                <Button 
                  onClick={() => window.open(fileUrl, '_blank')}
                  variant="outline"
                >
                  View PDF
                </Button>
              )}
              {file && (
                <Button
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? 'Generating...' : 'Generate Summary'}
                </Button>
              )}
            </div>

            {/* Summary Display */}
            {summary && (
              <div className="mt-6 p-6 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Generated Summary
                </h3>
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                  {summary}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 