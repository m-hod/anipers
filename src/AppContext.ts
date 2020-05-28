import React from 'react';
import { BooruResponsePost, ActiveImage } from './types';

const AppContext = React.createContext<{
  /** Indicators of initial homepage background image loading state - app loading modal appears until resolved */
  promises: Map<string, boolean>;
  setPromises: Function;
  /** App loading appears when true, used to hide background loading of initial homepage images */
  appLoading: boolean;
  setAppLoading(arg: boolean): void;
  /** Map of search result imags, where the key is the file_url */
  images: Map<string, BooruResponsePost>;
  setImages(arg: any): void;
  /** Hides statusbar when false */
  statusBarVisibility: boolean;
  setStatusBarVisibility(arg: boolean): void;
  /** The active image in the horizontal flatlist when an image is selected, can have a raw or edited state, use edited state when it exists */
  activeImage: ActiveImage;
  setActiveImage(arg: any): void;
  /** Set of images urls saved in references file on local phone storage */
  savedImages: Set<string>;
  setSavedImages(arg: any): void;
}>({
  appLoading: true,
  setAppLoading: () => {},
  promises: new Map(),
  setPromises: () => {},
  images: new Map(),
  setImages: () => {},
  statusBarVisibility: false,
  setStatusBarVisibility: () => {},
  activeImage: { raw: '' },
  setActiveImage: () => {},
  savedImages: new Set(),
  setSavedImages: () => {},
});

export default AppContext;

// do all image references need a raw and edited version?
// when save image, save the uncropped version even if it is cropped
