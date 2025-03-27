import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  config.baseURL = BASE_URL;
  config.headers["Content-Type"] = "application/json";
  config.withCredentials = true;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (error.response.status === 401) {
    // Cookies.remove("userToken");
    // window.location.href = "/login";
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
