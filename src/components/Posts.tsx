import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RootStackParamList } from 'src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Layout, statusBarHeight, menuBarHeight } from '../constants';

type NavigationProps = StackNavigationProp<RootStackParamList, 'posts'>;
type RouteProps = RouteProp<RootStackParamList, 'posts'>;

function Posts() {
  const route = useRoute<RouteProps>();
  const { tag } = route.params;

  return (
    <View style={styles.pageContainer}>
      <Text>{tag}</Text>
    </View>
  );
}

export default Posts;

const styles = StyleSheet.create({
  pageContainer: {
    ...Layout.pageContainer,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: statusBarHeight + menuBarHeight + 25,
    position: 'relative',
    zIndex: 1,
  },
});
