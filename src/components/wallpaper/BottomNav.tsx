import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  NativeModules,
} from 'react-native';
import IconButton from 'src/ui/components/IconButton';
import {
  Colors,
  menuBarHeight,
  iconSize,
  WindowWidth,
  WindowHeight,
} from 'src/constants';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import AppContext from 'src/AppContext';

function BottomNav({ uri }: { uri: string }) {
  const [localImage, setLocalImage] = useState('');
  const { activeImage, setActiveImage } = useContext(AppContext);

  return (
    <>
      <View style={styles.container}>
        <IconButton
          icon="save"
          label="Save to Gallery"
          action={() => {
            console.log('save!');
          }}
          primary
        />
        <IconButton
          icon="crop"
          label="Edit Default Crop"
          action={async () => {
            console.log('crop!');
            await ImagePicker.openCropper({
              path: uri,
              width: WindowWidth,
              height: WindowHeight,
              cropperToolbarTitle: 'Edit Image',
              cropperToolbarColor: '#FFFFFF',
              showCropFrame: false,
              disableCropperColorSetters: false,
              showCropGuidelines: false,
              hideBottomControls: true,
              compressImageQuality: 1,
            })
              .then((image) => {
                console.log(image);
                setActiveImage((prevState) => {
                  const newState = { ...prevState };
                  newState.edited = image.path;
                  return newState;
                });
              })
              .catch((e) => console.log(e));
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
      {/* <View>
        {localImage ? <FastImage source={{ uri: localImage }} /> : null}
      </View> */}
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
