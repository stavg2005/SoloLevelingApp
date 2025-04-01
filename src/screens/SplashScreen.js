// src/screens/SplashScreen.js
import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>SL</Text>
        </View>
        <Text style={styles.appTitle}>SOLO LEVELING</Text>
        <Text style={styles.appSubtitle}>FITNESS APP</Text>
      </View>

      <ActivityIndicator size="large" color="#38BDF8" style={styles.loader} />

      <Text style={styles.loadingText}>Checking for saved session...</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161B22',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 3,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontSize: 48,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#38BDF8',
    marginTop: 5,
  },
  loader: {
    marginVertical: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SplashScreen;
