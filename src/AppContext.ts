import React from 'react';
import {
  BooruResponsePost,
  ActiveImage,
  ImageType,
  StorageItems,
} from './types';

const AppContext = React.createContext<{
  /** Indicators of initial homepage background image loading state - app loading modal appears until resolved */
  promises: Map<string, boolean>;
  setPromises: Function;
  /** App loading appears when true, used to hide background loading of initial homepage images */
  appLoading: boolean;
  setAppLoading(arg: boolean): void;
  /** Hides statusbar when false */
  statusBarVisibility: boolean;
  setStatusBarVisibility(arg: boolean): void;

  /**Image Storage */
  /** The active image in the horizontal flatlist when an image is selected, can have a raw or edited state, use edited state when it exists */
  activeImage: ImageType | null;
  setActiveImage(arg: any): void;
  /** Map of search result imags, where the key is the file_url */
  searchResultImages: Map<string, ImageType>;
  setSearchResultImages(arg: any): void;
  /** Set of images urls saved in references file on local phone storage */
  savedImages: StorageItems | null;
  setSavedImages(arg: any): void;
  currentSearchTag: string;
  setCurrentSearchTag(arg: any): void;
  homeImages: Map<string, ImageType>;
  setHomeImages(arg: any): void;
}>({
  appLoading: true,
  setAppLoading: () => {},
  promises: new Map(),
  setPromises: () => {},
  searchResultImages: new Map(),
  setSearchResultImages: () => {},
  statusBarVisibility: false,
  setStatusBarVisibility: () => {},
  activeImage: null,
  setActiveImage: () => {},
  savedImages: null,
  setSavedImages: () => {},
  currentSearchTag: '',
  setCurrentSearchTag: () => {},
  homeImages: new Map(),
  setHomeImages: () => {},
});

export default AppContext;
