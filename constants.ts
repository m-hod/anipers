import { StatusBar, Platform } from 'react-native';

export const statusBarHeight =
  Platform.OS === 'android' && StatusBar.currentHeight
    ? StatusBar.currentHeight
    : 25;

export const Colors = {
  menuColor: 'rgba(76, 76, 76, 0.75)',
  iconColor: '#FFFFFF',
};
