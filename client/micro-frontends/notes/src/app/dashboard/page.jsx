'use client';

import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useNotes } from '@/context/NotesContext';
import { Button, Modal } from '@shared/components';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

export default function Dashboard() {
  const { notes, createNote, updateNote, deleteNote, loading, error } = useNotes();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
  });

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      await createNote(noteForm);
      setIsCreateModalOpen(false);
      setNoteForm({ title: '', content: '' });
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  const handleEditNote = async (e) => {
    e.preventDefault();
    try {
      await updateNote(selectedNote.id, noteForm);
      setIsEditModalOpen(false);
      setSelectedNote(null);
      setNoteForm({ title: '', content: '' });
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  const openEditModal = (note) => {
    setSelectedNote(note);
    setNoteForm({ title: note.title, content: note.content });
    setIsEditModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notes</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <FaPlus className="mr-2" /> New Note
          </Button>
        </div>

        {error && (
          <div className="p-4 text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {note.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {note.content}
                </p>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEditModal(note)}
                  >
                    <FaEdit className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <FaTrash className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Note Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Note"
        >
          <form onSubmit={handleCreateNote} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Content"
              className="w-full p-2 border rounded h-32"
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              required
            />
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Modal>

        {/* Edit Note Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Note"
        >
          <form onSubmit={handleEditNote} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Content"
              className="w-full p-2 border rounded h-32"
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              required
            />
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
} 