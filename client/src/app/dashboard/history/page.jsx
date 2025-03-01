'use client';

import React, { useEffect, useState } from 'react';
import { fetchSummaries } from '@/services/api';

const SummariesList = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);  // Optional: for loading state
  const [error, setError] = useState(null);      // Optional: for error handling

  useEffect(() => {
    const getSummaries = async () => {
      const result = await fetchSummaries();
      if (result.success) {
        setSummaries(result.summaries);  // Store the summaries in state
      } else {
        setError(result.error); // Handle error
      }
      setLoading(false);  // Stop loading after the data is fetched
    };

    getSummaries();
  }, []);  // Empty dependency array to run the effect once when component mounts

  // Optional: Show loading or error states
  if (loading) {
    return <div className="alert alert-info">Loading summaries...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4">Summaries List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-separate border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b border-gray-300 text-left">Original Filename</th>
              <th className="px-4 py-2 border-b border-gray-300 text-left">Summary</th>
              <th className="px-4 py-2 border-b border-gray-300 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((summary, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b border-gray-300">{summary.originalFileName}</td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {summary.summary && summary.summary.length > 10
                   ? `${summary.summary.slice(0, 10)}...`
                   : summary.summary || 'No Summary'}
                </td>                
                <td className="px-4 py-2 border-b border-gray-300">
                {new Date(summary.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );  
};

export default SummariesList;
