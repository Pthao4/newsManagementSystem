import axios from "axios";

// Using the same instance or base URL as your existing APIs
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/files`; // Adjust if you have a configured axios instance

// Helper function to get token if needed
const getToken = () => localStorage.getItem("token");

export const fileAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      },
    });
    return response.data; // Expected { url: "...", fileName: "..." }
  },

  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      },
    });
    return response.data;
  }
};
