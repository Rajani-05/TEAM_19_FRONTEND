import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let token = null;
let logoutCallback = null;

export const setAuthToken = (newToken) => {
  token = newToken;
};

export const registerLogoutCallback = (callback) => {
  logoutCallback = callback;
};

axiosClient.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      setAuthToken(null);
      if (logoutCallback) {
        logoutCallback();
      }
      // Force page redirection to login on unauthorized access, except for public client views
      if (!window.location.pathname.startsWith('/client-view')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
