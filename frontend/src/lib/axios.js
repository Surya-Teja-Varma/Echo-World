import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized (401) error. Logging out.");
      try {
        await axios.post("/api/auth/logout");
        window.location.href = "/login";
      } catch (logoutError) {
        console.error("Failed to log out:", logoutError);
      }
    }
    return Promise.reject(error);
  }
);