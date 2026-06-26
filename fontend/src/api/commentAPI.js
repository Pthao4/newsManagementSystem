import axiosClient from "./axiosClient";

const getCommentsByArticle = async (articleId) => {
  try {
    const response = await axiosClient.get(`comments/article/${articleId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

const createComment = async (newsArticleId, content, parentId = null) => {
  const response = await axiosClient.post("comments", {
    newsArticleId,
    content,
    parentId,
  });
  return response.data;
};

const updateComment = async (commentId, content) => {
  const response = await axiosClient.put(`comments/${commentId}`, {
    content,
  });
  return response.data;
};

const deleteComment = async (commentId) => {
  await axiosClient.delete(`comments/${commentId}`);
  return true;
};

export const commentAPI = {
  getCommentsByArticle,
  createComment,
  updateComment,
  deleteComment,
};
