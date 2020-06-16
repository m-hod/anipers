import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Dimensions, View, ToastAndroid } from 'react-native';
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
  const [metadataVisibility, setMetadataVisibility] = useState(false);
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
        {/* <IconButton
          icon="info"
          label="Metadata"
          action={() => {
            setMetadataVisibility(!metadataVisibility);
          }}
          primary={metadataVisibility}
        /> */}
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
              console.log(res);
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
      </View>
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
