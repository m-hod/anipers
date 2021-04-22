import { Colors, menuBarHeight, statusBarHeight } from 'src/constants';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';

import IconButton from 'src/ui/components/IconButton';
import { RootStackParamList } from 'src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<RootStackParamList, 'results'>;

function TopNav({ folderActive }: { folderActive?: boolean }) {
  const navigation = useNavigation<NavigationProps>();
  const [searchIsVisible, setSearchVisible] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <IconButton
        label="Saved Wallpapers"
        icon="folder"
        action={() => {
          folderActive
            ? navigation.goBack()
            : navigation.navigate('collections');
        }}
        primary={folderActive}
      />
      {searchIsVisible && (
        <TextInput
          style={styles.searchBar}
          value={query}
          autoFocus
          blurOnSubmit
          allowFontScaling
          clearTextOnFocus
          returnKeyType="search"
          clearButtonMode="while-editing"
          onChangeText={(e) => {
            setQuery(e);
          }}
          onSubmitEditing={() => {
            navigation.navigate('results', {
              query,
            });
          }}
          onBlur={() => {
            setSearchVisible(false);
          }}
        />
      )}
      <IconButton
        label="Search for Tags"
        icon={!searchIsVisible ? 'search' : 'clear'}
        primary={searchIsVisible}
        action={() => {
          setSearchVisible(!searchIsVisible);
        }}
      />
    </View>
  );
}

export default TopNav;

const styles = StyleSheet.create({
  container: {
    height: menuBarHeight * 1.5 + statusBarHeight,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingRight: 25,
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
  },
  icon: {
    color: Colors.iconColor,
  },
  iconActive: {
    color: Colors.iconColorActive,
  },
  searchBar: {
    height: 25,
    marginHorizontal: 25,
    padding: 2.5,
    fontSize: 16,
    color: '#FFFFFF',
    flexGrow: 1,
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
    zIndex: 3,
  },
});
