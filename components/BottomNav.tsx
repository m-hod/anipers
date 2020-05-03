import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import IconButton from './IconButton';

function BottomNav() {
  return (
    <>
      <View style={styles.container}>
        <IconButton icon="save" />
        <IconButton icon="slideshow" />
        <IconButton icon="wallpaper" />
      </View>
    </>
  );
}

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(76, 76, 76, 0.75)',

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
  icon: {
    color: '#FFFFFF',
  },
});
