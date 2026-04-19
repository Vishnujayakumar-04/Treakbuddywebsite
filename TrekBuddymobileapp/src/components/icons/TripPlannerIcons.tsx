import React from 'react';
import { BaseIcon } from './BaseIcon';
import { iconColors } from '../../theme/icons';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Calendar Large Icon (Header)
export const CalendarLargeIcon: React.FC<IconProps> = ({ size = 48, color = iconColors.blue }) => (
  <BaseIcon size={size} color={color}>
    <Rect x="4" y="6" width="16" height="14" rx="2" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M8 2V6M16 2V6M4 10H20" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01M16 18H16.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Minus Button Icon
export const MinusIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M8 12H16" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Plus Button Icon
export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12 8V16M8 12H16" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Checkmark Icon
export const CheckmarkIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

