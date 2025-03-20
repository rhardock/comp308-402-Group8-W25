'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { notesApi } from '@/services/api';

const NotesContext = createContext({});

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesApi.getNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async (noteData) => {
    try {
      const newNote = await notesApi.createNote(noteData);
      setNotes([...notes, newNote]);
      return newNote;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const updatedNote = await notesApi.updateNote(id, noteData);
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
      return updatedNote;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteNote = async (id) => {
    try {
      await notesApi.deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const uploadPDF = async (file) => {
    try {
      const result = await notesApi.uploadPDF(file);
      await fetchNotes(); // Refresh notes list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    uploadPDF,
    refreshNotes: fetchNotes,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}; 