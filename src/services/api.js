// src/services/api.js
import axios from 'axios';
import {authService} from './authService';

// Base URL for all API calls
const API_URL = 'http://10.0.0.9:3000/api'; // For Android emulator

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add request interceptor for authorization headers
apiClient.interceptors.request.use(
  async config => {
    // Get token from storage
    const token = await authService.getToken();

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    return response.data;
  },
  async error => {
    // Handle different error statuses
    if (error.response) {
      // The request was made and server responded with an error status
      console.error('API Error Response:', error.response.data);

      // Handle authentication errors
      if (error.response.status === 401) {
        // Token is expired or invalid
        // Clear stored credentials to force re-login
        await authService.logout();
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Request Error:', error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
