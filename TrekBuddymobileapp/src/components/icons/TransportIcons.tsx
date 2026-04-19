import React from 'react';
import { BaseIcon } from './BaseIcon';
import { iconColors } from '../../theme/icons';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Bus Icon (Header)
export const BusIcon: React.FC<IconProps> = ({ size = 48, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Rect x="3" y="6" width="18" height="12" rx="2" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M3 10H21" stroke={color} strokeWidth={2} />
    <Circle cx="7" cy="16" r="2" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="17" cy="16" r="2" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M7 6V4C7 3.44772 7.44772 3 8 3H16C16.5523 3 17 3.44772 17 4V6" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Auto Rickshaw Icon
export const AutoRickshawIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.yellow }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M5 12H19C19.5523 12 20 12.4477 20 13V15C20 15.5523 19.5523 16 19 16H5C4.44772 16 4 15.5523 4 15V13C4 12.4477 4.44772 12 5 12Z" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M8 8H16V12H8V8Z" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="7" cy="18" r="2" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="17" cy="18" r="2" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12 4V8" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Money Coin Icon
export const MoneyCoinIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.yellow }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12 7V9M12 15V17M9 12H11M13 12H15" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M9 9C9 9 10.5 10.5 12 10.5C13.5 10.5 15 9 15 9M9 15C9 15 10.5 13.5 12 13.5C13.5 13.5 15 15 15 15" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Clock Icon
export const ClockIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Refresh Arrows Icon
export const RefreshIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.blue }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
    <Path d="M3 12H7M21 12H17" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M7 8L3 12L7 16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M17 8L21 12L17 16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Bus Route Block Icon (for route numbers like 7A, 1, 5)
export const BusRouteIcon: React.FC<IconProps & { routeNumber?: string }> = ({ 
  size = 32, 
  color = iconColors.blue,
  routeNumber = '1'
}) => (
  <BaseIcon size={size} color={color}>
    <Rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth={2} fill="none" />
  </BaseIcon>
);

