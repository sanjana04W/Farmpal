// FarmPal - Egg Farm Management App
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from './src/constants/theme';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import EggProductionScreen from './src/screens/EggProductionScreen';
import FeedConsumptionScreen from './src/screens/FeedConsumptionScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import NotesScreen from './src/screens/NotesScreen';
import AccessControlScreen from './src/screens/AccessControlScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

// Navigator component that handles auth state
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.darkBrown} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        // Auth screens
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // App screens
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="EggProduction" component={EggProductionScreen} />
          <Stack.Screen name="FeedConsumption" component={FeedConsumptionScreen} />
          <Stack.Screen name="Expenses" component={ExpensesScreen} />
          <Stack.Screen name="Notes" component={NotesScreen} />
          <Stack.Screen name="AccessControl" component={AccessControlScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gradientTop,
  },
});
