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
import { BooruResponsePost, ActiveImage } from 'src/types';
import RNFS from 'react-native-fs';
import { parseFileUrl } from 'src/utils';

function BottomNav({ uri }: { uri: string }) {
  const {
    activeImage,
    setActiveImage,
    setImages,
    savedImages,
    setSavedImages,
  } = useContext(AppContext);

  useEffect(() => {
    console.log('active image changed');
  }, [activeImage]);

  return (
    <>
      <View style={styles.container}>
        <IconButton
          icon="get-app"
          label="Download"
          action={() => {
            RNFS.downloadFile({
              fromUrl: activeImage.raw,
              toFile: `${downloadsDirectoryPath}/${parseFileUrl(
                activeImage.raw,
              )}`,
            });
          }}
          primary
        />
        <IconButton
          icon="save"
          label="Save to Gallery"
          action={() => {
            if (savedImages.has(uri)) return;
            RNFS.readFile(referencesFilePath)
              .then((response) => {
                const fileContents = JSON.parse(response);
                const filteredFileContents = new Set(fileContents);
                filteredFileContents.add(activeImage.raw);
                RNFS.writeFile(
                  referencesFilePath,
                  JSON.stringify([...filteredFileContents]),
                )
                  .then((response) => {
                    RNFS.readFile(referencesFilePath).then((response) => {
                      const updatedFileContents = JSON.parse(response);
                      setSavedImages(new Set([...updatedFileContents]));
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              })
              .catch((e) => console.log(e));
          }}
          primary
          variant={savedImages.has(uri) ? 'saved' : undefined}
        />
        <IconButton
          icon="crop"
          label="Edit Crop"
          action={async () => {
            await ImagePicker.openCropper({
              path: activeImage.raw,
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
              .then((image: any) => {
                console.log(image);
                setActiveImage((prevState: ActiveImage) => {
                  const newState = { ...prevState };
                  newState.edited = image.path;
                  return newState;
                });
                setImages((prevState: Map<string, BooruResponsePost>) => {
                  const newState = new Map(prevState);
                  console.log(newState);
                  console.log(
                    newState.set(
                      uri,
                      //@ts-ignore
                      {
                        ...newState.get(uri),
                        file_url: image.path,
                      },
                    ),
                  );
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
            console.log('set as wallpaper!');
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
