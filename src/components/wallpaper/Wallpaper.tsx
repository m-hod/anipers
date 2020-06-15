import React, { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native';
import {
  Layout,
  menuBarHeight,
  WindowHeight,
  WindowWidth,
} from 'src/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import AppContext from 'src/AppContext';
import {
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import BottomNav from './BottomNav';
import ImmersiveMode from 'react-native-immersive-mode';
import ProgressiveImage from 'src/ui/components/ProgressiveImage';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

type NavigationProps = StackNavigationProp<RootStackParamList, 'wallpaper'>;
type RouteProps = RouteProp<RootStackParamList, 'wallpaper'>;

function Wallpaper() {
  const { image, type } = useRoute<RouteProps>().params;
  const [fullscreen, setFullscreen] = useState(false);
  const {
    searchResultImages,
    setSearchResultImages,
    activeImage,
    setActiveImage,
    savedImages,
  } = useContext(AppContext);

  const onViewRef = useRef((info: any) => {
    if (activeImage?.file_url !== info.viewableItems[0].item.file_url) {
      const {
        file_url,
        file_ext,
        preview_file_url,
        cropped_file_url,
      } = info.viewableItems[0].item;
      setActiveImage({
        file_url,
        file_ext,
        preview_file_url,
        cropped_file_url: cropped_file_url ? cropped_file_url : undefined,
      });
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  useEffect(() => {
    if (fullscreen) {
      ImmersiveMode.setBarMode('FullSticky');
    } else {
      ImmersiveMode.setBarMode('Normal');
    }
  }, [fullscreen]);

  return (
    <View style={styles.pageContainer}>
      {activeImage ? (
        <FlatList
          data={
            type === 'home'
              ? [image]
              : type === 'search'
              ? [...searchResultImages!.values()]
              : [...Object.keys(savedImages!).map((key) => savedImages![key])]
          }
          renderItem={(el) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setFullscreen(!fullscreen);
              }}>
              <View style={styles.pageContainer}>
                <ReactNativeZoomableView
                  maxZoom={null}
                  minZoom={1}
                  zoomStep={0.5}
                  initialZoom={1}
                  bindToBorders={true}>
                  <ProgressiveImage image={el.item} />
                </ReactNativeZoomableView>
              </View>
            </TouchableWithoutFeedback>
          )}
          initialScrollIndex={
            type === 'home'
              ? 0
              : type === 'search'
              ? [...searchResultImages.values()].findIndex(
                  (post) => post.file_url === image.file_url,
                )!
              : [
                  ...Object.keys(savedImages!).map((key) => savedImages![key]),
                ].findIndex((post) => post.file_url === image.file_url)!
          }
          keyExtractor={(item) => item.file_url.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewRef.current}
          // onEndReached={() => {
          //   setPage(page + 1);
          // }}
          getItemLayout={(data, index) => ({
            offset: WindowWidth * index,
            length: WindowWidth,
            index,
          })}
        />
      ) : null}
      {!fullscreen && <BottomNav image={image} />}
    </View>
  );
}

export default Wallpaper;

const styles = StyleSheet.create({
  pageContainer: {
    ...Layout.pageContainer,
    position: 'relative',
  },
});
