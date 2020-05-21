import React, { useCallback, useEffect, useState } from 'react';
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

type NavigationProps = StackNavigationProp<RootStackParamList, 'results'>;
type RouteProps = RouteProp<RootStackParamList, 'results'>;

function Results() {
  const navigation = useNavigation<NavigationProps>();
  const { query } = useRoute<RouteProps>().params;
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);

  const promise = useCallback(() => searchTags(reverseParseTagName(query)), [
    query,
  ]);
  const promiseState = usePromise(promise);

  useEffect(() => {
    if (promiseState.status === 'loaded' && promiseState.data) {
      const tagQueryString = promiseState.data[0].name;
      getRandomPostByTag(tagQueryString).then((res) =>
        setHeroImageUrl(res[0].file_url),
      );
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
                  navigation.navigate('tags', { tag: el.item.name });
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
    <View style={styles.pageContainer}>
      <TopNav />
      <Text style={styles.altTitleFont}>Showing closest matches for:</Text>
      <Text style={styles.subTitle}>{query ? query : 'All'}</Text>
      <View style={styles.tagContainer}>{renderTagTabs()}</View>
      {heroImageUrl && (
        <FastImage source={{ uri: heroImageUrl }} style={styles.image} />
      )}
      <View style={styles.bottomNav}>
        <IconButton
          icon="image"
          label="Navigate to Image"
          size={36}
          action={() => {
            navigation.navigate('wallpaper', { imageUrl: heroImageUrl! });
          }}
          primary
          disabled={!heroImageUrl}
        />
      </View>
      <View style={styles.overlay} />
    </View>
  );
}

export default Results;

const styles = StyleSheet.create({
  pageContainer: {
    ...Layout.pageContainer,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: statusBarHeight + menuBarHeight + 25,
    position: 'relative',
    zIndex: 1,
  },
  altTitleFont: {
    ...Fonts.altTitleFont,
  },
  subTitle: {
    ...Fonts.subTitleFont,
  },
  tagContainer: {
    marginTop: 20,
    height: Dimensions.get('window').height / 1.6,
    overflow: 'scroll',
  },
  image: {
    ...Layout.containerOverlay,
    zIndex: -999,
  },
  overlay: {
    ...Layout.containerOverlay,
    zIndex: -998,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  bottomNav: {
    position: 'absolute',
    top: WindowHeight - 36 - 20,
    right: 0,
    bottom: 0,
    left: WindowWidth - 20 - 36,
  },
});
