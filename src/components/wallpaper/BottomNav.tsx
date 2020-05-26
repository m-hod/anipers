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
  const { activeImage, setActiveImage, setImages } = useContext(AppContext);

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
            console.log(parseFileUrl(activeImage.raw));
            // check perms? have a listener to check perms?
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
            console.log('save!');
            RNFS.readFile(referencesFilePath)
              .then((response) => {
                const fileContents = JSON.parse(response);
                fileContents.push(activeImage.raw);
                RNFS.writeFile(referencesFilePath, JSON.stringify(fileContents))
                  .then((response) => {
                    console.log(response);
                    RNFS.readFile(referencesFilePath).then((response) => {
                      console.log(JSON.parse(response));
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              })
              .catch((e) => console.log(e));
          }}
          primary
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
    backgroundColor: Colors.menuColor,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
});
