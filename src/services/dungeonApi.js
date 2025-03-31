// src/services/dungeonApi.js
import apiClient from './api';

export const dungeonApi = {
  // Get available dungeons
  getAvailableDungeons(userId) {
    return apiClient.get(`/dungeons/available/${userId}`);
  },
  
  // Complete dungeon
  completeDungeon(completionData) {
    return apiClient.post('/dungeons/complete', completionData);
  },
  
  // Get dungeon details
  getDungeonDetails(dungeonId) {
    return apiClient.get(`/dungeons/details/${dungeonId}`);
  }
};