import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
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

type NavigationProps = StackNavigationProp<RootStackParamList, 'thumbnails'>;
type RouteProps = RouteProp<RootStackParamList, 'thumbnails'>;

export default function Thumbnails() {
  const navigation = useNavigation<NavigationProps>();
  const { tag } = useRoute<RouteProps>().params;
  const [isRandom, setIsRandom] = useState(0);
  const [page, setPage] = useState(0);
  const {
    searchResultImages,
    setSearchResultImages,
    savedImages,
    activeImage,
    setActiveImage,
  } = useContext(AppContext);
  const promise = useCallback(() => getTagPosts(tag, page, !!isRandom), [
    tag,
    page,
    isRandom,
  ]);

  const promiseState = usePromise(promise);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (promiseState && promiseState.data) {
      setSearchResultImages((prevState: Map<string, ImageType>) => {
        if (promiseState.data!.length) {
          if (page === 0) {
            const newState = new Map();
            promiseState.data?.forEach((post) => {
              newState.set(post.file_url, {
                file_ext: post.file_ext,
                file_url: post.file_url,
                preview_file_url: post.preview_file_url,
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
                      setActiveImage({ raw: el.item.file_url });
                    }
                    navigation.navigate('wallpaper', {
                      image: el.item,
                      type: 'search',
                    });
                  }}>
                  <FastImage
                    source={{
                      uri: el.item.file_url,
                      priority: FastImage.priority.high,
                    }}
                    style={[styles.image]}>
                    <View>
                      {savedImages.has(el.item.file_url) && (
                        <Icon size={28} name="save" style={styles.saveIcon} />
                      )}
                    </View>
                  </FastImage>
                </TouchableOpacity>
              );
            }}
            numColumns={3}
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
                <ActivityIndicator size="large" />
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
        <IconButton
          icon="shuffle"
          label="Randomize"
          action={() => {
            setSearchResultImages(new Map());
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
    height: WindowHeight / 3.25,
    width: WindowWidth / 3.25,
    margin: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
});
