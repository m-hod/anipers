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
import { RootStackParamList, BooruResponsePost } from 'src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import {
  statusBarHeight,
  menuBarHeight,
  Colors,
  WindowHeight,
  WindowWidth,
} from '../../constants';
import { getTagPosts } from '../../API';
import { usePromise } from '../../hooks/usePromise';
import TopNav from '../search/TopNav';
import Page from 'src/ui/components/Page';
import AppContext from '../../AppContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';

type NavigationProps = StackNavigationProp<RootStackParamList, 'tags'>;
type RouteProps = RouteProp<RootStackParamList, 'tags'>;

function Tags() {
  const navigation = useNavigation<NavigationProps>();
  const { tag } = useRoute<RouteProps>().params;
  const [isRandom, setIsRandom] = useState(false);
  const { images, setImages, page, setPage } = useContext(AppContext);
  const promise = useCallback(() => {
    return getTagPosts(tag, page, isRandom);
  }, [tag, page, isRandom]);

  const promiseState = usePromise(promise);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (promiseState && promiseState.data) {
      setImages((prevState: Map<string, BooruResponsePost>) => {
        if (promiseState.data!.length) {
          const newState = new Map(prevState);
          promiseState.data?.forEach((post) => {
            newState.set(post.file_url, post);
          });
          return newState;
        }
        return prevState;
      });
    }
  }, [promiseState, setImages]);

  const renderPostList = () => {
    if (images.size) {
      return (
        <View style={styles.flatListContainer}>
          <FlatList
            data={[...images.values()]}
            renderItem={(el) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('wallpaper', {
                      imageUrl: el.item.file_url,
                    });
                  }}>
                  <FastImage
                    source={{
                      uri: el.item.file_url,
                      priority: FastImage.priority.high,
                    }}
                    style={[styles.image]}
                  />
                </TouchableOpacity>
              );
            }}
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
            style={styles.listContainer}
            onEndReached={() => {
              setPage(page + 1);
            }}
            contentContainerStyle={styles.listContainerFlexPositioning}
            extraData={images}
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
          if (images.size) return null;
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
        <TouchableOpacity
          onPress={() => {
            setImages(new Map());
            setIsRandom(!isRandom);
          }}>
          <Icon
            name="shuffle"
            size={32}
            style={[
              styles.bottomNavIcon,
              isRandom && styles.bottomNavIconActive,
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            flatListRef.current?.scrollToIndex({ index: 0 });
          }}>
          <Icon name="expand-less" size={42} style={styles.bottomNavIcon} />
        </TouchableOpacity>
      </View>
    </Page>
  );
}

export default Tags;

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
  },
  bottomNav: {
    position: 'absolute',
    width: WindowWidth,
    top: WindowHeight - 36 - 9,
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
});
