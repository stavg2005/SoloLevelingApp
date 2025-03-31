// src/screens/LoginScreen.js
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, // Add this for loading state
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {userApi} from '../services/userApi';

const LoginScreen = ({navigation}) => {
  // State declarations
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [systemMessage, setSystemMessage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(false);

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

  // Handle login
  const handleLogin = async () => {
    if (!username || !password) {
      showSystemMessage('Please enter both username and password');
      return;
    }

    setLoading(true);
    showSystemMessage('Logging in...');

    try {
      // Call the API
      const userData = await userApi.login({username, password});

      showSystemMessage('Login successful!');
      navigation.replace('MainApp');
    } catch (error) {
      console.error('Login error:', error);
      showSystemMessage('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Welcome message when screen loads - add dependency array to run only once
  useEffect(() => {
    const timer = setTimeout(() => {
      showSystemMessage('Welcome, Hunter! Please login.');
    }, 1000);

    return () => clearTimeout(timer);
  }, [showSystemMessage]); // Empty dependency array makes it run only once on mount

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Navigate to registration screen
  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    showSystemMessage('Password reset feature coming soon');
  };

  // Dismiss keyboard when tapping outside
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <SafeAreaView style={styles.safeArea}>
          {/* System Message */}
          {systemMessage && (
            <Animated.View style={[styles.systemMessage, {opacity: fadeAnim}]}>
              <Text style={styles.systemMessageText}>{systemMessage}</Text>
            </Animated.View>
          )}

          {/* Logo & App Title */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../utils/Logo.png')}
              style={styles.logoImage}
            />
            <Text style={styles.appTitle}>SOLO LEVELING</Text>
            <Text style={styles.appSubtitle}>FITNESS APP</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}>
                <View style={styles.eyeIconContainer}>
                  <Text style={styles.eyeIcon}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#192130" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>LOGIN</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerTextContainer}>
                <Text style={styles.dividerText}>OR</Text>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={navigateToRegister}
              activeOpacity={0.8}>
              <Text style={styles.registerButtonText}>REGISTER</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161B22',
  },
  logoImage: {
    width: 120, // Adjust size as needed
    height: 120, // Adjust size as needed
    marginBottom: 20,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  systemMessage: {
    position: 'absolute',
    top: 20,
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
  formContainer: {
    width: '100%',
    maxWidth: 350,
  },
  inputContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 16,
    padding: 15,
    height: 60,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 10,
  },
  eyeIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 16,
    color: '#38BDF8',
  },
  loginButton: {
    backgroundColor: '#38BDF8',
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonText: {
    color: '#192130',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#38BDF8',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(56, 189, 248, 0.3)',
  },
  dividerTextContainer: {
    paddingHorizontal: 15,
  },
  dividerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default LoginScreen;
