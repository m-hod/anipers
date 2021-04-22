import AppContextProvider from './AppContextProvider';
import AppLoadingModal from './ui/modals/AppLoadingModal';
import Collections from './components/collections/Collections';
import Home from './components/home/Home';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Results from './components/search/Results';
import { RootStackParamList } from './types';
import StatusBar from './StatusBar';
import Thumbnails from './components/thumbnails/Thumbnails';
import Wallpaper from './components/wallpaper/Wallpaper';
import { createStackNavigator } from '@react-navigation/stack';

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
            <Stack.Screen name="thumbnails" component={Thumbnails} />
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
