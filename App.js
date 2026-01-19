import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';

// Screens
import SignInScreen from './src/screens/SignInScreen';
import ListsScreen from './src/screens/ListsScreen';
import TaskListDetailScreen from './src/screens/TaskListDetailScreen';
import TaskRunnerScreen from './src/screens/TaskRunnerScreen';
import CreateListScreen from './src/screens/CreateListScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <TaskProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SignIn"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="Lists" component={ListsScreen} />
              <Stack.Screen name="CreateList" component={CreateListScreen} />
              <Stack.Screen name="TaskListDetail" component={TaskListDetailScreen} />
              <Stack.Screen name="TaskRunner" component={TaskRunnerScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </TaskProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
