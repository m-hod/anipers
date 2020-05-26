import {
  StatusBar,
  Platform,
  Dimensions,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { MappedTagCategories } from './types';
import RNFS from 'react-native-fs';

export const WindowHeight = Dimensions.get('window').height;
export const WindowWidth = Dimensions.get('window').width;
export const statusBarHeight =
  Platform.OS === 'android' && StatusBar.currentHeight
    ? StatusBar.currentHeight
    : 25;
export const menuBarHeight = 50;
export const iconSize = 32;

export const Colors: { [key: string]: string } = {
  menuColor: 'rgba(76, 76, 76, 0.75)',
  menuColorDark: 'rgba(0, 0, 0, 0.5)',
  iconColor: 'rgba(255, 255, 255, 0.5)',
  iconColorActive: '#FFFFFF',
  iconColorInactive: 'rgba(255, 255, 255, 0.5)',
  titleColor: '#FFFFFF',
  background: 'rgb(32, 32, 32)',
  modalPopover: 'rgba(0, 0, 0, 0.05)',
};

export const Fonts: { [key: string]: TextStyle } = {
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
  altTitleFont: {
    color: Colors.titleColor,
    fontWeight: 'bold',
    fontSize: 20,
  },
  regular: {
    color: Colors.titleColor,
    fontSize: 18,
  },
};

export const Layout: { [key: string]: ViewStyle } = {
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

export const CategoryIDs: MappedTagCategories = {
  general: 0,
  artist: 1,
  copyright: 3,
  character: 4,
};

export const filteredTags = new Set(['banned_artist', 'greyscale', '4koma']);

export const supportedFormats = new Set(['jpg', 'png']);

export const wallpapersDirectoryPath = `${RNFS.DocumentDirectoryPath}/wallpapers`;
export const referencesFilePath = `${RNFS.DocumentDirectoryPath}/wallpapers/references`;
export const downloadsDirectoryPath = RNFS.DownloadDirectoryPath;
