import axiosClient from "./axiosClient";

export const profileAPI = {
  getProfile: async () => {
    const res = await axiosClient.get("/profile");
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await axiosClient.put("/profile", profileData);
    return res.data;
  },

  getHistory: async () => {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get("/profile/history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
