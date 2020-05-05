import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Wallpaper from './Wallpaper';
import BottomNav from './BottomNav';
import TopNav from './TopNav';
import {
  pageContainer,
  statusBarHeight,
  menuBarHeight,
  CategoryIDs,
} from '../constants';
import { parseTagName } from '../utils';
import { usePromise } from '../hooks/usePromise';
import { getMostPopularTags } from '../API';
import { TagCategories } from 'src/types';

const homeTagsCategories = new Map<TagCategories, string>([
  ['general', 'Tags'],
  ['character', 'Characters'],
  ['copyright', 'Franchise'],
  ['artist', 'Artists'],
]);

function Home() {
  const [query, setQuery] = useState('');

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
            renderItem={(el) => (
              <TouchableOpacity style={styles.tag} activeOpacity={0.5}>
                <Text style={styles.tagText}>
                  {parseTagName(el.item.name)} {el.item.post_count}
                </Text>
              </TouchableOpacity>
            )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    ...pageContainer,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: statusBarHeight + menuBarHeight + 25,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  tag: {
    margin: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: 'gray',
  },
  tagText: {
    color: 'white',
    fontSize: 20,
  },
});
