import React, { useEffect, useState } from 'react';
import AppContext from './AppContext';
import { BooruResponsePost, ActiveImage } from './types';

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
