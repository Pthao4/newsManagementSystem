import axiosClient from './axiosClient';

export const userAPI = {  
  getUsersAPI : async () => {
    try {
      const response = await axiosClient.get('users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  createUserAPI: async (userData) => {
    try {
      const response = await axiosClient.post("users", userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data || "Failed to create user");
      }
      throw new Error("Network error");
    }
  },

 deleteUserAPI: async (id) => {
    try {
      const response = await axiosClient.delete(`users/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        // ném lại thông điệp lỗi từ backend (vd: "Can't delete admin account")
        throw new Error(error.response.data);
      }
      throw new Error("Error deleting user");
    }
  },
};