import axiosClient from "./axiosClient";

export const tagAPI = {
    getTags: async () => {
        const response = await axiosClient.get("tags");
        return response.data;
    },
    getTagById: async (id) => {
        const response = await axiosClient.get(`tags/${id}`);
        return response.data;
    },
    searchTags: async (keyword) => {
        const response = await axiosClient.get(`tags/search?keyword=${keyword}`);
        return response.data;
    }
};