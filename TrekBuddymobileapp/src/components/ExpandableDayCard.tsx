import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Card } from './ui';
import { ChevronRightIcon } from './icons';
import { DayItinerary, Activity } from '../utils/gemini';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';

interface ExpandableDayCardProps {
  dayItinerary: DayItinerary;
  renderActivity: (activity: Activity, index: number) => React.ReactNode;
}

export const ExpandableDayCard: React.FC<ExpandableDayCardProps> = ({
  dayItinerary,
  renderActivity,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [isMeasuring, setIsMeasuring] = useState(true);
  
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isExpanded && contentHeight > 0) {
      // Expand animation
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: contentHeight,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          delay: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!isExpanded) {
      // Collapse animation
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isExpanded, contentHeight]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height);
      setIsMeasuring(false);
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <Card style={styles.dayCard}>
      {/* Header - Always visible */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.dayTitle}>Day {dayItinerary.day}</Text>
            <Text style={styles.dayDate}>{dayItinerary.date}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.activityCount}>
              {dayItinerary.activities.length} activities
            </Text>
            <Animated.View
              style={[
                styles.chevronContainer,
                { transform: [{ rotate: rotateInterpolate }] },
              ]}
            >
              <ChevronRightIcon size={24} color="#666666" />
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Hidden content for measurement */}
      {isMeasuring && (
        <View
          style={styles.measurementContainer}
          onLayout={handleContentLayout}
        >
          <View style={styles.content}>
            {/* Activities */}
            {dayItinerary.activities.map((activity, index) => (
              <View key={index} style={styles.activityWrapper}>
                {renderActivity(activity, index)}
              </View>
            ))}

            {/* Dining Suggestions */}
            {dayItinerary.diningSuggestions && dayItinerary.diningSuggestions.length > 0 && (
              <View style={styles.diningSection}>
                <Text style={styles.diningTitle}>Dining Suggestions</Text>
                {dayItinerary.diningSuggestions.map((suggestion, idx) => (
                  <Text key={idx} style={styles.diningItem}>• {suggestion}</Text>
                ))}
              </View>
            )}

            {/* Day Cost Summary */}
            <View style={styles.costSummary}>
              <Text style={styles.costLabel}>Day Total: ₹{dayItinerary.totalCost}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Expandable Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            height: heightAnim,
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.content}>
          {/* Activities */}
          {dayItinerary.activities.map((activity, index) => (
            <Animated.View
              key={index}
              style={[
                styles.activityWrapper,
                {
                  opacity: opacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                  transform: [
                    {
                      translateY: opacityAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {renderActivity(activity, index)}
            </Animated.View>
          ))}

          {/* Dining Suggestions */}
          {dayItinerary.diningSuggestions && dayItinerary.diningSuggestions.length > 0 && (
            <Animated.View
              style={[
                styles.diningSection,
                {
                  opacity: opacityAnim,
                },
              ]}
            >
              <Text style={styles.diningTitle}>Dining Suggestions</Text>
              {dayItinerary.diningSuggestions.map((suggestion, idx) => (
                <Text key={idx} style={styles.diningItem}>• {suggestion}</Text>
              ))}
            </Animated.View>
          )}

          {/* Day Cost Summary */}
          <Animated.View
            style={[
              styles.costSummary,
              {
                opacity: opacityAnim,
              },
            ]}
          >
            <Text style={styles.costLabel}>Day Total: ₹{dayItinerary.totalCost}</Text>
          </Animated.View>
        </View>
      </Animated.View>
    </Card>
  );
};

const styles = StyleSheet.create({
  dayCard: {
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    padding: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dayTitle: {
    ...typography.h2,
    color: '#000000',
    marginBottom: spacing.xs,
  },
  dayDate: {
    ...typography.bodyMedium,
    color: '#777777',
  },
  activityCount: {
    ...typography.bodySmall,
    color: '#666666',
  },
  chevronContainer: {
    marginLeft: spacing.xs,
  },
  measurementContainer: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
  },
  contentContainer: {
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  activityWrapper: {
    marginBottom: spacing.md,
  },
  diningSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  diningTitle: {
    ...typography.labelMedium,
    color: '#000000',
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  diningItem: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
  },
  costSummary: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'flex-end',
  },
  costLabel: {
    ...typography.labelLarge,
    color: '#F4C430',
    fontWeight: '700',
  },
});

