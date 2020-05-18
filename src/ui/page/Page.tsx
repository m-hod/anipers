import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Layout,
  statusBarHeight,
  menuBarHeight,
  Colors,
} from '../../constants';

function Page({
  children,
  centered,
}: {
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <View style={[styles.pageContainer, centered && styles.centered]}>
      {children}
    </View>
  );
}

export default Page;

const styles = StyleSheet.create({
  pageContainer: {
    ...Layout.pageContainer,
    backgroundColor: Colors.background,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: statusBarHeight + menuBarHeight + 25,
    position: 'relative',
    zIndex: 1,
  },
  centered: {
    justifyContent: 'center',
  },
});
