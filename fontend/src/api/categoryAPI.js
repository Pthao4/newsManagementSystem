import axiosClient from "./axiosClient";

const getCategories = async () => {
  // const response = await fetch("/api/categories");
  const response = await axiosClient.get("categories");
  console.log("getCategories response:", response.data);
  return response.data;
}

const getCategoryById = async (id) => {
  // const response = await fetch(`/api/categories/${id}`);
  const response = await axiosClient.get(`categories/${id}`);
  return response.data;
}

const createCategory = async (category) => {
  const response = await axiosClient.post("categories", category);
  return response.data;
}

const updateCategory = async (id, category) => {
  const response = await axiosClient.put(`categories/${id}`, category);
  console.log("Category updated successfully in updateCategory API:", response);
  return response.data;
}

const deleteCategory = async (id) => {
  const response = await axiosClient.delete(`categories/${id}`);
  return response.data;
}

const categoryAPI = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };

export { categoryAPI };

