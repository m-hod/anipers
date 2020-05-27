import React, { useEffect, useContext, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Layout,
  Colors,
  statusBarHeight,
  menuBarHeight,
  referencesFilePath,
  WindowHeight,
  WindowWidth,
} from 'src/constants';
import TopNav from '../search/TopNav';
import AppContext from 'src/AppContext';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/types';
import FastImage from 'react-native-fast-image';
import ImmersiveMode from 'react-native-immersive-mode';

type NavigationProps = StackNavigationProp<RootStackParamList, 'tags'>;

const Collections = () => {
  const navigation = useNavigation<NavigationProps>();

  const { savedImages, setImages } = useContext(AppContext);
  const flatListRef = useRef(null);

  useEffect(() => {
    ImmersiveMode.setBarMode('Normal');
  }, []);

  return (
    <View style={styles.container}>
      <TopNav folderActive />
      <View style={styles.subContainer}>
        <FlatList
          data={[...savedImages]}
          renderItem={(el) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('wallpaper', {
                    imageId: el.index,
                    imageUrl: el.item,
                  });
                }}>
                <FastImage
                  source={{
                    uri: el.item,
                    priority: FastImage.priority.high,
                  }}
                  style={[styles.image]}
                />
              </TouchableOpacity>
            );
          }}
          numColumns={3}
          keyExtractor={(item) => item}
          style={styles.listContainer}
          contentContainerStyle={styles.listContainerFlexPositioning}
          ref={flatListRef}
        />
      </View>
    </View>
  );
};

export default Collections;

const styles = StyleSheet.create({
  container: {
    ...Layout.pageContainer,
    backgroundColor: Colors.background,
  },
  subContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: statusBarHeight + menuBarHeight,
    paddingBottom: 15,
    position: 'relative',
    zIndex: 1,
    flexGrow: 1,
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
