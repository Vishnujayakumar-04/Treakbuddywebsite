import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, Animated, View } from 'react-native';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { shadows } from '../../theme/shadows';
import { usePulseAnimation } from '../../hooks/usePulseAnimation';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large'; // Deprecated padding logic, we stick to fixed height
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  pulse?: boolean; // Enable pulse animation
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  pulse = false,
}) => {
  const pulseStyle = pulse ? usePulseAnimation(0.98, 1.02, 2000) : null;
  const getBackgroundColor = () => {
    if (disabled) return '#E2E8F0';
    switch (variant) {
      case 'primary':
        return '#0F766E';
      case 'secondary':
        return '#14B8A6';
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return '#0F766E';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#94A3B8';
    if (variant === 'outline' || variant === 'ghost') return '#0F766E';
    return '#FFFFFF';
  };

  // Note: Brand spec says 48 height. We enforce that in style instead of variable padding.
  const getPadding = () => {
    return { paddingHorizontal: spacing.lg }; // strictly 16
  };

  const buttonStyle = [
    styles.button,
    {
      backgroundColor: getBackgroundColor(),
      borderWidth: variant === 'outline' ? 2 : 0,
      borderColor: variant === 'outline' ? '#0E7C86' : 'transparent',
      ...getPadding(),
    },
    style,
  ];

  const ButtonContent = (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Wrap with Animated.View if pulse is enabled
  if (pulse && pulseStyle) {
    return <Animated.View style={pulseStyle}>{ButtonContent}</Animated.View>;
  }

  return ButtonContent;
};

const styles = StyleSheet.create({
  button: {
    height: 48, // Brand strict height
    borderRadius: radius.button, // Brand strict button radius (12)
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  text: {
    ...typography.buttonText,
  },
});

