import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Colors, WindowWidth, WindowHeight, Fonts } from 'src/constants';

function ToolTipModal({
  label,
  visibility,
}: {
  label: string;
  visibility: boolean;
}) {
  return (
    <Modal visible={visibility} transparent>
      <View style={styles.container}>
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{label}</Text>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltip: {
    height: 50,
    borderRadius: 5,
    backgroundColor: Colors.menuColorDark,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tooltipText: {
    ...Fonts.regular,
  },
});
