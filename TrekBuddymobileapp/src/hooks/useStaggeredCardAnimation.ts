import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Custom hook for staggered card slide-up animation with fade-in and bounce
 * @param index - Index of the card (for staggered delay)
 * @param delay - Base delay in milliseconds (default: 0)
 * @param staggerDelay - Delay between each card in milliseconds (default: 100)
 * @returns Animated style object
 */
export const useStaggeredCardAnimation = (
  index: number = 0,
  delay: number = 0,
  staggerDelay: number = 100
) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const totalDelay = delay + index * staggerDelay;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay: totalDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: totalDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 300,
          delay: totalDelay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [index, delay, staggerDelay]);

  return {
    opacity,
    transform: [{ translateY }, { scale }],
  };
};

