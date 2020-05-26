import React, { useEffect, useState } from 'react';
import AppContext from './AppContext';
import { BooruResponsePost, ActiveImage } from './types';
import RNFS from 'react-native-fs';

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [appLoading, setAppLoading] = useState(true);
  const [promises, setPromises] = useState<Map<string, boolean>>(new Map());
  const [images, setImages] = useState<Map<string, BooruResponsePost>>(
    new Map(),
  );
  const [statusBarVisibility, setStatusBarVisibility] = useState(false);
  const [activeImage, setActiveImage] = useState<ActiveImage>({
    raw: '',
  });
  const [savedImages, setSavedImages] = useState([]);
  const appPath = RNFS.DocumentDirectoryPath;
  console.log('state', savedImages);

  useEffect(() => {
    RNFS.mkdir(`${appPath}/wallpapers`).then(() => {
      RNFS.exists(`${appPath}/wallpapers/references`).then((response) => {
        if (response) {
          RNFS.readFile(`${appPath}/wallpapers/references`)
            .then((response) => {
              console.log(response);
              setSavedImages(JSON.parse(response));
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
        images,
        setImages,
        statusBarVisibility,
        setStatusBarVisibility,
        activeImage,
        setActiveImage,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
