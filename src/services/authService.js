// src/services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = '@SoloLeveling:token';
export const USER_KEY = '@SoloLeveling:user';

export const authService = {
  async setToken(token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async removeToken() {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async setUser(user) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser() {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  async removeUser() {
    await AsyncStorage.removeItem(USER_KEY);
  },

  async logout() {
    await Promise.all([
      this.removeToken(),
      this.removeUser(),
    ]);
  },
};
