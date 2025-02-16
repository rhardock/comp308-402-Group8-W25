import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5600/api';

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
            summary: response.data.summary,
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
