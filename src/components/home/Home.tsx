import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CategoryIDs,
  Colors,
  Layout,
  WindowHeight,
  WindowWidth,
  filteredTags,
  homeTagsCategories,
} from 'src/constants';
import { ImageType, RootStackParamList, TagCategories } from 'src/types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { getMostPopularTags, getRandomPostByTag } from 'src/API';

import AppContext from 'src/AppContext';
import FastImage from 'react-native-fast-image';
import IconButton from 'src/ui/components/IconButton';
import ImmersiveMode from 'react-native-immersive-mode';
import Loading from 'src/ui/animations/Loading';
import { StackNavigationProp } from '@react-navigation/stack';
import TagTab from 'src/ui/components/TagTab';
import TagsPage from 'src/ui/pages/TagsPage';
import TopNav from '../search/TopNav';
import { useNavigation } from '@react-navigation/native';
import { usePromise } from 'src/hooks/usePromise';

type NavigationProps = StackNavigationProp<RootStackParamList, 'home'>;

export default function Home() {
  const { appLoading } = useContext(AppContext);
  const [initialBoot, setInitialBoot] = useState(true);

  useEffect(() => {
    if (appLoading) {
      const timer = setTimeout(() => {
        setInitialBoot(false);
      }, 250);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [appLoading]);

  return (
    <View style={initialBoot ? styles.hidden : null}>
      <TopNav />
      <ScrollView horizontal pagingEnabled>
        {[...homeTagsCategories.keys()].map((category, i) => (
          <TagsGroup key={i} category={category} />
        ))}
      </ScrollView>
    </View>
  );
}

function TagsGroup({ category }: { category: TagCategories }) {
  const navigation = useNavigation<NavigationProps>();
  const [count, setCount] = useState<number>(0);
  const promise = useCallback(
    () => getMostPopularTags(CategoryIDs[category]).then((res) => res),
    [category],
  );
  const promiseState = usePromise(promise);
  const [heroImageUrl, setHeroImageUrl] = useState(['']);
  const [currentImage, setCurrentImage] = useState<ImageType | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const {
    setPromises,
    setSearchResultImages,
    currentSearchTag,
    setCurrentSearchTag,
    setHomeImages,
    setPage,
  } = useContext(AppContext);

  useEffect(() => {
    ImmersiveMode.setBarMode('Normal');
  }, []);

  useEffect(() => {
    if (count < 1) {
      if (heroImageUrl[0]) {
        setPromises((prevState: Map<string, boolean>) => {
          const newState = new Map<string, boolean>(prevState);
          newState.set(heroImageUrl[0], initialLoad);
          return newState;
        });
      }
    }
  }, [heroImageUrl, initialLoad, setPromises, count]);

  useEffect(() => {
    if (promiseState.status === 'loaded' && promiseState.data) {
      const tagQueryString = (() => {
        if (filteredTags.has(promiseState.data[0].name)) {
          return promiseState.data[1].name;
        } else {
          return promiseState.data[0].name;
        }
      })();

      getRandomPostByTag(tagQueryString).then((res) => {
        const [responsePost] = res;
        setCurrentImage({
          file_ext: responsePost.file_ext,
          preview_file_url: responsePost.preview_file_url,
          file_url: responsePost.file_url,
          large_file_url: responsePost.large_file_url,
          tag_string_artist: responsePost.tag_string_artist,
          pixiv_id: responsePost.pixiv_id,
        });

        setHeroImageUrl((prevState) => {
          if (prevState[0]) {
            const newState = [...prevState];
            newState.push(res[0].file_url);
            return newState;
          } else {
            return [res[0].file_url];
          }
        });
      });
    }
  }, [promiseState, count]);

  useEffect(() => {
    if (heroImageUrl[0] && currentImage) {
      setHomeImages((prevState: Map<string, ImageType>) => {
        const newState = new Map([...prevState]);
        newState.set(heroImageUrl[0], currentImage);
        return newState;
      });
    }
  }, [heroImageUrl, currentImage, setHomeImages]);

  const renderTags = () => {
    if (promiseState.status === 'loading') {
      return <ActivityIndicator color="rgba(255,255,255,0.9)" size={60} />;
    }

    if (promiseState.status === 'error') {
      return <Text>{promiseState.error || 'Error'}</Text>;
    }

    if (promiseState.status === 'loaded' && promiseState.data) {
      return (
        <FlatList
          data={promiseState.data}
          renderItem={(el) => {
            return (
              <TagTab
                key={el.item.id}
                tag={el.item}
                navigate={() => {
                  setPage(1);
                  if (currentSearchTag !== el.item.name) {
                    setSearchResultImages(new Map());
                    setCurrentSearchTag(el.item.name);
                  }
                  navigation.navigate('thumbnails', { tag: el.item.name });
                }}
                isHome
              />
            );
          }}
          keyExtractor={(item) => item.id.toString()}
        />
      );
    }
  };

  return (
    <TagsPage
      subTitle="Most Popular:"
      title={homeTagsCategories.get(category)!}>
      <View style={styles.tagContainer}>{renderTags()}</View>
      {!!heroImageUrl[0] &&
        heroImageUrl.map((imageUrl) => (
          <FastImage
            key={imageUrl}
            source={{
              uri: imageUrl,
            }}
            style={[styles.image]}
            onLoadStart={() => {
              if (!imageLoading) {
                setImageLoading(true);
              }
            }}
            onLoad={() => {
              setImageLoading(false);
              if (heroImageUrl.length) {
                setHeroImageUrl([heroImageUrl[heroImageUrl.length - 1]]);
              }
              setInitialLoad(false);
            }}
          />
        ))}
      <HomeBottomNav
        image={currentImage}
        setCount={setCount}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
      />
    </TagsPage>
  );
}

function HomeBottomNav({
  image,
  setCount,
  imageLoading,
  setImageLoading,
}: {
  image: ImageType | null;
  setCount: Function;
  imageLoading: boolean;
  setImageLoading: (arg: boolean) => void;
}) {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.bottomNav}>
      <IconButton
        icon="image"
        label="Navigate to Image"
        size={36}
        action={() => {
          if (image) {
            navigation.navigate('wallpaper', { image, type: 'home' });
          }
        }}
        primary
      />
      <TouchableOpacity
        onLongPress={() => {
          ToastAndroid.show('Refresh Image', 5);
        }}
        onPress={() => {
          setCount((prevCount: number) => prevCount + 1);
          setImageLoading(true);
        }}>
        <Loading loadingState={imageLoading} size={36} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
  tagContainer: {
    marginVertical: 20,
    height: Dimensions.get('window').height / 2,
    overflow: 'scroll',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    ...Layout.containerOverlay,
    zIndex: -999,
  },
  imageHidden: {
    display: 'none',
  },
  bottomNav: {
    position: 'absolute',
    top: WindowHeight - 30 - 72,
    right: 0,
    bottom: 0,
    left: WindowWidth - 20 - 36,
  },
  bottomNavIcon: {
    color: Colors.iconColorActive,
    marginVertical: 5,
  },
  pageOverlay: {
    ...Layout.pageContainer,
    position: 'relative',
    zIndex: 2,
    backgroundColor: Colors.modalPopover,
  },
});
