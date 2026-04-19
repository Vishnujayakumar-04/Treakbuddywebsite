import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Share,
  Image,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { ArrowBackIcon, PlaceIcon, AccessTimeIcon, LocalOfferIcon, PhoneIcon, MapIcon, ShareIcon, HeartIcon, HeartStrokeIcon } from '../components/icons';
import { Place } from '../utils/api';
import { saveFavorite, removeFavorite, isFavorite } from '../utils/storage';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface PlaceDetailsScreenProps {
  route?: {
    params?: {
      place?: Place;
    };
  };
  navigation?: any;
}

export default function PlaceDetailsScreen({
  route,
  navigation,
}: PlaceDetailsScreenProps) {
  const place = route?.params?.place as Place | undefined;

  // Extract extra category-specific data
  const params = route?.params || {};
  const { place: _p, ...otherParams } = params as any;
  const extraDataKey = Object.keys(otherParams)[0];
  const extraData = extraDataKey ? otherParams[extraDataKey] : null;

  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFavoriteStatus();
  }, [place?.id]);

  const checkFavoriteStatus = async () => {
    if (!place?.id) {
      setLoading(false);
      return;
    }
    try {
      const isFav = await isFavorite(place.id);
      setFavorited(isFav);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!place) return;

    try {
      if (favorited) {
        await removeFavorite(place.id);
        setFavorited(false);
      } else {
        await saveFavorite(place);
        setFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite. Please try again.');
    }
  };

  if (!place) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Place details not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleOpenMap = () => {
    if (place.mapUrl) {
      Linking.openURL(place.mapUrl).catch(() => {
        alert('Unable to open maps');
      });
    }
  };

  const handleCall = () => {
    if (place.phone) {
      Linking.openURL(`tel:${place.phone}`).catch(() => {
        alert('Unable to make call');
      });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${place.name}!\n\n${place.description}\n\nOpening: ${place.opening}\nRating: ⭐ ${place.rating}`,
        title: place.name,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Utility to format camelCase to Title Case
  const formatLabel = (key: string) => {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const renderGenericData = (data: any, depth = 0) => {
    if (!data) return null;

    // Ignore keys handled by generic place interface
    const excludedKeys = ['id', 'name', 'nameTamil', 'category', 'location', 'address', 'mapsUrl', 'coordinates', 'images', 'rating', 'description', 'entryFee', 'openingTimeWeekdays', 'closingTimeWeekdays', 'openingTimeWeekends', 'closingTimeWeekends', 'phoneNumber', 'emergencyContact', 'type', 'phone', 'opening'];

    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs }}>
          {data.map((item, index) => (
            <View key={index} style={{ backgroundColor: '#F0F9FF', paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.full, borderWidth: 1, borderColor: '#BAE6FD' }}>
              <Text style={{ ...typography.bodySmall, color: '#0369A1' }}>{item}</Text>
            </View>
          ))}
        </View>
      );
    } else if (typeof data === 'object') {
      return Object.entries(data).map(([key, value]) => {
        if (depth === 0 && excludedKeys.includes(key)) return null;
        if (value === null || value === undefined) return null;
        if (Array.isArray(value) && value.length === 0) return null;
        if (typeof value === 'object' && Object.keys(value).length === 0) return null;

        return (
          <View key={key} style={{ marginTop: spacing.md }}>
            <Text style={{ ...typography.labelMedium, color: '#000000', marginBottom: spacing.xs }}>
              {formatLabel(key)}
            </Text>
            {renderGenericData(value, depth + 1)}
          </View>
        );
      });
    } else if (typeof data === 'boolean') {
      return <Text style={{ ...typography.bodySmall, color: '#666666', lineHeight: 20 }}>{data ? 'Yes' : 'No'}</Text>;
    } else {
      return <Text style={{ ...typography.bodySmall, color: '#666666', lineHeight: 20 }}>{String(data)}</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <TouchableOpacity
            style={styles.backNav}
            onPress={() => navigation?.goBack()}
          >
            <ArrowBackIcon size={22} color="#0E7C86" />
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            {place.image ? (
              <Image source={typeof place.image === 'number' ? place.image : { uri: place.image }} style={styles.heroImageCover} resizeMode="cover" />
            ) : (
              <View style={styles.fallbackHero} />
            )}
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {place.rating}</Text>
          </View>

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
            disabled={loading}
          >
            {favorited ? (
              <HeartIcon size={24} color="#E84A4A" />
            ) : (
              <HeartStrokeIcon size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Place Name */}
          <Text style={styles.placeName}>{place.name}</Text>

          {/* Address */}
          {place.address && (
            <View style={styles.infoBlock}>
              <PlaceIcon size={20} color="#666666" />
              <Text style={styles.infoValue}>{place.address}</Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>About</Text>
            {typeof place.description === 'string' ? (
              <Text style={styles.description}>{place.description}</Text>
            ) : (
              renderGenericData(place.description)
            )}
          </View>

          {/* Opening Hours */}
          <View style={styles.infoCard}>
            <AccessTimeIcon size={20} color="#666666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Opening Hours</Text>
              <Text style={styles.infoValue}>{place.opening}</Text>
            </View>
          </View>

          {/* Entry Fee */}
          <View style={styles.infoCard}>
            <LocalOfferIcon size={20} color="#666666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Entry Fee</Text>
              <Text style={styles.infoValue}>{place.entryFee}</Text>
            </View>
          </View>

          {/* Contact */}
          {place.phone && (
            <View style={styles.infoCard}>
              <PhoneIcon size={20} color="#666666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Contact</Text>
                <Text style={styles.infoValue}>{place.phone}</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.mapButton, shadows.md]}
              onPress={handleOpenMap}
            >
              <MapIcon size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>Open Maps</Text>
            </TouchableOpacity>

            {place.phone && (
              <TouchableOpacity
                style={[styles.actionButton, styles.callButton, shadows.md]}
                onPress={handleCall}
              >
                <PhoneIcon size={20} color="#FFFFFF" />
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton, shadows.md]}
              onPress={handleShare}
            >
              <ShareIcon size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Extra Data Section */}
          {extraData && (
            <View style={{ marginTop: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
              <Text style={{ ...typography.h3, color: '#000000', marginBottom: spacing.sm }}>More Information</Text>
              {renderGenericData(extraData)}
            </View>
          )}

          {/* Extra Spacing */}
          <View style={{ height: spacing.lg }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  backNav: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + spacing.sm,
    left: spacing.sm,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  backNavText: {
    ...typography.h3,
    color: '#0E7C86',
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImageCover: {
    width: '100%',
    height: '100%',
  },
  fallbackHero: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: '#0E7C86',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    ...shadows.sm,
  },
  favoriteButton: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
    zIndex: 10,
  },
  rating: {
    ...typography.labelMedium,
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  placeName: {
    ...typography.h3,
    color: '#000000',
    marginBottom: spacing.sm,
  },
  descriptionContainer: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.labelLarge,
    color: '#000000',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: '#666666',
    lineHeight: 20,
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.xs,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  infoValue: {
    ...typography.bodySmall,
    color: '#666666',
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
    alignItems: 'center',
    ...shadows.sm,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  infoLabel: {
    ...typography.labelSmall,
    color: '#000000',
    marginBottom: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginVertical: spacing.md,
    gap: spacing.xs,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButton: {
    backgroundColor: '#0E7C86',
  },
  callButton: {
    backgroundColor: '#48BB78',
  },
  shareButton: {
    backgroundColor: '#2176FF',
  },
  actionIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  actionText: {
    ...typography.labelSmall,
    color: '#FFFFFF',
    fontSize: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.h3,
    color: '#666666',
    marginBottom: spacing.md,
  },
  backButton: {
    backgroundColor: '#0E7C86',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  backButtonText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
  },
});
