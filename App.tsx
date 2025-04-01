import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Import our auth provider
import {AuthProvider} from './src/context/AuthContext';

// Import our main navigator
import RootNavigator from './src/navigation/RootNavigator';

// Create a custom theme with proper font configuration
const MyTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    primary: '#38BDF8',
    background: '#161B22',
    card: '#1F2937',
    text: '#FFFFFF',
    border: '#38BDF8',
    notification: '#38BDF8',
  },
};

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />
      <AuthProvider>
        <NavigationContainer theme={MyTheme}>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
