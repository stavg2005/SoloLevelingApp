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
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../context/AuthContext';

const LoginScreen = ({navigation}) => {
  // State declarations
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [systemMessage, setSystemMessage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Get auth context
  const {login, isLoading, error} = useAuth();

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

    try {
      showSystemMessage('Logging in...');
      await login(username, password);
      // No need to navigate here - RootNavigator will handle it automatically
    } catch (err) {
      console.error('Login error:', err);
      showSystemMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  // Show error from auth context if it exists
  useEffect(() => {
    if (error) {
      showSystemMessage(error);
    }
  }, [error, showSystemMessage]);

  // Welcome message when screen loads
  useEffect(() => {
    const timer = setTimeout(() => {
      showSystemMessage('Welcome, Hunter! Please login.');
    }, 1000);

    return () => clearTimeout(timer);
  }, [showSystemMessage]);

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
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>SL</Text>
            </View>
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
                editable={!isLoading}
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
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}
                disabled={isLoading}>
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
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}>
              {isLoading ? (
                <ActivityIndicator color="#192130" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>LOGIN</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
              disabled={isLoading}>
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
              disabled={isLoading}
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
  loginButtonDisabled: {
    opacity: 0.7,
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
