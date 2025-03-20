import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const notesApi = {
  getNotes: async () => {
    try {
      const response = await api.get('/notes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notes');
    }
  },

  getNote: async (id) => {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch note');
    }
  },

  createNote: async (noteData) => {
    try {
      const response = await api.post('/notes', noteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create note');
    }
  },

  updateNote: async (id, noteData) => {
    try {
      const response = await api.put(`/notes/${id}`, noteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update note');
    }
  },

  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/notes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete note');
    }
  },

  uploadPDF: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/notes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload PDF');
    }
  },

  getSummary: async (noteId) => {
    try {
      const response = await api.get(`/notes/${noteId}/summary`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get summary');
    }
  },
}; 