import React, { useContext } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Layout } from '../../constants';
import Loading from '../animations/Loading';
import AppContext from '../../AppContext';

const AppLoadingModal = () => {
  const visibility = useContext(AppContext).appLoading;

  return (
    <Modal visible={visibility}>
      <View style={styles.pageContainer}>
        <Loading loadingState={true} size={50} />
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
