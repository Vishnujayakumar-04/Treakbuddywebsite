import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Animated, Platform, TouchableNativeFeedback, View } from 'react-native';
import { spacing, radius } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { usePressAnimation } from '../../hooks/usePressAnimation';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 48,
  backgroundColor = '#FFFFFF',
  style,
  disabled = false,
}) => {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  const buttonStyle = [
    styles.button,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
    },
    style,
  ];

  const buttonContent = (
    <View style={buttonStyle}>
      {icon}
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <Animated.View style={animatedStyle}>
        <TouchableNativeFeedback
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          background={TouchableNativeFeedback.Ripple('#0F766E40', true, size / 2)}
        >
          {buttonContent}
        </TouchableNativeFeedback>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {icon}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.brand,
  },
});

