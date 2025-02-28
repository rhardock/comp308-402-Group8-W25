import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5600/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },
}; 
export const uploadPdf = async (file) => {
  try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
          success: response.data.success,
          filePath: response.data.filePath, // Path to stored PDF
          extractedText: response.data.extractedText,
      };
  } catch (error) {
      return { success: false, error: error.message };
  }
};
/*
export const generateSummary = async (text) => {
  try {
      const response = await axios.post(`${API_URL}/generate-summary`, { text });

      return {
          success: response.data.success,
          summary: response.data.summary,
      };
  } catch (error) {
      return { success: false, error: error.message };
  }
};

// 🔹 Fetch Extracted Text by Summary ID
export const fetchExtractedText = async (summaryId) => {
  try {
      const response = await api.get(`/summary/${summaryId}`);
      return {
          success: response.data.success,
          extractedText: response.data.extractedText,
      };
  } catch (error) {
      return { success: false, error: error.message };
  }
};*/
export const fetchSummaries = async () => {
  try {
      const response = await axios.get(`${API_URL}/summaries`);
      return {
          success: response.data.success,
          summaries: response.data.summaries,
      };
  } catch (error) {
      return { success: false, error: error.message };
  }
};