import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../constants';
import ToolTipModal from '../../modals/ToolTipModal';

function IconButton({
  icon,
  label,
  size,
  action,
  primary,
}: {
  icon: string;
  label: string;
  size: number;
  action: Function;
  primary?: boolean;
}) {
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  return (
    <>
      <TouchableOpacity
        onLongPress={() => {
          setTooltipVisibility(true);
        }}
        onPressOut={() => {
          setTooltipVisibility(false);
        }}
        onPress={() => {
          action();
        }}>
        <Icon
          name={icon}
          style={[styles.icon, primary && styles.iconActive]}
          size={size}
        />
      </TouchableOpacity>
      <ToolTipModal label={label} visibility={isTooltipVisible} />
    </>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  icon: {
    color: Colors.iconColor,
  },
  iconActive: {
    color: Colors.iconColorActive,
  },
});
