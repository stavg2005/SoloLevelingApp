// src/navigation/AppNavigator.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Import screens
import StatusScreen from '../screens/StatusScreen';
import DungeonScreen from '../screens/DungeonScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
// Placeholder components for screens we haven't created yet

const HomeScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Home Screen</Text>
    <Text style={styles.placeholderSubtext}>
      Your daily progress will appear here
    </Text>
  </View>
);

const SkillsScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Skills Screen</Text>
    <Text style={styles.placeholderSubtext}>
      Your skills and achievements will appear here
    </Text>
  </View>
);

const Tab = createBottomTabNavigator();

const TabIcon = ({name, focused}) => {
  let icon = '🏠';

  switch (name) {
    case 'Home':
      icon = '🏠';
      break;
    case 'Dungeons':
      icon = '⚔️';
      break;
    case 'Status':
      icon = '👤';
      break;
    case 'Skills':
      icon = '📊';
      break;
  }

  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Text style={[styles.tabIconText, focused && styles.tabIconTextActive]}>
        {icon}
      </Text>
    </View>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused}) => (
          <TabIcon name={route.name} focused={focused} />
        ),
      })}>
      <Tab.Screen name="Home" component={RegisterScreen} />
      <Tab.Screen name="Dungeons" component={DungeonScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Skills" component={LoginScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1F2937',
    borderTopWidth: 0,
    height: 60,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  tabIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 2,
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  tabIconText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  tabIconTextActive: {
    color: '#38BDF8',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#161B22',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: '#38BDF8',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  placeholderSubtext: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AppNavigator;
