import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import IconButton from 'src/ui/components/IconButton';
import {
  Colors,
  menuBarHeight,
  WindowWidth,
  WindowHeight,
  referencesFilePath,
  downloadsDirectoryPath,
} from 'src/constants';
import ImagePicker from 'react-native-image-crop-picker';
import AppContext from 'src/AppContext';
import { BooruResponsePost, ActiveImage, ImageType } from 'src/types';
import RNFS from 'react-native-fs';
import { parseFileUrl } from 'src/utils';
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';

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
              fromUrl: activeImage?.file_url!,
              toFile: `${downloadsDirectoryPath}/${parseFileUrl(
                activeImage?.file_url!,
              )}`,
            });
          }}
          primary
        />
        <IconButton
          icon="save"
          label="Save to Gallery"
          action={() => {
            if (savedImages.has(image.file_url)) return;
            RNFS.readFile(referencesFilePath)
              .then((response) => {
                const fileContents = JSON.parse(response);
                const filteredFileContents = new Map(
                  fileContents ? fileContents : [],
                );
                filteredFileContents.set(activeImage?.file_url!, activeImage);
                RNFS.writeFile(
                  referencesFilePath,
                  JSON.stringify([...filteredFileContents]),
                )
                  .then((response) => {
                    RNFS.readFile(referencesFilePath).then((_response) => {
                      const updatedFileContents = JSON.parse(_response);
                      setSavedImages(new Map(updatedFileContents));
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              })
              .catch((e) => console.log(e));
          }}
          primary
          variant={savedImages.has(image.file_url) ? 'saved' : undefined}
        />
        <IconButton
          icon="crop"
          label="Edit Crop"
          action={async () => {
            await ImagePicker.openCropper({
              path: activeImage?.file_url!,
              width: WindowWidth,
              height: WindowHeight,
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
                  console.log(newState);
                  newState.cropped_file_url = _image.path;
                  return newState;
                });
                setSearchResultImages((prevState: Map<string, ImageType>) => {
                  const newState = new Map(prevState);
                  console.log(newState);
                  newState.set(image.file_url, {
                    ...newState.get(image.file_url)!,
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
              { uri: image.file_url },
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
