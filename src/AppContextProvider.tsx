import React, { useEffect, useState } from 'react';
import AppContext from './AppContext';

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [appLoading, setAppLoading] = useState(false);
  const [promises, setPromises] = useState<Promise<any>[]>([]);

  useEffect(() => {
    // if (appLoading) {
    if (promises.length) {
      const timer = setTimeout(() => {
        console.log('trigger promises');
        console.log(promises);
        // Promise.allSettled(promises).then(() => {
        //   setAppLoading(false);
        setPromises([]);
        // });
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }
    // }
  }, [promises]);

  return (
    <AppContext.Provider
      value={{ appLoading, setAppLoading, promises, setPromises }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
