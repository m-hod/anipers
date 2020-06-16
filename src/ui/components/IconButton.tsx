import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, iconSize } from 'src/constants';
import ToolTipModal from '../modals/ToolTipModal';

function IconButton({
  icon,
  label,
  size,
  action,
  primary,
  disabled,
  variant,
}: {
  icon: string;
  label: string;
  size?: number;
  action: Function;
  primary?: boolean;
  disabled?: boolean;
  variant?: 'saved' | undefined;
}) {
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  return (
    <>
      <TouchableOpacity
        onLongPress={() => {
          ToastAndroid.show(label, 5);
          // setTooltipVisibility(true);
        }}
        // onPressOut={() => {
        //   setTooltipVisibility(false);
        // }}
        onPress={() => {
          if (disabled) return;
          action();
        }}>
        <Icon
          name={icon}
          style={[
            styles.icon,
            primary && styles.iconActive,
            disabled && styles.iconInactive,
            variant && styles[variant],
          ]}
          size={size ? size : iconSize}
        />
      </TouchableOpacity>
      {/* <ToolTipModal label={label} visibility={isTooltipVisible} /> */}
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
  iconInactive: {
    color: Colors.iconColorInactive,
  },
  saved: {
    color: Colors.iconColorSavedActive,
  },
});
