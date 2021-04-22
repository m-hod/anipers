import {
  Colors,
  Fonts,
  Layout,
  menuBarHeight,
  statusBarHeight,
} from 'src/constants';
import { StyleSheet, Text, View } from 'react-native';

import React from 'react';

function TagsPage({
  title,
  subTitle,
  altTitle,
  children,
}: {
  title: string;
  subTitle?: string;
  altTitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.pageContainer}>
      {altTitle ? <Text style={Fonts.altTitleFont}>{altTitle}</Text> : null}
      {subTitle ? <Text style={Fonts.subTitleFont}>{subTitle}</Text> : null}
      <Text style={Fonts.titleFont}>{title}</Text>
      {children}
      <View style={styles.overlay} />
    </View>
  );
}

export default TagsPage;

const styles = StyleSheet.create({
  pageContainer: {
    ...Layout.safeAreaPageContainer,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: statusBarHeight + menuBarHeight,
    position: 'relative',
    zIndex: 1,
    backgroundColor: Colors.background,
  },
  overlay: {
    ...Layout.containerOverlay,
    zIndex: -998,
    backgroundColor: Colors.imageOverlay,
  },
});
