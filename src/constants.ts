import { StatusBar, Platform, Dimensions } from 'react-native';
import { MappedTagCategories } from './types';

export const statusBarHeight =
  Platform.OS === 'android' && StatusBar.currentHeight
    ? StatusBar.currentHeight
    : 25;

export const menuBarHeight = 50;

export const Colors = {
  menuColor: 'rgba(76, 76, 76, 0.75)',
  iconColor: '#FFFFFF',
};

export const pageContainer = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};

export const CategoryIDs: MappedTagCategories = {
  general: 0,
  artist: 1,
  copyright: 3,
  character: 4,
};
