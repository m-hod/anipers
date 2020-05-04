import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BooruResponsePost } from 'types';
import { getMostPopularTags } from '../API';
import { usePromise } from '../hooks/usePromise';

const supportedFormats = new Set(['jpg', 'png']);

function Wallpaper({ query }: { query: string }) {
  const [posts, setPosts] = useState<BooruResponsePost[] | null>(null);

  useEffect(() => {
    (async () => {
      const data: BooruResponsePost[] = await fetch(
        `https://testbooru.donmai.us/posts.json?tags=${query}`,
      )
        .then((response) => response.json())
        .catch((e) => console.warn(e));
      setPosts(data);
    })();
  }, [query]);
  const promise = useCallback(() => {
    return getMostPopularTags().then((res) => res);
  }, []);
  const promiseState = usePromise(promise);
  console.log('promise state:', promiseState);
  return (
    <View>
      {posts ? (
        <FlatList
          data={posts}
          renderItem={({ item }) =>
            supportedFormats.has(item.file_ext) ? (
              <Image
                key={item.id}
                source={{ uri: item.file_url }}
                style={styles.image}
              />
            ) : null
          }
          //@ts-ignore
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator
        />
      ) : (
        <Icon name="cached" />
      )}
    </View>
  );
}

export default Wallpaper;

const styles = StyleSheet.create({
  image: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});
