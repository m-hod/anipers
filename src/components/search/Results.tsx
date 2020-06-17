import React, { useCallback, useEffect, useState, useContext } from 'react';
import { RootStackParamList } from 'src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { searchTags, getRandomPostByTag } from 'src/API';
import { usePromise } from 'src/hooks/usePromise';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import TagTab from 'src/ui/components/TagTab';
import { reverseParseTagName } from 'src/utils';
import {
  Fonts,
  Layout,
  statusBarHeight,
  menuBarHeight,
  WindowHeight,
  WindowWidth,
} from 'src/constants';
import FastImage from 'react-native-fast-image';
import TopNav from './TopNav';
import IconButton from 'src/ui/components/IconButton';
import TagsPage from 'src/ui/pages/TagsPage';
import ProgressiveImage from 'src/ui/components/ProgressiveImage';
import { ImageType } from 'src/types';
import AppContext from 'src/AppContext';

type NavigationProps = StackNavigationProp<RootStackParamList, 'results'>;
type RouteProps = RouteProp<RootStackParamList, 'results'>;

function Results() {
  const navigation = useNavigation<NavigationProps>();
  const { query } = useRoute<RouteProps>().params;
  const [heroImage, setHeroImage] = useState<ImageType | null>(null);
  const {
    setSearchResultImages,
    currentSearchTag,
    setCurrentSearchTag,
  } = useContext(AppContext);

  const promise = useCallback(() => searchTags(reverseParseTagName(query)), [
    query,
  ]);
  const promiseState = usePromise(promise);

  useEffect(() => {
    if (promiseState.status === 'loaded' && promiseState.data?.length) {
      const tagQueryString = promiseState.data[0].name;
      getRandomPostByTag(tagQueryString).then((res) => {
        setHeroImage({
          file_ext: res[0].file_ext,
          file_url: res[0].file_url,
          preview_file_url: res[0].preview_file_url,
          tag_string_artist: res[0].tag_string_artist,
          pixiv_id: res[0].pixiv_id,
        });
      });
    }
  }, [promiseState]);

  const renderTagTabs = () => {
    if (promiseState.status === 'loading') {
      return <ActivityIndicator color="rgba(255,255,255,0.9)" size={60} />;
    }

    if (promiseState.status === 'error') {
      return <Text>{promiseState.error || 'Error'}</Text>;
    }

    if (promiseState.status === 'loaded' && !promiseState.data?.length) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>No results found!</Text>
        </View>
      );
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
      title={query ? query : 'All'}
      altTitle="Showing closest matches for:">
      <TopNav />
      <View style={styles.tagContainer}>{renderTagTabs()}</View>
      <View style={styles.image}>
        {heroImage && <ProgressiveImage image={heroImage} />}
      </View>
      <View style={styles.bottomNav}>
        <IconButton
          icon="image"
          label="Navigate to Image"
          size={36}
          action={() => {
            if (heroImage) {
              navigation.navigate('wallpaper', {
                image: heroImage,
                type: 'home',
              });
            }
          }}
          primary
          disabled={!heroImage}
        />
      </View>
    </TagsPage>
  );
}

export default Results;

const styles = StyleSheet.create({
  tagContainer: {
    marginTop: 20,
    height: Dimensions.get('window').height / 1.6,
    overflow: 'scroll',
  },
  image: {
    ...Layout.containerOverlay,
    zIndex: -999,
  },
  bottomNav: {
    position: 'absolute',
    top: WindowHeight - 36 - 20,
    right: 0,
    bottom: 0,
    left: WindowWidth - 20 - 36,
  },
  emptyContainer: {
    height: 60,
    display: 'flex',
    justifyContent: 'center',
  },
  empty: {
    ...Fonts.regular,
  },
});
