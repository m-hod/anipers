import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

/* Screens */
import Home from './components/Home';
import Posts from './components/Posts';
import Post from './components/Post';

import { Colors } from './constants';
import AppLoadingModal from './ui/modals/AppLoadingModal';
import AppContextProvider from './AppContextProvider';
import AppContext from './AppContext';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <>
      <AppContextProvider>
        <StatusBar
          translucent
          backgroundColor={Colors.menuColor}
          hidden={useContext(AppContext).appLoading}
        />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="home"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="posts" component={Posts} />
            <Stack.Screen name="post" component={Post} />
          </Stack.Navigator>
        </NavigationContainer>
        <AppLoadingModal visibility={useContext(AppContext).appLoading} />
      </AppContextProvider>
    </>
  );
};

export default App;
