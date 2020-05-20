import React, { useCallback } from 'react';
import { RootStackParamList } from 'src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { searchTags } from '../../API';
import { usePromise } from '../../hooks/usePromise';
import Page from '../../ui/page';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import TagTab from '../../ui/components/TagTab';

type NavigationProps = StackNavigationProp<RootStackParamList, 'results'>;
type RouteProps = RouteProp<RootStackParamList, 'results'>;

function Results() {
  const navigation = useNavigation<NavigationProps>();
  const { query } = useRoute<RouteProps>().params;

  const promise = useCallback(() => searchTags(query), [query]);
  const promiseState = usePromise(promise);

  const renderTagTabs = () => {
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
    <Page>
      <View>{renderTagTabs()}</View>
    </Page>
  );
}

export default Results;
