import React, { useState } from 'react';
import { ImageType } from 'src/types';
import FastImage from 'react-native-fast-image';
import { BlurView } from '@react-native-community/blur';
import { StyleSheet, View } from 'react-native';
import { Layout, WindowHeight, WindowWidth } from 'src/constants';

function ProgressiveImage({ image }: { image: ImageType }) {
  const [qualDisplayed, setQualDisplayed] = useState(false);
  const [blur, setBlur] = useState(true);
  return (
    <View style={Layout.pageContainer}>
      <FastImage
        source={{ uri: image.preview_file_url }}
        style={[qualDisplayed ? styles.hidden : styles.displayed]}
      />
      {blur && (
        <BlurView
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
          style={[qualDisplayed ? styles.hidden : styles.displayed]}
        />
      )}
      <FastImage
        source={{
          uri: image.cropped_file_url ? image.cropped_file_url : image.file_url,
        }}
        style={[qualDisplayed ? styles.displayed : styles.hidden]}
        onLoad={() => {
          setBlur(false);
          setQualDisplayed(true);
        }}
      />
    </View>
  );
}

export default ProgressiveImage;

const styles = StyleSheet.create({
  pageContainer: {
    position: 'relative',
  },
  hidden: {
    ...Layout.pageContainer,

    position: 'absolute',
    zIndex: 1,
  },
  displayed: {
    ...Layout.pageContainer,

    position: 'absolute',
    zIndex: 2,
  },
  full: {
    ...Layout.pageContainer,
  },
  thumb: {
    height: WindowHeight / 3.25,
    width: WindowWidth / 3.25,
    margin: 2,
  },
});
