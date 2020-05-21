import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import IconButton from '../../ui/components/IconButton';
import { Colors, menuBarHeight } from '../../constants';

function BottomNav() {
  return (
    <>
      <View style={styles.container}>
        {/* <IconButton icon="save" />
        <IconButton icon="slideshow" />
        <IconButton icon="wallpaper" /> */}
      </View>
    </>
  );
}

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    height: menuBarHeight,
    width: Dimensions.get('window').width,
    backgroundColor: Colors.menuColor,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
  icon: {
    color: Colors.iconColor,
  },
});
