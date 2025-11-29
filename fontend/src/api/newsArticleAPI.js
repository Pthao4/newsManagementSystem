import axiosClient from "./axiosClient";

const getNewsArticles = async () => {
  try {
    const response = await axiosClient.get('newsArticles');
    console.log('Fetched news articles:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return [];
  }
};

const getNewsArticleById = async (id) => {
  try {
    const response = await axiosClient.get(`newsArticles/${id}`);
    console.log(`Fetched news article with id ${id}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching news article:', error);
    return null;
  }
};

const createNewsArticle = async (articleData) => {
  try {
    const response = await axiosClient.post('newsArticles', articleData);
    console.log('Created news article:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating news article:', error);
    return null;
  }
};

const updateNewsArticle = async (id, articleData) => {
  try {
    console.log(`Updating news article with id ${id}:`, articleData);
    articleData.id = Number(id); // Ensure the id is included in the data
    const response = await axiosClient.put(`newsArticles/${id}`, articleData);
    console.log(`Updated news article with id ${id}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating news article:', error);
    return null;
  }
};

const deleteNewsArticle = async (id) => {
  try {
    const response = await axiosClient.delete(`newsArticles/${id}`);
    if (response.status === 204) {
      console.log(`Deleted news article with id ${id}`);
      return true;
    } else {
      console.error(`Failed to delete news article with id ${id}:`, response);
      return false;
    }
  } catch (error) {
    console.error('Error deleting news article:', error);
    return false;
  }
}


export const newsArticleAPI = { getNewsArticles, getNewsArticleById, createNewsArticle, updateNewsArticle, deleteNewsArticle };

