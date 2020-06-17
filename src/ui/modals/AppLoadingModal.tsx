import React, { useContext } from 'react';
import { Modal, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Layout } from 'src/constants';
import AppContext from 'src/AppContext';

const AppLoadingModal = () => {
  const visibility = useContext(AppContext).appLoading;

  return (
    <Modal visible={visibility}>
      <View style={styles.pageContainer}>
        <ActivityIndicator color="rgba(255,255,255,0.9)" size={60} />
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
  },
  modalContent: {
    position: 'absolute',
    zIndex: 9999,
    color: '#FFFFFF',
    top: 0,
  },
});
