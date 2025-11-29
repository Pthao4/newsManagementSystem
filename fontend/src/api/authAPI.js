import axiosClient from "./axiosClient";

const login = async (email, password) => {
  const response = await axiosClient.post("auth/login", {
    email,
    password,
  });

  if (response.status !== 200) {
    throw new Error("Failed to login");
  }
  const data = response.data;

  if (data.token) {
    localStorage.setItem("token", data.token)
  }

  return response.data;
};

const logout = async () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
}

// const getCurrentUser = async () => {
//   const response = await axiosClient.get("auth/getCurrentUser");
//   if (response.status !== 200) {
//     throw new Error("Failed to fetch current user");
//   }
//   return response.data;
// }

const register = async ({name, email, password, role}) => {
  try {
    const response = await axiosClient.post("auth/register", {
      name,
      email,
      password,
      role,
    });
    if (response.status !== 200) {
      throw new Error("Failed to register");
    }
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const authAPI = { login, logout, register };