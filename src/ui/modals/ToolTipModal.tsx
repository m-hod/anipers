import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Colors, WindowWidth, WindowHeight } from '../../constants';

function ToolTipModal({
  label,
  visibility,
}: {
  label: string;
  visibility: boolean;
}) {
  return (
    <Modal visible={visibility}>
      <View style={styles.container}>
        <Text>{label}</Text>
      </View>
    </Modal>
  );
}

export default ToolTipModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: WindowHeight,
    width: WindowWidth,
    backgroundColor: Colors.modalPopover,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
