import { StatusBar, Platform, Dimensions } from 'react-native';
import { MappedTagCategories } from './types';

export const statusBarHeight =
  Platform.OS === 'android' && StatusBar.currentHeight
    ? StatusBar.currentHeight
    : 25;

export const menuBarHeight = 50;

export const Colors = {
  menuColor: 'rgba(76, 76, 76, 0.75)',
  menuColorDark: 'rgba(0, 0, 0, 0.5)',
  iconColor: 'rgba(255, 255, 255, 0.5)',
  iconColorActive: '#FFFFFF',
  titleColor: '#FFFFFF',
};

export const Fonts = {
  titleFont: {
    color: Colors.titleColor,
    fontWeight: 'bold',
    fontSize: 48,
  },
  subTitleFont: {
    color: Colors.titleColor,
    fontWeight: 'bold',
    fontSize: 32,
  },
};

export const Layout = {
  containerOverlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pageContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
};

export const WindowHeight = Dimensions.get('window').height;
export const WindowWidth = Dimensions.get('window').width;

export const CategoryIDs: MappedTagCategories = {
  general: 0,
  artist: 1,
  copyright: 3,
  character: 4,
};

export const filteredTags = new Set(['banned_artist']);

export const supportedFormats = new Set(['jpg', 'png']);
