import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { InfoIcon, AccessTimeIcon, PlaceIcon, AutoAwesomeIcon, ChevronRightIcon } from './icons';
import { LottieAnimation } from './LottieAnimation';
import { LOTTIE_ANIMATIONS } from '../assets/lottie/animations';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { AIRecommendation } from '../utils/gemini';

interface AIRecommendationCardProps {
  recommendation: AIRecommendation | null;
  isLoading?: boolean;
  onPress?: () => void;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  isLoading = false,
  onPress,
}) => {
  const getIcon = () => {
    if (recommendation?.type === 'best_time') return <AccessTimeIcon size={20} color={getColor()} />;
    if (recommendation?.type === 'nearby_attraction') return <PlaceIcon size={20} color={getColor()} />;
    return <AutoAwesomeIcon size={20} color={getColor()} />;
  };

  const getColor = () => {
    if (recommendation?.type === 'best_time') return '#0E7C86';
    if (recommendation?.type === 'nearby_attraction') return '#2176FF';
    return '#ED8936';
  };

  if (isLoading) {
    return (
      <TouchableOpacity
        style={[styles.card, shadows.sm]}
        onPress={onPress}
        disabled
      >
        <View style={styles.loadingContainer}>
          <LottieAnimation
            source={LOTTIE_ANIMATIONS.aiLoading}
            width={40}
            height={40}
            loop={true}
            autoPlay={true}
          />
          <Text style={styles.loadingText}>Generating...</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (!recommendation) {
    return (
      <TouchableOpacity
        style={[styles.card, shadows.sm, { opacity: 0.6 }]}
        onPress={() => {
          // Navigate to settings if API key is missing
          if (onPress) {
            onPress();
          }
        }}
      >
        <View style={styles.emptyContainer}>
          <InfoIcon size={20} color="#666666" />
          <Text style={styles.emptyText}>Tap to configure API key</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, shadows.sm]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: getColor() + '15' }]}>
        {getIcon()}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {recommendation.title}
        </Text>
        <Text style={styles.text} numberOfLines={2}>
          {recommendation.content}
        </Text>
      </View>
      <ChevronRightIcon size={20} color="#666666" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.labelSmall,
    color: '#000000',
    marginBottom: 2,
    fontWeight: '600',
  },
  text: {
    ...typography.bodySmall,
    color: '#666666',
    fontSize: 11,
    lineHeight: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    width: '100%',
  },
  loadingText: {
    ...typography.bodySmall,
    color: '#666666',
    marginLeft: spacing.xs,
    fontSize: 11,
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    width: '100%',
  },
  emptyText: {
    ...typography.bodySmall,
    color: '#666666',
    marginLeft: spacing.xs,
    fontSize: 11,
  },
});

