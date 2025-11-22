import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ReportCompleteScreen from '../screens/ReportCompleteScreen';
import ReportResultScreen from '../screens/ReportResultScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ReportComplete: undefined;
  ReportResult: { 
    imageId?: string;
    analysisResult?: any;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ReportComplete" component={ReportCompleteScreen} />
        <Stack.Screen name="ReportResult" component={ReportResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
