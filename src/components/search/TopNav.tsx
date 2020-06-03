import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { statusBarHeight, Colors, menuBarHeight } from 'src/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/types';
import { useNavigation } from '@react-navigation/native';
import IconButton from 'src/ui/components/IconButton';

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
          navigation.navigate('collections');
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
    // paddingHorizontal: 10,
    fontSize: 16,
    color: '#FFFFFF',
    flexGrow: 1,
    // backgroundColor: Colors.menuColorDark,
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
    // borderRadius: 5,
    zIndex: 3,
  },
});
