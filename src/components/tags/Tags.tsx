import React, { useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { RootStackParamList } from 'src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import {
  Layout,
  statusBarHeight,
  menuBarHeight,
  Colors,
  WindowHeight,
  WindowWidth,
} from '../../constants';
import { getTagPosts } from '../../API';
import { usePromise } from '../../hooks/usePromise';
import TopNav from '../TopNav';

type NavigationProps = StackNavigationProp<RootStackParamList, 'tags'>;
type RouteProps = RouteProp<RootStackParamList, 'tags'>;

function Tags() {
  const navigation = useNavigation<NavigationProps>();

  const route = useRoute<RouteProps>();
  const { tag } = route.params;
  const promise = useCallback(() => getTagPosts(tag), [tag]);
  const promiseState = usePromise(promise);

  const renderPostList = () => {
    if (!promiseState) return null;
    if (promiseState.status === 'loading') return <Text>Loading...</Text>;
    if (promiseState.status === 'error') return <Text>Error!</Text>;

    return (
      <View style={styles.flatListContainer}>
        <FlatList
          data={promiseState.data}
          renderItem={(el) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('post', { imageUrl: el.item.file_url });
                }}>
                <Image
                  source={{ uri: el.item.file_url }}
                  style={[styles.image]}
                />
              </TouchableOpacity>
            );
          }}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
          style={styles.listContainer}
          onEndReached={() => {
            console.log('hi');
          }}
          contentContainerStyle={styles.listContainerFlexPositioning}
        />
      </View>
    );
  };

  return (
    <View style={styles.pageContainer}>
      <TopNav />
      {renderPostList()}
    </View>
  );
}

export default Tags;

const styles = StyleSheet.create({
  pageContainer: {
    ...Layout.pageContainer,
    backgroundColor: Colors.background,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: statusBarHeight + menuBarHeight + 25,
    position: 'relative',
    zIndex: 1,
  },
  flatListContainer: {
    height: WindowHeight - (menuBarHeight * 1.5 + statusBarHeight) - 10,
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
});
