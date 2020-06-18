import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const useFadeAnimation = (trigger: boolean) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!fadeAnim) return;
    if (trigger) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
    } else if (!trigger) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
    }
  }, [fadeAnim, trigger]);

  return fadeAnim;
};

export default useFadeAnimation;
