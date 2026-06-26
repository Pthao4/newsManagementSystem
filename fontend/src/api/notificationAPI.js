import axiosClient from "./axiosClient";

const getNotifications = async () => {
  try {
    const response = await axiosClient.get("notifications");
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

const markAsRead = async (id) => {
  try {
    await axiosClient.put(`notifications/${id}/read`);
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

export const notificationAPI = {
  getNotifications,
  markAsRead,
};
