import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { iconColors, iconStroke } from '../../theme/icons';

interface BaseIconProps {
  size?: number;
  color?: string;
  children: React.ReactNode;
}

export const BaseIcon: React.FC<BaseIconProps> = ({
  size = 24,
  color = iconColors.teal,
  children,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {children}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Helper to create path with consistent stroke
export const createPath = (d: string, color: string = iconColors.teal) => (
  <Path
    d={d}
    stroke={color}
    strokeWidth={iconStroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
);

