import React from 'react';
import { View, StyleSheet, LogBox, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StackNavigator from './src/navigation/StackNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';

// Ignore specific warnings in dev (LogBox is stripped from production bundles)
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed',
  'AsyncStorage has been extracted',
]);

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

function AppContent() {
  const { loading } = useAuth();
  const { isDark } = useTheme();

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<any>(undefined);

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        if (savedStateString) {
          const state = JSON.parse(savedStateString);
          // Basic validation: navigation state must be an object with a 'routes' array
          if (state && typeof state === 'object' && Array.isArray(state.routes)) {
            setInitialState(state);
          } else {
            // Invalid state shape — clear it so it doesn't corrupt future launches
            await AsyncStorage.removeItem(PERSISTENCE_KEY);
          }
        }
      } catch (e) {
        // JSON parse failed or AsyncStorage read failed — clear corrupted state
        try {
          await AsyncStorage.removeItem(PERSISTENCE_KEY);
        } catch (_) {
          // Ignore cleanup errors
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (loading || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E7C86" />
      </View>
    );
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) => {
        if (state) {
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state)).catch(() => {
            // Silently ignore save failures — not critical
          });
        }
      }}
    >
      <StackNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
