import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Tooltip from './Tooltip';
import Icon from 'react-native-vector-icons/MaterialIcons';

const iconText = new Map()
  .set('save', 'Save to Gallery')
  .set('slideshow', 'Save to Slideshow')
  .set('wallpaper', 'Set as Wallpaper');

function IconButton({ icon }: { icon: string }) {
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  return (
    <Tooltip text={iconText.get(icon)} isVisible={isTooltipVisible}>
      <TouchableOpacity
        onLongPress={() => {
          setTooltipVisibility(true);
        }}
        onPressOut={() => {
          setTooltipVisibility(false);
        }}
        onPress={() => {
          console.log('press');
        }}>
        <Icon name={icon} style={styles.icon} size={32} />
      </TouchableOpacity>
    </Tooltip>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  icon: {
    color: '#FFFFFF',
  },
});
