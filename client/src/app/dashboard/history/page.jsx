'use client';

import React, { useEffect, useState } from 'react';
import { fetchSummaries } from '@/services/api';

const SummariesList = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const getSummaries = async () => {
      const result = await fetchSummaries();
      if (result.success) {
        setSummaries(result.summaries);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    getSummaries();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSummaries = [...summaries].sort((a, b) => {
    if (sortField === 'createdAt') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    
    const valueA = a[sortField]?.toLowerCase() || '';
    const valueB = b[sortField]?.toLowerCase() || '';
    
    if (sortDirection === 'asc') {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  const viewSummary = (summary) => {
    setSelectedSummary(summary);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSummary(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
           </div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
             Error: {error}
           </div>;
  }

  return (
    <div className="container mx-auto mt-6 px-4">
      <h2 className="text-2xl font-semibold mb-4">Summaries History</h2>
      
      {summaries.length === 0 ? (
        <div className="bg-gray-50 p-6 text-center rounded">
          <p className="text-gray-600">No summaries found. Create a summary to see it here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th 
                  className="px-4 py-3 border-b border-gray-300 text-left font-medium text-gray-700 cursor-pointer"
                  onClick={() => handleSort('originalFileName')}
                >
                  Original Filename
                  {sortField === 'originalFileName' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-4 py-3 border-b border-gray-300 text-left font-medium text-gray-700">
                  Summary
                </th>
                <th 
                  className="px-4 py-3 border-b border-gray-300 text-left font-medium text-gray-700 cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Created At
                  {sortField === 'createdAt' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-4 py-3 border-b border-gray-300 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSummaries.map((summary, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-300">{summary.originalFileName}</td>
                  <td className="px-4 py-3 border-b border-gray-300">
                    {summary.summary && summary.summary.length > 100
                     ? `${summary.summary.slice(0, 100)}...`
                     : summary.summary || 'No Summary'}
                  </td>                
                  <td className="px-4 py-3 border-b border-gray-300">
                    {formatDate(summary.createdAt)}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-300">
                    <button 
                      onClick={() => viewSummary(summary)}
                      className="text-blue-600 hover:text-blue-800 mr-2 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing full summary */}
      {showModal && selectedSummary && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">
                {selectedSummary.originalFileName}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Created: {formatDate(selectedSummary.createdAt)}
              </p>
            </div>
            <div className="border rounded p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Summary:</h4>
              <p className="whitespace-pre-line">
                {selectedSummary.summary || 'No summary content available.'}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
};

export default SummariesList;
