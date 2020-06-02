import React, { useEffect, useState } from 'react';
import AppContext from './AppContext';
import { BooruResponsePost, ActiveImage, ImageType } from './types';
import RNFS from 'react-native-fs';
import ImmersiveMode from 'react-native-immersive-mode';

const appPath = RNFS.DocumentDirectoryPath;

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [promises, setPromises] = useState<Map<string, boolean>>(new Map());
  const [appLoading, setAppLoading] = useState(true);
  const [statusBarVisibility, setStatusBarVisibility] = useState(false);

  const [searchResultImages, setSearchResultImages] = useState<
    Map<string, ImageType>
  >(new Map());
  const [activeImage, setActiveImage] = useState<ImageType | null>(null);
  const [savedImages, setSavedImages] = useState<Map<string, ImageType>>(
    new Map(),
  );
  const [currentSearchTag, setCurrentSearchTag] = useState('');

  useEffect(() => {
    ImmersiveMode.fullLayout(true);
    ImmersiveMode.setBarTranslucent(true);
    return () => {
      ImmersiveMode.fullLayout(false);
    };
  }, []);

  useEffect(() => {
    RNFS.mkdir(`${appPath}/wallpapers`).then(() => {
      RNFS.exists(`${appPath}/wallpapers/references`).then((response) => {
        if (response) {
          RNFS.readFile(`${appPath}/wallpapers/references`)
            .then((response) => {
              setSavedImages(() => {
                const newState = new Map();
                JSON.parse(response).forEach((imageItem: ImageType) => {
                  newState.set(imageItem.file_url, imageItem);
                });
                return newState;
              });
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          RNFS.writeFile(
            `${appPath}/wallpapers/references`,
            JSON.stringify([]),
          ).catch((e) => {
            console.log(e);
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    console.log(savedImages);
  }, [savedImages]);

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
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
