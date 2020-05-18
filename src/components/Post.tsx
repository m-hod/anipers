import React, { useContext, useState } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { Layout } from '../constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, BooruResponsePost } from 'src/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import AppContext from '../AppContext';
import { FlatList } from 'react-native-gesture-handler';

type NavigationProps = StackNavigationProp<RootStackParamList, 'post'>;
type RouteProps = RouteProp<RootStackParamList, 'post'>;

function Post() {
  const { imageUrl } = useRoute<RouteProps>().params;
  const { images, setImages, page, setPage } = useContext(AppContext);
  const [activeImage, setActiveImage] = useState<BooruResponsePost>(
    images.get(imageUrl)!,
  );
  console.log('rendering posts');

  return (
    <View style={styles.pageContainer}>
      <FlatList
        data={[...images.values()]}
        renderItem={(el) => (
          <Image source={{ uri: el.item.file_url }} style={styles.image} />
        )}
        initialScrollIndex={
          [...images.values()].findIndex((post) => post.id === activeImage.id)!
        }
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator
        onEndReached={() => {
          setPage(page + 1);
        }}
      />
    </View>
  );
}

//include onendreach etc

export default Post;

const styles = StyleSheet.create({
  pageContainer: {
    ...Layout.pageContainer,
  },
  image: {
    ...Layout.pageContainer,
  },
});

/* hide status bar through context */
