import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const useFadeAnimation = (trigger: boolean) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!fadeAnim) return;
    if (trigger) {
      console.log('fade out');
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
    } else if (!trigger) {
      console.log('fade in');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
    }
  }, [fadeAnim, trigger]);

  return fadeAnim;
};

export default useFadeAnimation;
