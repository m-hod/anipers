import { Image, Modal, StyleSheet, View } from 'react-native';
import { Layout, menuBarHeight, statusBarHeight } from 'src/constants';
import React, { useContext } from 'react';

import AppContext from 'src/AppContext';
import { ProgressBar } from '@react-native-community/progress-bar-android';

const AppLoadingModal = () => {
  const visibility = useContext(AppContext).appLoading;

  return (
    <Modal visible={visibility}>
      <View style={styles.pageContainer}>
        <Image
          source={require('../../../public/logo-final.png')}
          style={styles.image}
        />
        <ProgressBar
          styleAttr="Horizontal"
          color="rgb(3, 169, 255)"
          style={{ width: 75 }}
        />
      </View>
    </Modal>
  );
};

export default AppLoadingModal;

const styles = StyleSheet.create({
  pageContainer: {
    ...Layout.pageContainer,
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 9998,
    paddingTop: statusBarHeight,
    paddingBottom: menuBarHeight,
  },
  modalContent: {
    position: 'absolute',
    zIndex: 9999,
    color: '#FFFFFF',
    top: 0,
  },
  image: {
    height: 75,
    width: 75,
  },
});
