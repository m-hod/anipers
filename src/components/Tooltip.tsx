import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Tooltip({
  text,
  isVisible,
  children,
}: {
  text: string;
  isVisible: boolean;
  children: React.ReactChild;
}) {
  return (
    <View style={styles.container}>
      {isVisible && <Text style={styles.popup}>{text}</Text>}
      {children}
    </View>
  );
}

export default Tooltip;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
    padding: 10,
  },
  popup: {
    position: 'absolute',
    left: -16,
    right: -16,
    bottom: 60,
    backgroundColor: 'rgba(76, 76, 76, 0.75)',
    color: '#FFFFFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 5,
  },
});
