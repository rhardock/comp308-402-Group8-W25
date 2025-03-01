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
    const token = localStorage.getItem('token'); // Get JWT token from local storage

    if (!token) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await axios.post(`${API_URL}/summary/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data',
                 'Authorization': `Bearer ${token}`       // Send JWT token in header
               },
    });

    return {
      success: response.data.success,
      filePath: response.data.filePath, // Path to stored PDF
      extractedText: response.data.extractedText,
      summaryId: response.data.summaryId,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const generatedSummary = async (text) => {
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
};

export const fetchSummaries = async () => {
  console.log('fetchSummaries');
  try {
    const token = localStorage.getItem('token'); // Get JWT token from local storage

    if (!token) {
      return { success: false, error: 'User not authenticated' };
    }

    const response = await axios.get(`${API_URL}/summary/summaries`, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Send JWT token in header
      },
    });
    return {
      success: response.data.success,
      summaries: response.data.summaries,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
export const updateSummary = async (summaryId, summary) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { success: false, error: 'User not authenticated' };
    }

    console.log("🔍 Updating summary in MongoDB", { summaryId, summary });

    const response = await axios.post(`${API_URL}/summary/update-summary`, 
      { summaryId, summary }, // ✅ Ensure summary is sent correctly
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.data.success) {
      console.log('✅ Summary updated in MongoDB:', response.data.summary);
    } else {
      console.error('🚨 Error updating summary in MongoDB:', response.data.error);
    }

    return {
      success: response.data.success,
      summary: response.data.summary
    };
  } catch (error) {
    console.error('🚨 Error in updateSummary:', error.message);
    return { success: false, error: error.message };
  }
};
