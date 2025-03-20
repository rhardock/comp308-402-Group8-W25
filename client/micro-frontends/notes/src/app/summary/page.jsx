'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { useNotes } from '@/context/NotesContext';
import { notesApi } from '@/services/api';

export default function Summary() {
  const { notes } = useNotes();
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummaries = async () => {
      setLoading(true);
      try {
        const summaryPromises = notes.map(note => notesApi.getSummary(note.id));
        const results = await Promise.all(summaryPromises);
        const summaryMap = {};
        notes.forEach((note, index) => {
          summaryMap[note.id] = results[index];
        });
        setSummaries(summaryMap);
      } catch (error) {
        console.error('Failed to fetch summaries:', error);
      } finally {
        setLoading(false);
      }
    };

    if (notes.length > 0) {
      fetchSummaries();
    }
  }, [notes]);

  const stats = {
    totalNotes: notes.length,
    averageLength: notes.length > 0
      ? Math.round(notes.reduce((acc, note) => acc + note.content.length, 0) / notes.length)
      : 0,
    shortestNote: notes.length > 0
      ? Math.min(...notes.map(note => note.content.length))
      : 0,
    longestNote: notes.length > 0
      ? Math.max(...notes.map(note => note.content.length))
      : 0,
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notes Summary
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Notes" value={stats.totalNotes} />
          <StatCard title="Average Length" value={`${stats.averageLength} chars`} />
          <StatCard title="Shortest Note" value={`${stats.shortestNote} chars`} />
          <StatCard title="Longest Note" value={`${stats.longestNote} chars`} />
        </div>

        {/* Note Summaries */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Note Summaries
          </h2>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {note.title}
                  </h3>
                  <div className="text-gray-600 dark:text-gray-300">
                    <p className="mb-2">
                      <span className="font-medium">Length:</span> {note.content.length} characters
                    </p>
                    {summaries[note.id] && (
                      <p>
                        <span className="font-medium">Summary:</span> {summaries[note.id]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
} 