import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { statusBarHeight, Colors, menuBarHeight } from '../constants';
import { reverseParseTagName } from '../utils';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/types';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<RootStackParamList, 'results'>;

function TopNav() {
  const navigation = useNavigation<NavigationProps>();
  const [searchIsVisible, setSearchVisible] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Icon name="menu" size={32} style={styles.icon} />
      </TouchableOpacity>
      {searchIsVisible && (
        <TextInput
          style={styles.searchBar}
          value={query}
          autoFocus
          blurOnSubmit
          allowFontScaling
          clearButtonMode="while-editing"
          onChangeText={(e) => {
            setQuery(e);
          }}
          onSubmitEditing={() => {
            navigation.navigate('results', {
              query: reverseParseTagName(query),
            });
          }}
          onBlur={() => {
            setSearchVisible(false);
          }}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          setSearchVisible(!searchIsVisible);
        }}>
        <Icon
          name="search"
          size={32}
          style={[styles.icon, searchIsVisible && styles.iconActive]}
        />
      </TouchableOpacity>
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
    height: 30,
    marginHorizontal: 15,
    padding: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#FFFFFF',
    flexGrow: 1,
    backgroundColor: Colors.menuColorDark,
    borderRadius: 5,
    zIndex: 3,
  },
});
