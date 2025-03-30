/**
 * Solo Leveling Fitness App
 */

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Import our main navigator
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: '#38BDF8',
            background: '#161B22',
            card: '#1F2937',
            text: '#FFFFFF',
            border: '#38BDF8',
            notification: '#38BDF8',
          },
        }}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
