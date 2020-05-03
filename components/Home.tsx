import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import Wallpaper from './Wallpaper';
import BottomNav from './BottomNav';
import TopNav from './TopNav';

function Home() {
  const [query, setQuery] = useState('');

  return (
    <View>
      <TopNav />
      {/* <TextInput
        value={query}
        onChangeText={(e) => {
          setQuery(e);
        }}
      />
      <Button title="Search" onPress={() => {}} /> */}
      <Wallpaper query={query} />
      <BottomNav />
    </View>
  );
}

export default Home;
