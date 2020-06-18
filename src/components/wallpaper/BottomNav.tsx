import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ToastAndroid,
  PixelRatio,
  Animated,
} from 'react-native';
import IconButton from 'src/ui/components/IconButton';
import {
  Colors,
  menuBarHeight,
  WindowWidth,
  WindowHeight,
  downloadsDirectoryPath,
  dbKey,
} from 'src/constants';
import ImagePicker from 'react-native-image-crop-picker';
import AppContext from 'src/AppContext';
import {
  BooruResponsePost,
  ActiveImage,
  ImageType,
  StorageItems,
  WallpaperMode,
} from 'src/types';
import RNFS from 'react-native-fs';
import { parseFileUrl } from 'src/utils';
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';
import AsyncStorage from '@react-native-community/async-storage';
import useFadeAnimation from 'src/hooks/useFadeAnimation';
import { useNavigation } from '@react-navigation/native';

function BottomNav({
  image,
  fullscreen,
  type,
}: {
  image: ImageType;
  fullscreen: boolean;
  type: WallpaperMode;
}) {
  const navigation = useNavigation();
  const [metadataVisibility, setMetadataVisibility] = useState(false);
  const {
    activeImage,
    setActiveImage,
    setSearchResultImages,
    savedImages,
    setSavedImages,
    setHomeImages,
  } = useContext(AppContext);
  const fadeAnim = useFadeAnimation(fullscreen);

  return (
    <>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <IconButton
          icon="get-app"
          label="Download"
          action={() => {
            RNFS.downloadFile({
              fromUrl: activeImage!.file_url,
              toFile: `${downloadsDirectoryPath}/${parseFileUrl(
                activeImage!.file_url,
              )}`,
            }).promise.then((res) => {
              if (res.statusCode === 200) {
                ToastAndroid.show('Downloaded', 5);
              } else {
                ToastAndroid.show('Error', 5);
              }
            });
          }}
          primary
        />
        <IconButton
          icon="save"
          label="Save to Gallery"
          action={() => {
            if (savedImages && !!savedImages[activeImage!.file_url]) {
              (async () => {
                try {
                  const db = await AsyncStorage.getItem(dbKey);
                  const data = JSON.parse(db!);
                  const {
                    [activeImage!.file_url]: removedImage,
                    ...rest
                  } = data;
                  try {
                    await AsyncStorage.setItem(dbKey, JSON.stringify(rest));
                    const _db = await AsyncStorage.getItem(dbKey);
                    const updatedData = JSON.parse(_db!);
                    setSavedImages(updatedData);
                    if (type === 'saved') {
                      navigation.goBack();
                    }
                    ToastAndroid.show('Removed', 5);
                  } catch (e) {
                    ToastAndroid.show('Error', 5);
                  }
                } catch (e) {
                  ToastAndroid.show('Error', 5);
                }
              })();
            } else {
              (async () => {
                try {
                  const db = await AsyncStorage.getItem(dbKey);
                  const data = JSON.parse(db!);
                  data[activeImage!.file_url] = activeImage;
                  try {
                    await AsyncStorage.setItem(dbKey, JSON.stringify(data));
                    const _db = await AsyncStorage.getItem(dbKey);
                    const updatedData = JSON.parse(_db!);
                    setSavedImages(updatedData);
                    ToastAndroid.show('Saved', 5);
                  } catch (e) {
                    ToastAndroid.show('Error', 5);
                  }
                } catch (e) {
                  ToastAndroid.show('Error', 5);
                }
              })();
            }
          }}
          primary
          variant={
            savedImages && !!savedImages[activeImage!.file_url]
              ? 'saved'
              : undefined
          }
        />
        <IconButton
          icon="crop"
          label="Edit Crop"
          action={async () => {
            // if mode = saved, need to save updated crop to db
            if (activeImage?.cropped_file_url) {
              setActiveImage((prevState: ImageType) => {
                const { cropped_file_url, ...rest } = prevState;
                const newState = { ...rest };
                return newState;
              });
              if (type === 'search') {
                setSearchResultImages((prevState: Map<string, ImageType>) => {
                  const newState = new Map([...prevState]);
                  const { cropped_file_url, ...rest } = newState.get(
                    activeImage!.file_url,
                  )!;
                  newState.set(activeImage!.file_url, {
                    ...rest,
                  });
                  return newState;
                });
                ToastAndroid.show('Removed Crop', 5);
              }
              if (type === 'home') {
                setHomeImages((prevState: Map<string, ImageType>) => {
                  const newState = new Map([...prevState]);
                  const { cropped_file_url, ...rest } = newState.get(
                    activeImage!.file_url,
                  )!;
                  newState.set(activeImage!.file_url, {
                    ...rest,
                  });
                  return newState;
                });
                ToastAndroid.show('Removed Crop', 5);
              }
              if (type === 'saved') {
                (async () => {
                  try {
                    const db = await AsyncStorage.getItem(dbKey);
                    const data = JSON.parse(db!);
                    const { cropped_file_url, ...rest } = data[
                      activeImage!.file_url
                    ];
                    data[activeImage!.file_url] = rest;
                    try {
                      await AsyncStorage.setItem(dbKey, JSON.stringify(data));
                      const _db = await AsyncStorage.getItem(dbKey);
                      const updatedData = JSON.parse(_db!);
                      setSavedImages(updatedData);
                      ToastAndroid.show('Removed Crop', 5);
                    } catch (e) {
                      ToastAndroid.show('Error', 5);
                    }
                  } catch (e) {
                    ToastAndroid.show('Error', 5);
                  }
                })();
              }
              ToastAndroid.show('Crop removed', 5);
              return;
            }
            await ImagePicker.openCropper({
              path: activeImage!.file_url,
              width: WindowWidth * PixelRatio.get(),
              height: WindowHeight * PixelRatio.get(),
              cropperToolbarTitle: 'Edit Image',
              cropperToolbarColor: '#FFFFFF',
              //@ts-ignore
              showCropFrame: false,
              disableCropperColorSetters: false,
              showCropGuidelines: false,
              hideBottomControls: true,
              compressImageQuality: 1,
            })
              // if mode = saved, need to save updated crop to db
              .then((_image: any) => {
                console.log(type);
                setActiveImage((prevState: ImageType) => {
                  const newState = { ...prevState };
                  newState.cropped_file_url = _image.path;
                  return newState;
                });
                if (type === 'search') {
                  setSearchResultImages((prevState: Map<string, ImageType>) => {
                    const newState = new Map(prevState);
                    newState.set(activeImage!.file_url, {
                      ...newState.get(activeImage!.file_url)!,
                      cropped_file_url: _image.path,
                    });
                    return newState;
                  });
                }
                if (type === 'home') {
                  setHomeImages((prevState: Map<string, ImageType>) => {
                    const newState = new Map(prevState);
                    newState.set(activeImage!.file_url, {
                      ...newState.get(activeImage!.file_url)!,
                      cropped_file_url: _image.path,
                    });
                    return newState;
                  });
                }
                if (type === 'saved') {
                  (async () => {
                    try {
                      const db = await AsyncStorage.getItem(dbKey);
                      const data = JSON.parse(db!);
                      data[activeImage!.file_url] = {
                        ...data[activeImage!.file_url],
                        cropped_file_url: _image.path,
                      };
                      try {
                        await AsyncStorage.setItem(dbKey, JSON.stringify(data));
                        const _db = await AsyncStorage.getItem(dbKey);
                        const updatedData = JSON.parse(_db!);
                        setSavedImages(updatedData);
                      } catch (e) {
                        ToastAndroid.show('Error', 5);
                      }
                    } catch (e) {
                      ToastAndroid.show('Error', 5);
                    }
                  })();
                }
              })
              .catch((e: Error) => console.log(e));
          }}
          primary
          variant={activeImage?.cropped_file_url ? 'saved' : undefined}
        />
        <IconButton
          icon="wallpaper"
          label="Set as Wallpaper"
          action={() => {
            ManageWallpaper.setWallpaper(
              {
                uri: activeImage!.cropped_file_url
                  ? activeImage!.cropped_file_url
                  : activeImage!.file_url,
              },
              (res: any) => {
                if (res.status === 'success') {
                  ToastAndroid.show('Wallpaper Set', 5);
                } else {
                  ToastAndroid.show('Error', 5);
                }
              },
              TYPE.HOME,
            );
          }}
          primary
        />
      </Animated.View>
    </>
  );
}

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    height: menuBarHeight,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    marginBottom:
      Dimensions.get('screen').height - Dimensions.get('window').height,
  },
});
