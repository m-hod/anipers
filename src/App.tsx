import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';

import Home from './components/Home';
import { Colors } from './constants';

const App = () => {
  return (
    <>
      <StatusBar translucent backgroundColor={Colors.menuColor} />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Home />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default App;
