import React, { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native';
import { Layout, menuBarHeight, WindowHeight } from 'src/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, BooruResponsePost, ActiveImage } from 'src/types';
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

// image resolution destroyed by crop - save crop params and adjust raw image by them instead of cropped compressed image?

function Wallpaper() {
  const { imageUrl, imageId } = useRoute<RouteProps>().params;
  const [fullscreen, setFullscreen] = useState(false);
  const {
    images,
    setImages,
    statusBarVisibility,
    setStatusBarVisibility,
    activeImage,
    setActiveImage,
  } = useContext(AppContext);

  const onViewRef = useRef((info) => {
    if (activeImage.raw !== info.viewableItems[0].item.file_url) {
      setActiveImage({ raw: info.viewableItems[0].item.file_url });
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

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
      {images.size && (
        <FlatList
          data={[...images.values()]}
          renderItem={(el) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setFullscreen(!fullscreen);
              }}>
              <FastImage
                source={{
                  uri: activeImage.edited
                    ? activeImage.edited
                    : el.item.file_url,
                }}
                style={[styles.image]}
              />
            </TouchableWithoutFeedback>
          )}
          initialScrollIndex={
            [...images.values()].findIndex((post) => post.id === imageId)!
          }
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          onViewableItemsChanged={onViewRef.current}
          // onEndReached={() => {
          //   setPage(page + 1);
          // }}
        />
      )}
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
