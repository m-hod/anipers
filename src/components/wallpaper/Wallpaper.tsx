import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native';
import { Layout, menuBarHeight } from 'src/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, BooruResponsePost } from 'src/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import AppContext from 'src/AppContext';
import {
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import BottomNav from './BottomNav';
import IconButton from 'src/ui/components/IconButton';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type NavigationProps = StackNavigationProp<RootStackParamList, 'wallpaper'>;
type RouteProps = RouteProp<RootStackParamList, 'wallpaper'>;

//create artificial array from index, prev, and next items in images context

//fix up images
//include onendreach etc
/* hide status bar through context */

function Wallpaper() {
  const { imageUrl } = useRoute<RouteProps>().params;
  const [fullscreen, setFullscreen] = useState(false);
  const {
    images,
    setImages,
    statusBarVisibility,
    setStatusBarVisibility,
    activeImage,
    setActiveImage,
  } = useContext(AppContext);
  // const [activeImage, setActiveImage] = useState<BooruResponsePost>(
  //   images.get(imageUrl)!,
  // );

  // image resolution destroyed by crop
  // replace image in the list (wherever it is) with the edited one - can access with raw path so don't need to loop!

  useEffect(() => {
    if (imageUrl !== activeImage.raw) {
      setActiveImage({ raw: imageUrl });
    }
  }, []);

  useEffect(() => {
    if (fullscreen) {
      setStatusBarVisibility(false);
    } else {
      setStatusBarVisibility(true);
    }
  }, [fullscreen]);

  return (
    <View style={styles.pageContainer}>
      <TouchableWithoutFeedback
        onPress={() => {
          setFullscreen(!fullscreen);
        }}>
        <FastImage
          source={{ uri: activeImage.edited ? activeImage.edited : imageUrl }}
          style={[styles.image]}
        />
      </TouchableWithoutFeedback>
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
      {!fullscreen && <BottomNav uri={imageUrl} />}
    </View>
  );
}

export default Wallpaper;

const styles = StyleSheet.create({
  pageContainer: {
    ...Layout.pageContainer,
    position: 'relative',
  },
  image: {
    ...Layout.pageContainer,
  },
});
