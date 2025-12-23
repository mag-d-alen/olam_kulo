import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { sessionManager } from './session';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = sessionManager.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      sessionManager.clearSession();
    }
    return Promise.reject(error);
  }
);
