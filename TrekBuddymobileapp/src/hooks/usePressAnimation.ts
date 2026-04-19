import { useRef } from 'react';
import { Animated, Easing, Platform } from 'react-native';

/**
 * Custom hook for press animation with scale and bounce
 * @returns Object with animated style and press handlers
 */
export const usePressAnimation = () => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.1,
        useNativeDriver: true,
        tension: 200,
        friction: 3,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
  };

  return {
    animatedStyle: {
      transform: [{ scale }],
    },
    handlePressIn,
    handlePressOut,
  };
};

