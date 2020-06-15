import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
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
} from 'src/types';
import RNFS from 'react-native-fs';
import { parseFileUrl } from 'src/utils';
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';
import AsyncStorage from '@react-native-community/async-storage';

function BottomNav({ image }: { image: ImageType }) {
  const {
    activeImage,
    setActiveImage,
    setSearchResultImages,
    savedImages,
    setSavedImages,
  } = useContext(AppContext);

  return (
    <>
      <View style={styles.container}>
        <IconButton
          icon="get-app"
          label="Download"
          action={() => {
            RNFS.downloadFile({
              fromUrl: activeImage!.file_url,
              toFile: `${downloadsDirectoryPath}/${parseFileUrl(
                activeImage!.file_url,
              )}`,
            });
          }}
          primary
        />
        <IconButton
          icon="save"
          label="Save to Gallery"
          action={() => {
            (async () => {
              try {
                const db = await AsyncStorage.getItem(dbKey);
                const data = JSON.parse(db!);
                data[activeImage!.file_url] = activeImage;
                try {
                  await AsyncStorage.setItem(dbKey, JSON.stringify(data));
                  console.log('Updated db');
                  const _db = await AsyncStorage.getItem(dbKey);
                  const updatedData = JSON.parse(_db!);
                  setSavedImages(updatedData);
                } catch (e) {
                  console.log('error updating database', e);
                }
              } catch (e) {
                console.log('error retrieving database', e);
              }
            })();
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
            await ImagePicker.openCropper({
              path: activeImage!.file_url,
              //@ts-ignore
              width:
                // image.image_width /
                WindowWidth,
              //@ts-ignore
              height:
                // image.image_height /
                WindowHeight,
              cropperToolbarTitle: 'Edit Image',
              cropperToolbarColor: '#FFFFFF',
              //@ts-ignore
              showCropFrame: false,
              disableCropperColorSetters: false,
              showCropGuidelines: false,
              hideBottomControls: true,
              compressImageQuality: 1,
            })
              .then((_image: any) => {
                setActiveImage((prevState: ImageType) => {
                  const newState = { ...prevState };
                  newState.cropped_file_url = _image.path;
                  return newState;
                });
                setSearchResultImages((prevState: Map<string, ImageType>) => {
                  const newState = new Map(prevState);
                  newState.set(activeImage!.file_url, {
                    ...newState.get(activeImage!.file_url)!,
                    cropped_file_url: _image.path,
                  });
                  return newState;
                });
              })
              .catch((e: Error) => console.log(e));
          }}
          primary
        />
        <IconButton
          icon="wallpaper"
          label="Set as Wallpaper"
          action={() => {
            ManageWallpaper.setWallpaper(
              { uri: activeImage!.file_url },
              (res: any) => {
                console.log(res);
              },
              TYPE.HOME,
            );
          }}
          primary
        />
      </View>
    </>
  );
}

// bottom nav needs to update images on scroll
// take cropped file url for actions if there is one - maybe fix quality loss bug before implementing this?
// setting as wallpaper saves reference by default

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
