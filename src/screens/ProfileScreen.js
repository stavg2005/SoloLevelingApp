// src/screens/ProfileScreen.js
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../context/AuthContext';

const ProfileScreen = () => {
  // Get auth context
  const {user, logout, isLoading} = useAuth();

  // State for system messages
  const [systemMessage, setSystemMessage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Show system message with animation
  const showSystemMessage = useCallback(
    message => {
      setSystemMessage(message);

      // Animate in
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setSystemMessage(null));
    },
    [fadeAnim],
  );

  // Handle logout with confirmation
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            showSystemMessage('Logging out...');
            await logout();
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* System Message */}
          {systemMessage && (
            <Animated.View style={[styles.systemMessage, {opacity: fadeAnim}]}>
              <Text style={styles.systemMessageText}>{systemMessage}</Text>
            </Animated.View>
          )}

          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Text style={styles.profileHeaderTitle}>HUNTER PROFILE</Text>
          </View>

          {/* Profile Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user?.username ? user.username.substring(0, 2).toUpperCase() : 'JS'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.username || 'John Smith'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'john.smith@example.com'}</Text>
          </View>

          {/* Account Settings */}
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Notification Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Privacy Settings</Text>
            </TouchableOpacity>
          </View>

          {/* App Settings */}
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>APP SETTINGS</Text>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Theme</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Language</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Help & Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>About</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoading}>
            <Text style={styles.logoutButtonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#161B22',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  systemMessage: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  systemMessageText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '500',
  },
  profileHeader: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  profileHeaderTitle: {
    color: '#38BDF8',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(56, 189, 248, 0.5)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 3,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    fontSize: 36,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  settingsContainer: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.3)',
    paddingBottom: 5,
  },
  settingItem: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  settingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#F87171',
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#F87171',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ProfileScreen;
