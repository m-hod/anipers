import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

/* Screens */
import Home from './components/Home';
import Posts from './components/Posts';
import Post from './components/Post';

import StatusBar from './StatusBar';
import AppLoadingModal from './ui/modals/AppLoadingModal';
import AppContextProvider from './AppContextProvider';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <>
      <AppContextProvider>
        <StatusBar />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="home"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="posts" component={Posts} />
            <Stack.Screen name="post" component={Post} />
          </Stack.Navigator>
        </NavigationContainer>
        <AppLoadingModal />
      </AppContextProvider>
    </>
  );
};

export default App;
