import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Layout } from '../constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/types';
import { RouteProp, useRoute } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<RootStackParamList, 'post'>;
type RouteProps = RouteProp<RootStackParamList, 'post'>;

function Post() {
  const { imageUrl } = useRoute<RouteProps>().params;

  return (
    <>
      <Image source={{ uri: imageUrl }} style={styles.image} />
    </>
  );
}

export default Post;

const styles = StyleSheet.create({
  image: {
    ...Layout.pageContainer,
  },
});

/* hide status bar through context */
