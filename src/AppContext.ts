import React from 'react';
import { BooruResponsePost } from './types';

const AppContext = React.createContext<{
  promises: Map<string, boolean>;
  setPromises: Function;
  appLoading: boolean;
  setAppLoading(arg: boolean): void;
  // where string is the file_url
  images: Map<string, BooruResponsePost>;
  setImages(arg: any): void;
  statusBarVisibility: boolean;
  setStatusBarVisibility(arg: boolean): void;
  activeImage: { raw: string; edited?: string };
  setActiveImage(arg: any): void;
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
});

export default AppContext;
