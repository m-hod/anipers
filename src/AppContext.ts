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
  page: number;
  setPage(arg: number): void;
}>({
  appLoading: true,
  setAppLoading: () => {},
  promises: new Map(),
  setPromises: () => {},
  images: new Map(),
  setImages: () => {},
  page: 0,
  setPage: () => {},
});

export default AppContext;
