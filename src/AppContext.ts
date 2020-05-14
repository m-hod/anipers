import React from 'react';

const AppContext = React.createContext<{
  promises: Map<string, boolean>;
  setPromises: Function;
  appLoading: boolean;
  setAppLoading(arg: boolean): void;
}>({
  appLoading: true,
  setAppLoading: () => {},
  promises: new Map(),
  setPromises: () => {},
});

export default AppContext;
