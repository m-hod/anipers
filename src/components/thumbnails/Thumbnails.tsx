import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { RootStackParamList, BooruResponsePost, ImageType } from 'src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import {
  statusBarHeight,
  menuBarHeight,
  Colors,
  WindowHeight,
  WindowWidth,
} from 'src/constants';
import { getTagPosts } from 'src/API';
import { usePromise } from 'src/hooks/usePromise';
import TopNav from '../search/TopNav';
import Page from 'src/ui/components/Page';
import AppContext from 'src/AppContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import IconButton from 'src/ui/components/IconButton';
import { BlurView } from '@react-native-community/blur';

type NavigationProps = StackNavigationProp<RootStackParamList, 'thumbnails'>;
type RouteProps = RouteProp<RootStackParamList, 'thumbnails'>;

export default function Thumbnails() {
  const navigation = useNavigation<NavigationProps>();
  const flatListRef = useRef(null);
  const { tag } = useRoute<RouteProps>().params;

  const {
    searchResultImages,
    setSearchResultImages,
    savedImages,
    activeImage,
    setActiveImage,
    page,
    setPage,
  } = useContext(AppContext);

  const [isRandom, setIsRandom] = useState(0);

  const promise = useCallback(() => getTagPosts(tag, page, !!isRandom), [
    tag,
    page,
    isRandom,
  ]);
  const promiseState = usePromise(promise);

  useEffect(() => {
    if (promiseState.status === 'loaded' && promiseState.data) {
      setSearchResultImages((prevState: Map<string, ImageType>) => {
        if (promiseState.data!.length) {
          if (page === 0) {
            const newState = new Map();
            promiseState.data?.forEach((post) => {
              newState.set(post.file_url, {
                file_ext: post.file_ext,
                file_url: post.file_url,
                preview_file_url: post.preview_file_url,
                tag_string_artist: post.tag_string_artist,
                pixiv_id: post.pixiv_id,
              });
            });
            return newState;
          } else {
            const newState = new Map(prevState);
            promiseState.data?.forEach((post) => {
              newState.set(post.file_url, {
                file_ext: post.file_ext,
                file_url: post.file_url,
                preview_file_url: post.preview_file_url,
                tag_string_artist: post.tag_string_artist,
                pixiv_id: post.pixiv_id,
              });
            });
            return newState;
          }
        }
        return prevState;
      });
    }
  }, [promiseState, setSearchResultImages]);

  const renderPostList = () => {
    if (searchResultImages.size) {
      return (
        <View style={styles.flatListContainer}>
          <FlatList
            data={[...searchResultImages.values()]}
            renderItem={(el) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (el.item.file_url !== activeImage?.file_url) {
                      setActiveImage(el.item);
                    }
                    navigation.navigate('wallpaper', {
                      image: el.item,
                      type: 'search',
                    });
                  }}>
                  <Image
                    source={{
                      uri: el.item.preview_file_url,
                      // priority: FastImage.priority.high,
                    }}
                    style={[styles.image]}
                  />
                  <View style={styles.saveIconOverlay}>
                    {savedImages && !!savedImages[el.item.file_url] && (
                      <Icon size={28} name="save" style={styles.saveIcon} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
            numColumns={4}
            keyExtractor={(item) => item.file_url.toString()}
            style={styles.listContainer}
            onEndReached={() => {
              setPage(page + 1);
            }}
            contentContainerStyle={styles.listContainerFlexPositioning}
            extraData={searchResultImages}
            ref={flatListRef}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <Page>
      <TopNav />
      <View style={styles.pageContainer}>
        {renderPostList()}
        {(() => {
          if (searchResultImages.size) return null;
          if (!promiseState) return null;
          if (promiseState.status === 'loading') {
            return (
              <View style={styles.fillContainer}>
                <ActivityIndicator color="rgba(255,255,255,0.9)" size={60} />
              </View>
            );
          }
          if (promiseState.status === 'error') {
            return (
              <View style={styles.fillContainer}>
                <Text>Error!</Text>
              </View>
            );
          }
        })()}
      </View>
      <View style={styles.bottomNav}>
        {searchResultImages.size && promiseState?.status === 'loading' ? (
          <ActivityIndicator color="rgba(255,255,255,0.5)" size={28} />
        ) : (
          <>
            <IconButton
              icon="shuffle"
              label="Randomize"
              action={() => {
                setSearchResultImages(new Map());
                setPage(1);
                setIsRandom(isRandom + 1);
              }}
            />
            <IconButton
              icon="expand-less"
              label="Scroll To Top"
              size={42}
              action={() => {
                //@ts-ignore
                flatListRef.current?.scrollToIndex({ index: 0 });
              }}
            />
          </>
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingVertical: menuBarHeight,
  },
  fillContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    height: WindowHeight - (menuBarHeight * 1.5 + statusBarHeight) - 20,
  },
  listContainer: {
    padding: 5,
    width: WindowWidth,
  },
  listContainerFlexPositioning: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: WindowHeight / 4.25,
    width: WindowWidth / 4.25,
    margin: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  saveIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  bottomNav: {
    position: 'absolute',
    width: WindowWidth,
    top: WindowHeight - 36 - 9 - menuBarHeight,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomNavIcon: {
    color: Colors.iconColor,
    marginVertical: 5,
  },
  bottomNavIconActive: {
    color: Colors.iconColorActive,
  },
  saveIcon: {
    color: Colors.iconColorSaved,
    margin: 5,
  },
  blur: {
    position: 'absolute',
    height: WindowHeight / 4.25,
    width: WindowWidth / 4.25,
  },
});
