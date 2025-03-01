'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { uploadPdf, fetchSummaries } from '@/services/api';
import axios from 'axios';


export default function PdfUploader() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [status, setStatus] = useState(null);
  const [summary, setSummary] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); 
  const [extractedText, setExtractedText] = useState(''); 
  const [summaryId, setSummaryId] = useState(null);


  // File size constraints (in MB)
  const MIN_FILE_SIZE = 0.01; // 10KB
  const MAX_FILE_SIZE = 100; // 10MB
  const FLASK_API_URL = 'http://127.0.0.1:3003/summarize'; // New Flask endpoint

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setStatus({ message: 'Only PDF files are allowed', type: 'error' });
      setFile(null);
      return;
    }
    // Check file size constraints
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB < MIN_FILE_SIZE) {
      setStatus({ 
        message: `File too small. Minimum size is ${MIN_FILE_SIZE}MB`, 
        type: 'error' 
      });
      setFile(null);
      return;
    }
    
    if (fileSizeMB > MAX_FILE_SIZE) {
      setStatus({ 
        message: `File too large. Maximum size is ${MAX_FILE_SIZE}MB`, 
        type: 'error' 
      });
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setFileUrl(URL.createObjectURL(selectedFile)); // Temporary local preview URL
    setExtractedText(''); // Clear extracted text from previous uploads
    setSummary(''); // Clear previous summary
    setStatus(null);
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus({ message: 'Please select a PDF file', type: 'error' });
      return;
    }

    setIsUploading(true);
    setStatus({ message: 'Uploading PDF...', type: 'loading' });

    try {
      const result = await uploadPdf(file);

      if (result.success) {
        setStatus({ message: '✅ PDF processed successfully!', type: 'success' });
        setFileUrl(`http://localhost:5600${result.filePath}`);
        setSummaryId(result.summaryId);
        
      } else {
        setStatus({ message: result.error || 'Upload failed', type: 'error' });
        setFile(null); //  Reset file on failure
      }
    } catch (error) {
      setStatus({ message: '⚠️ An unexpected error occurred', type: 'error' });
      setFile(null); // Reset file on failure
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!file) {
      setStatus({ message: 'No PDF available to summarize.', type: 'error' });
      return;
    }

    setIsGenerating(true);
    setStatus({ message: 'Generating summary...', type: 'loading' });

    try {
      // Create form data to send the PDF file directly to Flask
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pages', "1-4")  //35-40 29-33
      /**const summaryResult = await generateSummary(extractedText);
         if (summaryResult.success) {
         setSummary(summaryResult.summary);
         setStatus({ message: '✅ Summary generated successfully!', type: 'success' });
         } else {
         setStatus({ message: summaryResult.error || 'Summary generation failed', type: 'error' });
         }
         } catch (error) {
         setStatus({ message: '⚠️ Error generating summary', type: 'error' });
         } finally {
         setIsGenerating(false);
         }
         };*/
      // if (summaryId) {
      //   formData.append('summaryId', summaryId);
      // }

      // Send the PDF directly to Flask
      const response = await axios.post(FLASK_API_URL, formData);
      console.log(response);
      
      if (response.status === 200) {
        setSummary("");
        setSummary(response.data.summary);
        setStatus({ message: '✅ Summary generated successfully!', type: 'success' });
      } else {
        setStatus({ message: response.data.error || 'Summary generation failed', type: 'error' });
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-gray-700 font-medium">
          Upload a PDF ({MIN_FILE_SIZE}MB - {MAX_FILE_SIZE}MB)
        </label>

        <Input 
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full"
          disabled={isUploading}
        />

        <Button 
          type="submit" 
          className="w-full flex items-center justify-center"
          disabled={!file || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload PDF'}
        </Button>

        {/* Status message */}
        {status && (
          <div className={`p-2 rounded text-center mt-2
                        ${status.type === 'success' ? 'bg-green-100 text-green-800' : ''}
                        ${status.type === 'error' ? 'bg-red-100 text-red-800' : ''}
                        ${status.type === 'loading' ? 'bg-blue-100 text-blue-800' : ''}`}>
            {status.message}
          </div>
        )}

        {/* PDF preview */}
        {fileUrl && (
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold">Uploaded PDF:</h3>
            <button 
              onClick={() => window.open(fileUrl, '_blank')}
              className="px-4 py-2 mt-2 border border-blue-500 bg-blue-500 text-white cursor-pointer text-lg rounded-md hover:bg-blue-600"
            >
              View PDF
            </button>
          </div>
        )}

        {/* Generate summary button */}
        {file && (
          <div className="flex justify-center mt-4">
            <button 
              onClick={handleGenerateSummary}
              className="px-4 py-2 border border-green-500 bg-green-500 text-white cursor-pointer text-lg rounded-md hover:bg-green-600"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Summary'}
            </button>
          </div>
        )}

        {/* Summary display */}
        {summary && (
          <div className="mt-4 p-3 border rounded bg-gray-50 text-gray-700">
            <h3 className="text-lg font-semibold">Summary:</h3>
            <p className="whitespace-pre-line">{summary}</p>
          </div>
        )}
      </form>
    </div>
  );
}
