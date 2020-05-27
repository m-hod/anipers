import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

import StatusBar from './StatusBar';
import AppLoadingModal from './ui/modals/AppLoadingModal';
import AppContextProvider from './AppContextProvider';

/* Screens */
import Home from './components/home/Home';
import Tags from './components/tags/Tags';
import Wallpaper from './components/wallpaper/Wallpaper';
import Results from './components/search/Results';
import Collections from './components/collections/Collections';

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
            <Stack.Screen name="tags" component={Tags} />
            <Stack.Screen name="wallpaper" component={Wallpaper} />
            <Stack.Screen name="results" component={Results} />
            <Stack.Screen name="collections" component={Collections} />
          </Stack.Navigator>
        </NavigationContainer>
        <AppLoadingModal />
      </AppContextProvider>
    </>
  );
};

export default App;
