import React, { useEffect, useState } from 'react';
import AppContext from './AppContext';
import {
  BooruResponsePost,
  ActiveImage,
  ImageType,
  StorageItems,
} from './types';
import ImmersiveMode from 'react-native-immersive-mode';
import AsyncStorage from '@react-native-community/async-storage';
import { dbKey } from './constants';

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [promises, setPromises] = useState<Map<string, boolean>>(new Map());
  const [appLoading, setAppLoading] = useState(true);
  const [statusBarVisibility, setStatusBarVisibility] = useState(false);

  const [searchResultImages, setSearchResultImages] = useState<
    Map<string, ImageType>
  >(new Map());
  const [activeImage, setActiveImage] = useState<ImageType | null>(null);
  const [savedImages, setSavedImages] = useState<StorageItems | null>(null);
  const [currentSearchTag, setCurrentSearchTag] = useState('');
  const [homeImages, setHomeImages] = useState<Map<string, ImageType>>(
    new Map(),
  );
  const [page, setPage] = useState(1);

  // Set App immersive mode
  useEffect(() => {
    ImmersiveMode.fullLayout(true);
    ImmersiveMode.setBarTranslucent(true);
    return () => {
      ImmersiveMode.fullLayout(false);
    };
  }, []);

  // Display modal layover until initial background image loading promises resolve
  useEffect(() => {
    if (appLoading) {
      if (promises.size) {
        if (!Array.from(promises.values()).some((item) => item)) {
          setAppLoading(false);
          setStatusBarVisibility(true);
          setPromises(new Map());
        }
      }
    }
  }, [appLoading, promises]);

  // Get or Set app database
  useEffect(() => {
    getDB().then((res: StorageItems | null) => {
      if (!res) {
        setDB().then(() => console.log('Set DB'));
      } else {
        console.log('database', res);
        setSavedImages(res);
      }
    });
  }, []);

  const getDB = async () => {
    try {
      const data = await AsyncStorage.getItem(dbKey);
      console.log(data);
      return data ? JSON.parse(data) : data;
    } catch (e) {
      console.log('error getting database', e);
    }
  };

  const setDB = async () => {
    try {
      const data = JSON.stringify({});
      await AsyncStorage.setItem(dbKey, data);
      console.log('Set DB');
    } catch (e) {
      console.log('error setting database', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        appLoading,
        setAppLoading,
        promises,
        setPromises,
        searchResultImages,
        setSearchResultImages,
        statusBarVisibility,
        setStatusBarVisibility,
        activeImage,
        setActiveImage,
        savedImages,
        setSavedImages,
        currentSearchTag,
        setCurrentSearchTag,
        homeImages,
        setHomeImages,
        page,
        setPage,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
