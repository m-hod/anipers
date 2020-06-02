import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import TopNav from '../search/TopNav';
import {
  statusBarHeight,
  menuBarHeight,
  CategoryIDs,
  Colors,
  Fonts,
  filteredTags,
  Layout,
  WindowHeight,
  WindowWidth,
  homeTagsCategories,
} from 'src/constants';
import { usePromise } from 'src/hooks/usePromise';
import { getMostPopularTags, getRandomPostByTag } from 'src/API';
import { TagCategories, RootStackParamList, ImageType } from 'src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Loading from 'src/ui/animations/Loading';
import AppContext from 'src/AppContext';
import TagTab from 'src/ui/components/TagTab';
import IconButton from 'src/ui/components/IconButton';
import FastImage from 'react-native-fast-image';
import ImmersiveMode from 'react-native-immersive-mode';
import TagsPage from 'src/ui/pages/TagsPage';

type NavigationProps = StackNavigationProp<RootStackParamList, 'home'>;

export default function Home() {
  const { appLoading } = useContext(AppContext);
  return (
    <View>
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

  const renderTags = () => {
    if (promiseState.status === 'loading') {
      return <ActivityIndicator />;
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
            source={{ uri: imageUrl }}
            style={[styles.image]}
            onLoadStart={() => {
              if (!imageLoading) {
                setImageLoading(true);
              }
            }}
            onLoad={() => {
              setImageLoading(false);
              if (heroImageUrl.length) {
                console.log(heroImageUrl);
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
  const { setActiveImage } = useContext(AppContext);

  return (
    <View style={styles.bottomNav}>
      <IconButton
        icon="image"
        label="Navigate to Image"
        size={36}
        action={() => {
          if (image) {
            setActiveImage(image);
            navigation.navigate('wallpaper', { image, type: 'home' });
          }
        }}
        primary
      />
      <TouchableOpacity
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
