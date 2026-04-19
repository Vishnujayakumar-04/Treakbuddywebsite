import React from 'react';
import { BaseIcon } from './BaseIcon';
import { iconColors } from '../../theme/icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Phone Emergency Icon (Header)
export const PhoneEmergencyIcon: React.FC<IconProps> = ({ size = 48, color = iconColors.red }) => (
  <BaseIcon size={size} color={color}>
    <Path
      d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
  </BaseIcon>
);

// Hospital Icon
export const HospitalIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.red }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M3 21H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M5 21V7C5 5.89543 5.89543 5 7 5H9M5 21V7C5 5.89543 5.89543 5 7 5H9M19 21V7C19 5.89543 18.1046 5 17 5H15M19 21V7C19 5.89543 18.1046 5 17 5H15M9 5H15M9 5V3C9 2.44772 9.44772 2 10 2H14C14.5523 2 15 2.44772 15 3V5M9 5H15M9 21V9H15V21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M12 9V21M9 12H15" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Police Badge Icon
export const PoliceBadgeIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.blue }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} fill="none" />
  </BaseIcon>
);

// Fire Icon
export const FireIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.red }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M8.5 14.5C8.5 17.5376 10.9624 20 14 20C17.0376 20 19.5 17.5376 19.5 14.5C19.5 11.5 14 6 14 6C14 6 8.5 11.5 8.5 14.5Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 12 9 12 9C12 9 10 10.8954 10 12Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Pharmacy Icon
export const PharmacyIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Rect x="4" y="6" width="16" height="14" rx="2" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M9 10H15M12 7V13" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M8 18H16" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

