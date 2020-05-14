import React, { useContext } from 'react';
import { StatusBar as ReactNativeStatusBar } from 'react-native';
import { Colors } from './constants';
import AppContext from './AppContext';

const StatusBar = () => {
  const visibility = useContext(AppContext).appLoading;
  return (
    <ReactNativeStatusBar
      translucent
      backgroundColor={Colors.menuColor}
      hidden={!visibility}
    />
  );
};

export default StatusBar;
