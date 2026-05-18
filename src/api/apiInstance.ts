import axios from "axios";
import { navigateGlobal } from "~/App";

import { logoutGlobal } from "~/context/logoutHandler";
const handleLogout = () => {
  logoutGlobal();

  if (navigateGlobal) {
    navigateGlobal("/login");
  }
};

const apiInstance = axios.create({
 baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("okr_auth");

    if (stored) {
      const { token } = JSON.parse(stored);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.response?.data?.statusCode === 401) {
      handleLogout();
    }

    return Promise.reject(error);
  }
);

export default apiInstance;