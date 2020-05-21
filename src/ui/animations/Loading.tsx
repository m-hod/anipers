import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import useSpinAnimation from 'src/hooks/useSpinAnimation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from 'src/constants';

const Loading = ({
  loadingState,
  size,
}: {
  loadingState: boolean;
  size: number;
}) => {
  const spin = useSpinAnimation();
  return (
    <Animated.View
      style={[
        loadingState && {
          transform: [{ rotate: spin }],
        },
        { width: size },
      ]}>
      <Icon name="refresh" size={size} style={styles.bottomNavIcon} />
    </Animated.View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  bottomNavIcon: {
    color: Colors.iconColorActive,
    marginVertical: 5,
  },
});
