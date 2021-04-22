import React, { useContext } from 'react';

import AppContext from './AppContext';
import { Colors } from './constants';
import { StatusBar as ReactNativeStatusBar } from 'react-native';

const StatusBar = () => {
  const visibility = useContext(AppContext).statusBarVisibility;
  return (
    <ReactNativeStatusBar
      translucent={visibility}
      backgroundColor={Colors.menuColor}
      hidden={!visibility}
    />
  );
};

export default StatusBar;
