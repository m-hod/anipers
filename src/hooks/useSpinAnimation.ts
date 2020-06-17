import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const useSpinAnimation = () => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const spinIcon = () => {
      spinAnim.setValue(0);
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spinIcon());
    };
    spinIcon();
    return () => {
      spinAnim.setValue(0);
      spinAnim.stopAnimation();
    };
  }, [spinAnim]);

  return spin;
};

export default useSpinAnimation;
