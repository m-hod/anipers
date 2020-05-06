import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Wallpaper from './Wallpaper';
import BottomNav from './BottomNav';
import TopNav from './TopNav';
import {
  pageContainer,
  statusBarHeight,
  menuBarHeight,
  CategoryIDs,
  Colors,
} from '../constants';
import { parseTagName } from '../utils';
import { usePromise } from '../hooks/usePromise';
import { getMostPopularTags, getRandomPostByTag } from '../API';
import { TagCategories } from 'src/types';

const homeTagsCategories = new Map<TagCategories, string>([
  ['general', 'Tags'],
  ['character', 'Characters'],
  ['copyright', 'Franchise'],
  ['artist', 'Artists'],
]);

function Home() {
  // const [query, setQuery] = useState('');

  return (
    <View>
      <TopNav />
      {/* <TextInput
        value={query}
        onChangeText={(e) => {
          setQuery(e);
        }}
      />
      <Button title="Search" onPress={() => {}} /> */}
      <FlatList
        data={[...homeTagsCategories.keys()]}
        renderItem={(el) => {
          return <TagsGroup category={el.item} />;
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator
        keyExtractor={(item) => item}
      />
      {/* <Wallpaper query={query} /> */}
      <BottomNav />
    </View>
  );
}

export default Home;

function TagsGroup({ category }: { category: TagCategories }) {
  const promise = useCallback(
    () => getMostPopularTags(CategoryIDs[category]).then((res) => res),
    [category],
  );
  const promiseState = usePromise(promise);
  const [heroImageUrl, setHeroImageUrl] = useState('');

  useEffect(() => {
    if (promiseState.status === 'loaded' && promiseState.data) {
      const tagQueryString = (() => {
        // add exceptions for tags that don't return image urls here
        if (promiseState.data[0].name === 'banned_artist') {
          return promiseState.data[1].name;
        } else {
          return promiseState.data[0].name;
        }
      })();
      getRandomPostByTag(tagQueryString).then((res) =>
        setHeroImageUrl(res[0].file_url),
      );
    }
  }, [promiseState]);

  const renderTags = () => {
    if (promiseState.status === 'loading') {
      return <Text>Loading...</Text>;
    }

    if (promiseState.status === 'error') {
      return <Text>{promiseState.error || 'Error'}</Text>;
    }

    if (promiseState.status === 'loaded' && promiseState.data) {
      return (
        <View>
          <FlatList
            data={promiseState.data}
            renderItem={(el) => {
              // currently filtering twice, would be better to filter this out in the call itself so it never reaches this point
              if (el.item.name === 'banned_artist') {
                return null;
              }
              return (
                <TouchableOpacity style={styles.tag} activeOpacity={0.5}>
                  <Text style={[styles.tagText, styles.tagTextTitle]}>
                    {parseTagName(el.item.name)}
                  </Text>
                  <Text style={[styles.tagText, styles.tagTextPostCount]}>
                    {el.item.post_count}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.title}>
        Most Popular {homeTagsCategories.get(category)}
      </Text>
      {renderTags()}
      {!!heroImageUrl && (
        <Image source={{ uri: heroImageUrl }} style={styles.image} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    ...pageContainer,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: statusBarHeight + menuBarHeight + 25,
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'gray',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tag: {
    margin: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: Colors.menuColor,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagText: {
    color: 'white',
    fontSize: 20,
  },
  tagTextTitle: {
    maxWidth: 125,
  },
  tagTextPostCount: {
    maxWidth: 75,
    textAlign: 'right',
  },
  image: {
    flex: 1,
    position: 'absolute',
    zIndex: -999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
