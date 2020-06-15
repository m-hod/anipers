import {
  StatusBar,
  Platform,
  Dimensions,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { MappedTagCategories, TagCategories } from './types';
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
  iconColorSaved: 'rgba(152, 240, 152, 0.75)',
  iconColorSavedActive: 'rgba(152, 240, 152, 1)',
  textColor: '#FFFFFF',
  background: 'rgb(32, 32, 32)',
  modalPopover: 'rgba(0, 0, 0, 0.05)',
  imageOverlay: 'rgba(0, 0, 0, 0.25)',
};

export const Fonts: { [key: string]: TextStyle } = {
  titleFont: {
    color: Colors.textColor,
    fontWeight: 'bold',
    fontSize: 48,
  },
  subTitleFont: {
    color: Colors.textColor,
    fontWeight: 'bold',
    fontSize: 32,
  },
  altTitleFont: {
    color: Colors.textColor,
    fontWeight: 'bold',
    fontSize: 20,
  },
  regular: {
    color: Colors.textColor,
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
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    position: 'relative',
    zIndex: 1,
  },
  safeAreaPageContainer: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    paddingTop: statusBarHeight,
    paddingBottom: 48,
    position: 'relative',
    zIndex: 1,
  },
};

export const CategoryIDs: MappedTagCategories = {
  general: 0,
  artist: 1,
  copyright: 3,
  character: 4,
};

export const filteredTags = new Set([
  'banned_artist',
  'greyscale',
  '4koma',
  '2koma',
  'doujin_cover',
  'cover',
  'cover_page',
  'comic',
  'multiple_views',
  'arrow_(symbol)',
  'speech_bubble',
  'lineart',
  'emphasis_lines',
  'monochrome',
]);
export const supportedFormats = new Set(['jpg', 'png']);

export const downloadsDirectoryPath = RNFS.DownloadDirectoryPath;

export const homeTagsCategories = new Map<TagCategories, string>([
  ['character', 'Characters'],
  ['copyright', 'Franchise'],
  ['general', 'Tags'],
  ['artist', 'Artists'],
]);

export const dbKey = 'booru_db';
