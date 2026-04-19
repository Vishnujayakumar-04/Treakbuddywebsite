import React from 'react';
import { BaseIcon } from './BaseIcon';
import { iconColors } from '../../theme/icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Heart Icon (Favorites)
export const HeartIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.red }) => (
  <BaseIcon size={size} color={color}>
    <Path
      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </BaseIcon>
);

// Location Pin Icon
export const LocationPinIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.red }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={2} fill="none" />
  </BaseIcon>
);

// Calendar Icon (Trips Planned)
export const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.blue }) => (
  <BaseIcon size={size} color={color}>
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01M16 18H16.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Clock Icon (Hours Saved)
export const ClockHoursIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.yellow }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Heart Stroke Small
export const HeartStrokeIcon: React.FC<IconProps> = ({ size = 16, color = iconColors.red }) => (
  <BaseIcon size={size} color={color}>
    <Path
      d="M4.318 6.318C3.90017 5.90017 3.5687 5.39723 3.34255 4.83839C3.1164 4.27955 3 3.67522 3 3.065C3 2.45478 3.1164 1.85045 3.34255 1.29161C3.5687 0.732767 3.90017 0.229826 4.318 0.318C4.73583 0.229826 5.23877 0.732767 5.46492 1.29161C5.69107 1.85045 5.80747 2.45478 5.80747 3.065C5.80747 3.67522 5.69107 4.27955 5.46492 4.83839C5.23877 5.39723 4.73583 5.90017 4.318 6.318Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </BaseIcon>
);

// Calendar Minimal
export const CalendarMinimalIcon: React.FC<IconProps> = ({ size = 16, color = iconColors.blue }) => (
  <BaseIcon size={size} color={color}>
    <Rect x="2" y="3" width="12" height="12" rx="1" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M8 1V3M4 7H14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Location Minimal
export const LocationMinimalIcon: React.FC<IconProps> = ({ size = 16, color = iconColors.red }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M8 1C5.79086 1 4 2.79086 4 5C4 7 8 11 8 11C8 11 12 7 12 5C12 2.79086 10.2091 1 8 1Z" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="8" cy="5" r="1.5" fill={color} />
  </BaseIcon>
);

// Star Icon (Famous Places)
export const StarIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.yellow }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Trending Arrow Icon
export const TrendingIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.blue }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M17 6H23V12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

