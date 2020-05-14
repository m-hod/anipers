import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import TopNav from './TopNav';
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
} from '../constants';
import { parseTagName, truncateNumber } from '../utils';
import { usePromise } from '../hooks/usePromise';
import { getMostPopularTags, getRandomPostByTag } from '../API';
import { TagCategories, RootStackParamList } from 'src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from '../ui/animations/Loading';
import AppContext from '../AppContext';

type NavigationProps = StackNavigationProp<RootStackParamList, 'home'>;

const homeTagsCategories = new Map<TagCategories, string>([
  ['character', 'Characters'],
  ['copyright', 'Franchise'],
  ['general', 'Tags'],
  ['artist', 'Artists'],
]);

export default function Home() {
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
  const [imageLoading, setImageLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const { setPromises } = useContext(AppContext);

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

      getRandomPostByTag(tagQueryString).then((res) =>
        setHeroImageUrl((prevState) => {
          if (prevState[0]) {
            const newState = [...prevState];
            newState.push(res[0].file_url);
            return newState;
          } else {
            return [res[0].file_url];
          }
        }),
      );
    }
  }, [promiseState, count]);

  const renderTags = () => {
    if (promiseState.status === 'loading') {
      return <Text>Loading...</Text>;
    }

    if (promiseState.status === 'error') {
      return <Text>{promiseState.error || 'Error'}</Text>;
    }

    if (promiseState.status === 'loaded' && promiseState.data) {
      return (
        <FlatList
          data={promiseState.data}
          renderItem={(el) => {
            // currently filtering twice, would be better to filter this out in the call itself so it never reaches this point
            if (filteredTags.has(el.item.name)) {
              return null;
            }
            return (
              <TouchableOpacity
                style={styles.tag}
                activeOpacity={0.5}
                onPress={() => {
                  navigation.navigate('posts', { tag: el.item.name });
                }}>
                <ScrollView style={styles.tagNameContainer} horizontal>
                  <Text style={[styles.tagText]}>
                    {parseTagName(el.item.name)}
                  </Text>
                </ScrollView>
                <Text style={[styles.tagText, styles.tagTextPostCount]}>
                  {truncateNumber(el.item.post_count)}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
        />
      );
    }
  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.subTitle}>Most Popular:</Text>
      <Text style={styles.title}>{homeTagsCategories.get(category)}</Text>
      <View style={styles.tagContainer}>{renderTags()}</View>
      {!!heroImageUrl[0] &&
        heroImageUrl.map((imageUrl) => (
          <Image
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
                setHeroImageUrl([heroImageUrl[heroImageUrl.length - 1]]);
              }
              setInitialLoad(false);
            }}
          />
        ))}
      <HomeBottomNav
        imageUrl={heroImageUrl[0]}
        setCount={setCount}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
      />
      <View style={styles.overlay} />
    </View>
  );
}

function HomeBottomNav({
  imageUrl,
  setCount,
  imageLoading,
  setImageLoading,
}: {
  imageUrl: string;
  setCount: Function;
  imageLoading: boolean;
  setImageLoading: (arg: boolean) => void;
}) {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('post', { imageUrl });
        }}>
        <Icon name="image" size={36} style={styles.bottomNavIcon} />
      </TouchableOpacity>
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
  pageContainer: {
    ...Layout.pageContainer,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: statusBarHeight + menuBarHeight + 25,
    position: 'relative',
    zIndex: 1,
  },
  title: {
    ...Fonts.titleFont,
  },
  subTitle: {
    ...Fonts.subTitleFont,
  },
  tagContainer: {
    marginVertical: 20,
    height: Dimensions.get('window').height / 2,
    overflow: 'scroll',
  },
  tag: {
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: Colors.menuColorDark,
    width: 275,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagText: {
    color: 'white',
    fontSize: 20,
  },
  tagNameContainer: {
    flex: 9,
    width: 275 * 0.5,
  },
  tagTextPostCount: {
    maxWidth: 75,
    textAlign: 'right',
  },
  image: {
    ...Layout.containerOverlay,
    zIndex: -999,
  },
  imageHidden: {
    display: 'none',
  },
  overlay: {
    ...Layout.containerOverlay,
    zIndex: -998,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
});
