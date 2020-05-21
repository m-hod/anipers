import React, { useContext, useState } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Layout } from 'src/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, BooruResponsePost } from 'src/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import AppContext from 'src/AppContext';
import { FlatList } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

type NavigationProps = StackNavigationProp<RootStackParamList, 'wallpaper'>;
type RouteProps = RouteProp<RootStackParamList, 'wallpaper'>;

//create artificial array from index, prev, and next items in images context

//fix up images
//include onendreach etc
/* hide status bar through context */

function Wallpaper() {
  const { imageUrl } = useRoute<RouteProps>().params;
  // const { images, setImages, page, setPage } = useContext(AppContext);
  // const [activeImage, setActiveImage] = useState<BooruResponsePost>(
  //   images.get(imageUrl)!,
  // );

  return (
    <View style={styles.pageContainer}>
      <FastImage source={{ uri: imageUrl }} style={styles.image} />
      {/* {images.size && (
        <FlatList
          data={[...images.values()]}
          renderItem={(el) => (
            <Image source={{ uri: el.item.file_url }} style={styles.image} />
          )}
          initialScrollIndex={
            [...images.values()].findIndex(
              (post) => post.id === activeImage.id,
            )!
          }
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator
          onEndReached={() => {
            setPage(page + 1);
          }}
        />
      )} */}
    </View>
  );
}

export default Wallpaper;

const styles = StyleSheet.create({
  pageContainer: {
    ...Layout.pageContainer,
  },
  image: {
    ...Layout.pageContainer,
  },
});
