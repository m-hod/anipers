import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { statusBarHeight, Colors, menuBarHeight } from '../constants';

function TopNav() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Icon name="menu" size={32} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="search" size={32} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

export default TopNav;

const styles = StyleSheet.create({
  container: {
    height: menuBarHeight * 1.5 + statusBarHeight,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingRight: 25,
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
  },
  icon: {
    color: Colors.iconColor,
  },
});
