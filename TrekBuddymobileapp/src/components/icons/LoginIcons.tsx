import React from 'react';
import { BaseIcon } from './BaseIcon';
import { iconColors } from '../../theme/icons';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Email Envelope Icon
export const EmailIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M3 7L12 13L21 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Password Lock Icon
export const LockIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx="12" cy="16" r="1.5" fill={color} />
  </BaseIcon>
);

// Google Icon (Flat Minimal)
export const GoogleIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.blue }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M12 5C13.6167 5 15.1013 5.55353 16.286 6.52347L19.35 3.45947C17.3887 1.60533 14.8387 0.5 12 0.5C7.30533 0.5 3.16333 3.21447 1.21467 7.09053L4.77067 9.61053C5.61067 6.86347 8.54533 4.75 12 4.75V5Z" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M23.25 12.25C23.25 11.47 23.1747 10.72 23.0347 10H12V14.5H18.2347C17.8887 15.9773 17.0027 17.2147 15.7447 18.0407L19.35 20.9607C21.7747 18.7147 23.25 15.6947 23.25 12.25Z" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M5.26467 14.4295L1.63967 17.3895C3.58933 21.2655 7.73533 24 12.5 24C15.8373 24 18.6947 22.7647 20.6447 20.7647L17.0397 17.8447C15.7817 18.6707 14.2147 19.25 12.5 19.25C9.19533 19.25 6.38067 16.9447 5.26467 14.4295Z" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12.5 4.75C14.2147 4.75 15.7817 5.32933 17.0397 6.15533L20.6447 3.23533C18.6947 1.23533 15.8373 0 12.5 0C7.30533 0 3.16333 2.71447 1.21467 6.59053L4.77067 9.11053C5.88067 6.59533 8.69533 4.75 12.5 4.75Z" stroke={color} strokeWidth={2} fill="none" />
  </BaseIcon>
);

// Facebook Icon (Flat Minimal)
export const FacebookIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.blue }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12 7V17M7 12H17" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M9 9L15 15M15 9L9 15" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

