import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Animated, Dimensions, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius } from '../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CategoryCardProps {
  image: ImageSourcePropType | string;
  label: string;
  onPress: () => void;
  index?: number;
  animated?: boolean;
  emoji?: string;
  count?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  image,
  label,
  onPress,
  index = 0,
  animated = true,
  emoji = '✨',
  count,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animated, index]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.card}>
          {/* Image Background */}
          <Image
            source={typeof image === 'number' ? image : (typeof image === 'string' ? { uri: image } : image)}
            style={styles.image}
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={[
              'rgba(15, 23, 42, 0)',
              'rgba(15, 23, 42, 0.4)',
              'rgba(15, 23, 42, 0.95)',
            ]}
            style={styles.overlay}
          >
            {/* Top Right Count Badge */}
            {count && (
              <View style={styles.topBadgeContainer}>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{count}</Text>
                </View>
              </View>
            )}
            <View style={styles.content}>

              {/* Label */}
              <View style={styles.labelContainer}>
                <View style={{ marginBottom: 6 }}>
                  <Text style={styles.label} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
                    {label}
                  </Text>
                  <View style={styles.underline} />
                </View>

                {/* Arrow CTA */}
                <View style={styles.arrowGroup}>
                  <Text style={styles.exploreText}>EXPLORE</Text>
                  <View style={styles.arrow}>
                    <Text style={styles.arrowIcon}>→</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Shine Effect */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shine}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    height: 180,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  topBadgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  countBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  countText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    padding: spacing.md,
  },
  emojiContainer: {
    marginBottom: spacing.xs,
    transform: [{ rotate: '-12deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emojiText: {
    fontSize: 32,
  },
  labelContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 4,
  },
  underline: {
    height: 3,
    width: 30,
    backgroundColor: '#22d3ee',
    borderRadius: 2,
  },
  arrowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreText: {
    fontSize: 10,
    color: '#22d3ee',
    fontWeight: '800',
    letterSpacing: 1,
  },
  arrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: 14,
    color: '#22d3ee',
    fontWeight: '900',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    transform: [{ skewX: '-20deg' }],
  },
});
