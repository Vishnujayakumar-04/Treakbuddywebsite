import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * Custom hook for fade-in + slide-up animation
 * @param duration - Animation duration in milliseconds (default: 300)
 * @param delay - Delay before animation starts in milliseconds (default: 0)
 * @returns Animated style object
 */
export const useFadeInAnimation = (duration: number = 300, delay: number = 0) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [duration, delay]);

  return {
    opacity,
    transform: [{ translateY }],
  };
};

