import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
    timeout: 5000, // 5 seconds timeout
    withCredentials: true, // Include cookies in requests
    responseType: 'json',
    responseEncoding: 'utf8',
    validateStatus: function (status) {
        return status >= 200 && status < 300; // Resolve only if the status code is less than 300
    },
});
// INTERCEPTOR CHO REQUEST (thêm token)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR CHO RESPONSE (xử lý lỗi 401, 403)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const currentPath = window.location.pathname;
    const status = error?.response?.status;

    if (status === 401 && !currentPath.startsWith("/login")) {
      console.warn("Unauthorized — redirecting to /login");
      localStorage.removeItem("token");
      window.location.replace("/login")
    } else if (status === 403 && !currentPath.startsWith("/forbidden")) {
      console.warn("Forbidden — redirecting to /forbidden");
      window.location.replace("/forbidden");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;