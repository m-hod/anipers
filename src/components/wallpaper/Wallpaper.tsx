import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  Text,
  Linking,
  Animated,
} from 'react-native';
import {
  Layout,
  menuBarHeight,
  WindowHeight,
  WindowWidth,
  statusBarHeight,
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
import { parseTagName } from 'src/utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useFadeAnimation from 'src/hooks/useFadeAnimation';

type NavigationProps = StackNavigationProp<RootStackParamList, 'wallpaper'>;
type RouteProps = RouteProp<RootStackParamList, 'wallpaper'>;

function Wallpaper() {
  const { image, type } = useRoute<RouteProps>().params;
  const [fullscreen, setFullscreen] = useState(false);
  const fadeAnim = useFadeAnimation(fullscreen);
  const [debounceScroll, setDebounceScroll] = useState(true);
  const {
    searchResultImages,
    setSearchResultImages,
    activeImage,
    setActiveImage,
    savedImages,
    homeImages,
    setHomeImages,
    page,
    setPage,
  } = useContext(AppContext);

  useEffect(() => {
    setActiveImage(image);
  }, []);

  const onViewRef = useRef((info: any) => {
    setActiveImage(info.viewableItems[0].item);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  useEffect(() => {
    if (fullscreen) {
      ImmersiveMode.setBarMode('FullSticky');
    } else {
      ImmersiveMode.setBarMode('Normal');
    }
  }, [fullscreen]);

  useEffect(() => {
    if (debounceScroll) {
      const timer = setTimeout(() => {
        setDebounceScroll(false);
      }, 100);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [debounceScroll]);

  return (
    <View style={styles.pageContainer}>
      {activeImage ? (
        <FlatList
          scrollEnabled={!debounceScroll}
          data={
            type === 'home'
              ? [homeImages.get(image.file_url)!]
              : type === 'result'
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
                {!fullscreen && (
                  <Animated.View
                    style={[styles.metadataContainer, { opacity: fadeAnim }]}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (el.item.tag_string_artist && el.item.pixiv_id) {
                          Linking.openURL(
                            `https://www.pixiv.net/en/artworks/${el.item.pixiv_id}`,
                          );
                        }
                      }}
                      style={styles.metadataSubContainer}>
                      <Text style={styles.metadata}>
                        {el.item.tag_string_artist
                          ? `By: ${parseTagName(el.item.tag_string_artist)}`
                          : ''}
                      </Text>
                      <Icon name="link" style={styles.metadataIcon} />
                    </TouchableWithoutFeedback>
                  </Animated.View>
                )}
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
          initialNumToRender={1}
          maxToRenderPerBatch={3}
          keyExtractor={(item) => item.file_url.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewRef.current}
          onEndReached={() => {
            setPage(page + 1);
          }}
          extraData={searchResultImages}
          getItemLayout={(data, index) => ({
            offset: WindowWidth * index,
            length: WindowWidth,
            index,
          })}
        />
      ) : null}
      <BottomNav image={image} fullscreen={fullscreen} type={type} />
    </View>
  );
}

export default Wallpaper;

const styles = StyleSheet.create({
  pageContainer: {
    ...Layout.pageContainer,
    position: 'relative',
    backgroundColor: 'rgb(255,255,255)',
  },
  metadataContainer: {
    position: 'absolute',
    marginTop: statusBarHeight + 5,
    marginLeft: 5,
  },
  metadataSubContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  metadata: {
    fontSize: 18,
    textShadowOffset: { width: 1, height: 1 },
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowRadius: 1,
    color: 'white',
  },
  metadataIcon: {
    marginLeft: 2.5,
    color: 'white',
    transform: [{ rotate: '-45deg' }],
    textShadowOffset: { width: 1, height: 1 },
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowRadius: 1,
  },
});
