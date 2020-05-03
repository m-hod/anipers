import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';

import Home from './components/Home';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Home />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default App;
