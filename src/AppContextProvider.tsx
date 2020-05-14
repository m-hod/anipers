import React, { useEffect, useState } from 'react';
import AppContext from './AppContext';

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [appLoading, setAppLoading] = useState(true);
  const [promises, setPromises] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (appLoading) {
      if (promises.size) {
        if (!Array.from(promises.values()).some((item) => item)) {
          setAppLoading(false);
          setPromises(new Map());
        }
      }
    }
  }, [appLoading, promises]);

  return (
    <AppContext.Provider
      value={{ appLoading, setAppLoading, promises, setPromises }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
