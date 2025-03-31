// src/services/userApi.js
import apiClient from './api';

export const userApi = {
  // Get user profile
  getUserProfile(userId) {
    return apiClient.get(`/users/profile/${userId}`);
  },
  
  // Login user
  login(credentials) {
    return apiClient.post('/users/login', credentials);
  },
  
  // Register user
  register(userData) {
    return apiClient.post('/users/register', userData);
  },
  
  // Update user profile
  updateProfile(userId, profileData) {
    return apiClient.put(`/users/profile/${userId}`, profileData);
  }
};