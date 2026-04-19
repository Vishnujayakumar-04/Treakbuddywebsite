import React from 'react';
import { BaseIcon } from './BaseIcon';
import { iconColors } from '../../theme/icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Arrow Back Icon
export const ArrowBackIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Arrow Forward Icon
export const ArrowForwardIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Place/Location Icon
export const PlaceIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.red }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={2} fill="none" />
  </BaseIcon>
);

// Map Icon
export const MapIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.blue }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M8 2V18M16 6V22" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Phone Icon
export const PhoneIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Share Icon
export const ShareIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Key Icon
export const KeyIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="8" cy="15" r="3" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M11 15L21 5M16 1L21 5L19 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Check Icon (Simple)
export const CheckIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Info Icon
export const InfoIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.blue }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Account Circle Icon
export const AccountCircleIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Circle cx="12" cy="8" r="3" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M6 20C6 16 8.68629 13 12 13C15.3137 13 18 16 18 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Logout Icon
export const LogoutIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.red }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M16 17L21 12L16 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M21 12H9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Local Offer/Tag Icon
export const LocalOfferIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.yellow }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M20.59 13.41L13.42 6.24C12.85 5.67 12 5.67 11.42 6.24L6.24 11.42C5.67 12 5.67 12.85 6.24 13.42L13.42 20.59C14 21.17 14.85 21.17 15.42 20.59L20.59 15.42C21.17 14.85 21.17 14 20.59 13.41Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Circle cx="9" cy="9" r="1.5" fill={color} />
  </BaseIcon>
);

// Access Time/Clock Icon (Small)
export const AccessTimeIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Auto Awesome/Sparkle Icon
export const AutoAwesomeIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.yellow }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M12 2L13.09 8.26L19.35 9.35L13.09 10.44L12 16.7L10.91 10.44L4.65 9.35L10.91 8.26L12 2Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M19 19L20.09 21.26L22.35 22.35L20.09 23.44L19 25.7L17.91 23.44L15.65 22.35L17.91 21.26L19 19Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Account Balance Wallet Icon
export const AccountBalanceWalletIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.yellow }) => (
  <BaseIcon size={size} color={color}>
    <Rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M2 10H22" stroke={color} strokeWidth={2} />
    <Circle cx="16" cy="13" r="2" stroke={color} strokeWidth={2} fill="none" />
  </BaseIcon>
);

// Chevron Right Icon
export const ChevronRightIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </BaseIcon>
);

// Error Outline Icon
export const ErrorOutlineIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.red }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12 8V12M12 16H12.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Filter Icon
export const FilterIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M3 6H21M7 12H17M11 18H13" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Language Icon
export const LanguageIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

// Menu Icon (3 lines/hamburger)
export const MenuIcon: React.FC<IconProps> = ({ size = 24, color = iconColors.teal }) => (
  <BaseIcon size={size} color={color}>
    <Path d="M3 12H21M3 6H21M3 18H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </BaseIcon>
);

