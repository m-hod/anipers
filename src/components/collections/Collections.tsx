import {
  Colors,
  Fonts,
  Layout,
  WindowHeight,
  WindowWidth,
  menuBarHeight,
  statusBarHeight,
} from 'src/constants';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';

import AppContext from 'src/AppContext';
import ImmersiveMode from 'react-native-immersive-mode';
import { RootStackParamList } from 'src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import TopNav from '../search/TopNav';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<RootStackParamList, 'thumbnails'>;

const Collections = () => {
  const navigation = useNavigation<NavigationProps>();

  const { savedImages } = useContext(AppContext);
  const flatListRef = useRef(null);

  useEffect(() => {
    ImmersiveMode.setBarMode('Normal');
  }, []);

  return (
    <View style={styles.container}>
      <TopNav folderActive />
      <View style={styles.subContainer}>
        {savedImages && Object.keys(savedImages).length ? (
          <FlatList
            data={[...Object.keys(savedImages).map((key) => savedImages[key])]}
            renderItem={(el) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('wallpaper', {
                      image: el.item,
                      type: 'saved',
                    });
                  }}>
                  <Image
                    source={{
                      uri: el.item.cropped_file_url
                        ? el.item.cropped_file_url
                        : el.item.file_url,
                    }}
                    style={[styles.image]}
                  />
                </TouchableOpacity>
              );
            }}
            numColumns={3}
            keyExtractor={(item) => item.file_url}
            style={styles.listContainer}
            contentContainerStyle={styles.listContainerFlexPositioning}
            ref={flatListRef}
          />
        ) : (
          <View style={styles.centerContainer}>
            <Text style={Fonts.regular}>
              When you save an image it will appear here
            </Text>
          </View>
        )}
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
    paddingBottom: 60,
    position: 'relative',
    zIndex: 1,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    flexGrow: 1,
    paddingBottom: menuBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
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
