import { Colors, iconSize } from 'src/constants';
import { StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';

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
  return (
    <>
      <TouchableOpacity
        onLongPress={() => {
          ToastAndroid.show(label, 5);
        }}
        onPress={() => {
          if (disabled) {
            return;
          }
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
