import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { ArrowBackIcon, PlaceIcon, StarIcon, AccessTimeIcon, AutoAwesomeIcon, InfoIcon, ErrorOutlineIcon, MapIcon } from '../components/icons';
import { AIRecommendation, generateFullAIAnalysis } from '../utils/gemini';
import { getVisitedCategories } from '../utils/storage';
import { getAllPlaces, getCategoryData, Place } from '../utils/api';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { LottieAnimation } from '../components/LottieAnimation';
import { LOTTIE_ANIMATIONS } from '../assets/lottie/animations';

interface AIDetailScreenProps {
  route?: {
    params?: {
      type: 'best_time' | 'nearby_attraction' | 'safety_tip';
      recommendation?: AIRecommendation;
    };
  };
  navigation?: any;
}

export default function AIDetailScreen({ route, navigation }: AIDetailScreenProps) {
  const { type, recommendation } = route?.params || {};
  const [fullAnalysis, setFullAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPlace, setRelatedPlace] = useState<Place | null>(null);

  useEffect(() => {
    loadFullAnalysis();
    const loadRelatedPlace = async () => {
      if (recommendation?.placeId) {
        const allPlaces = await getAllPlaces();
        const place = allPlaces.find(p => p.id === recommendation.placeId);
        if (place) {
          setRelatedPlace(place);
        }
      }
    };
    loadRelatedPlace();
  }, []);

  const loadFullAnalysis = async () => {
    setIsLoading(true);
    try {
      const visitedCategories = await getVisitedCategories();
      const allPlaces = await getAllPlaces();
      const analysis = await generateFullAIAnalysis(type || 'best_time', visitedCategories, allPlaces);
      setFullAnalysis(analysis);
    } catch (error) {
      console.error('Error loading full analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    if (type === 'best_time') return 'Best Time to Visit';
    if (type === 'nearby_attraction') return 'Nearby Attractions';
    return 'Safety & Weather Tips';
  };

  const getIcon = () => {
    if (type === 'best_time') return <AccessTimeIcon size={24} color={getColor()} />;
    if (type === 'nearby_attraction') return <PlaceIcon size={24} color={getColor()} />;
    return <AutoAwesomeIcon size={24} color={getColor()} />;
  };

  const getColor = () => {
    if (type === 'best_time') return '#0E7C86';
    if (type === 'nearby_attraction') return '#2176FF';
    return '#ED8936';
  };

  const handlePlacePress = (place: Place) => {
    navigation?.navigate('PlaceDetails', { place });
  };

  const handleOpenMaps = () => {
    if (relatedPlace?.mapUrl) {
      Linking.openURL(relatedPlace.mapUrl).catch(() => {
        console.error('Unable to open maps');
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <ArrowBackIcon size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.iconContainer, { backgroundColor: getColor() + '15' }]}>
            {getIcon()}
          </View>
          <Text style={styles.headerTitle}>{getTitle()}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Summary */}
        {recommendation && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Quick Summary</Text>
            <Text style={styles.summaryText}>{recommendation.content}</Text>
          </View>
        )}

        {/* Related Place Card */}
        {relatedPlace && (
          <TouchableOpacity
            style={[styles.placeCard, shadows.md]}
            onPress={() => handlePlacePress(relatedPlace)}
            activeOpacity={0.8}
          >
            <View style={styles.placeCardHeader}>
              <PlaceIcon size={20} color="#0E7C86" />
              <Text style={styles.placeCardTitle}>Recommended Place</Text>
            </View>
            <Text style={styles.placeName}>{relatedPlace.name}</Text>
            <Text style={styles.placeDescription} numberOfLines={2}>
              {typeof relatedPlace.description === 'string'
                ? relatedPlace.description
                : (relatedPlace.description as any)?.specialFeatures ?? JSON.stringify(relatedPlace.description)}
            </Text>
            <View style={styles.placeInfo}>
              <View style={styles.placeInfoRow}>
                <StarIcon size={16} color="#F4C430" />
                <Text style={styles.placeInfoText}>{relatedPlace.rating} ⭐</Text>
              </View>
              <View style={styles.placeInfoRow}>
                <AccessTimeIcon size={16} color="#666666" />
                <Text style={styles.placeInfoText}>{relatedPlace.opening}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewPlaceButton}
              onPress={() => handlePlacePress(relatedPlace)}
            >
              <Text style={styles.viewPlaceButtonText}>View Details →</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* Full Analysis */}
        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <AutoAwesomeIcon size={20} color="#0E7C86" />
            <Text style={styles.sectionTitle}>Detailed Analysis</Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LottieAnimation
                source={LOTTIE_ANIMATIONS.aiLoading}
                width={100}
                height={100}
                loop={true}
                autoPlay={true}
              />
              <Text style={styles.loadingText}>Generating detailed analysis...</Text>
            </View>
          ) : fullAnalysis ? (
            <View style={styles.analysisCard}>
              <Text style={styles.analysisText}>{fullAnalysis}</Text>
              <View style={styles.placeholderNote}>
                <InfoIcon size={16} color="#2176FF" />
                <Text style={styles.placeholderNoteText}>
                  This is a placeholder recommendation. Add your Gemini API key in Settings for AI-powered suggestions.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <ErrorOutlineIcon size={24} color="#E84A4A" />
              <Text style={styles.errorText}>
                Unable to generate analysis. Please check your API key in Settings.
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {relatedPlace && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.mapButton, shadows.md]}
              onPress={handleOpenMaps}
            >
              <MapIcon size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.h2,
    color: '#000000',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  summaryTitle: {
    ...typography.h4,
    color: '#000000',
    marginBottom: spacing.sm,
  },
  summaryText: {
    ...typography.bodyMedium,
    color: '#666666',
    lineHeight: 22,
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  placeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  placeCardTitle: {
    ...typography.labelMedium,
    color: '#000000',
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  placeName: {
    ...typography.h4,
    color: '#000000',
    marginBottom: spacing.xs,
  },
  placeDescription: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  placeInfo: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  placeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  placeInfoText: {
    ...typography.bodySmall,
    color: '#666666',
    marginLeft: spacing.xs,
    fontSize: 12,
  },
  viewPlaceButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  viewPlaceButtonText: {
    ...typography.labelMedium,
    color: '#0E7C86',
  },
  analysisSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: '#000000',
    marginLeft: spacing.sm,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.bodyMedium,
    color: '#666666',
    marginTop: spacing.md,
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  analysisText: {
    ...typography.bodyMedium,
    color: '#666666',
    lineHeight: 24,
  },
  errorContainer: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
  },
  errorText: {
    ...typography.bodyMedium,
    color: '#E84A4A',
    textAlign: 'center',
    marginTop: spacing.md,
  },
  placeholderNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: '#2176FF',
  },
  placeholderNoteText: {
    ...typography.bodySmall,
    color: '#666666',
    marginLeft: spacing.xs,
    flex: 1,
    fontSize: 11,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.xs,
  },
  mapButton: {
    backgroundColor: '#0E7C86',
  },
  actionButtonText: {
    ...typography.labelLarge,
    color: '#FFFFFF',
  },
});

