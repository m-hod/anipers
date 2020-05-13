import React from 'react';

const AppContext = React.createContext<{
  promises: Promise<any>[];
  setPromises(arg: Promise<any>[]): void;
  appLoading: boolean;
  setAppLoading(arg: boolean): void;
}>({
  appLoading: false,
  setAppLoading: () => {},
  promises: [],
  setPromises: () => {},
});

export default AppContext;

// on initial load, each tag category executes a promise in app context
// sends these promises to context
// when promise.allsettled, update appLoadingState

//need to be able to push an array of promises to context
