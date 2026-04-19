import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface AnimatedTabIconProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  focused: boolean;
  iconSize?: number;
}

export const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
  Icon,
  focused,
  iconSize = 28,
}) => {
  const scaleAnim = useRef(new Animated.Value(focused ? 1.15 : 1)).current;

  useEffect(() => {
        Animated.spring(scaleAnim, {
      toValue: focused ? 1.15 : 1,
      tension: 200,
      friction: 8,
          useNativeDriver: true,
    }).start();
  }, [focused, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={[
        styles.iconWrapper,
        focused && styles.iconWrapperActive,
      ]}>
      <Icon
          size={iconSize}
        color={focused ? '#0E7C86' : '#666666'}
      />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iconWrapperActive: {
    backgroundColor: '#0E7C8615',
  },
});
