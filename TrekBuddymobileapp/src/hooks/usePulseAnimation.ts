import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Custom hook for continuous pulse animation
 * @param minScale - Minimum scale value (default: 0.98)
 * @param maxScale - Maximum scale value (default: 1.02)
 * @param duration - Animation duration in milliseconds (default: 2000)
 * @returns Animated style object
 */
export const usePulseAnimation = (
  minScale: number = 0.98,
  maxScale: number = 1.02,
  duration: number = 2000
) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: maxScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: minScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [minScale, maxScale, duration]);

  return {
    transform: [{ scale }],
  };
};

