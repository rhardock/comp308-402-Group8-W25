'use client'

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { uploadPdf } from './pdf-upload-action';

export default function PdfUploader() {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
    const [status, setStatus] = useState(null);
    const [summary, setSummary] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = useCallback((e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            setStatus({ message: 'Only PDF files are allowed', type: 'error' });
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setStatus(null);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setStatus({ message: 'Please select a PDF file', type: 'error' });
            return;
        }

        setIsUploading(true);
        setStatus({ message: 'Uploading and processing...', type: 'loading' });

        try {
            const result = await uploadPdf(file);

            if (result.success) {
                setStatus({ message: '✅ PDF processed successfully!', type: 'success' });
                setFileUrl(`http://localhost:5600${result.filePath}`);
                setSummary(result.summary);
            } else {
                setStatus({ message: result.error || 'Upload failed', type: 'error' });
            }
        } catch (error) {
            setStatus({ message: '⚠️ An unexpected error occurred', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-gray-700 font-medium">Upload a PDF</label>
                
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
                    {isUploading ? 'Processing...' : 'Upload PDF'}
                </Button>

                {status && (
                    <div className={`p-2 rounded text-center mt-2
                        ${status.type === 'success' ? 'bg-green-100 text-green-800' : ''}
                        ${status.type === 'error' ? 'bg-red-100 text-red-800' : ''}
                        ${status.type === 'loading' ? 'bg-blue-100 text-blue-800' : ''}`}>
                        {status.message}
                    </div>
                )}

                {fileUrl && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Uploaded PDF:</h3>
                        <a href={fileUrl} target="_blank" className="text-blue-500 underline">View PDF</a>
                    </div>
                )}

                {summary && (
                    <div className="mt-4 p-3 border rounded bg-gray-50 text-gray-700">
                        <h3 className="text-lg font-semibold">Summary:</h3>
                        <p>{summary}</p>
                    </div>
                )}
            </form>
        </div>
    );
}
