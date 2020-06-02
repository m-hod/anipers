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
    if (promiseState.status === 'loaded' && promiseState.data) {
      const tagQueryString = promiseState.data[0].name;
      getRandomPostByTag(tagQueryString).then((res) => {
        console.log(res[0]);
        setHeroImage({
          file_ext: res[0].file_ext,
          file_url: res[0].file_url,
          preview_file_url: res[0].preview_file_url,
        });
      });
    }
  }, [promiseState]);

  const renderTagTabs = () => {
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
      {/* Put in an annotation (tooltip?) - post result tallies are calculated before filtering images unsuitable for wallpapers */}
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
});

// user should never see a gray background
// load until preview loaded
// display blurred preview until full image loaded
// if search again and already a background image, display that until next search complete - don't show tags until loaded again
