import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { ArrowBackIcon, LocalOfferIcon, AccessTimeIcon } from '../components/icons';
import { getCategoryData, Place } from '../utils/api';
import { addVisitedCategory } from '../utils/storage';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { getCategoryImage } from '../data/categoryImages';


const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface CategoryScreenProps {
  route?: {
    params?: {
      category?: string;
    };
  };
  navigation?: any;
}

export default function CategoryScreen({ route, navigation }: CategoryScreenProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const category = route?.params?.category || 'beaches';

  // Animation for header
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    let isMounted = true;

    // Animate header entrance
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(headerTranslateY, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Load category data
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getCategoryData(category);
        if (isMounted) {
          setPlaces(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading category data:', error);
        if (isMounted) {
          setPlaces([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Track visited category for AI recommendations
    if (category) {
      addVisitedCategory(category).catch(() => { });
    }

    return () => {
      isMounted = false;
    };
  }, [category]);

  const handlePlacePress = (place: Place) => {
    navigation?.navigate('PlaceDetails', { place });
  };

  // Animated Place Card Component
  const AnimatedPlaceCard = ({ item, index }: { item: Place; index: number }) => {
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const cardTranslateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          delay: index * 50, // Stagger animation
          useNativeDriver: true,
        }),
        Animated.spring(cardTranslateY, {
          toValue: 0,
          delay: index * 50,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    if (!item) return null;

    return (
      <Animated.View
        style={{
          opacity: cardOpacity,
          transform: [{ translateY: cardTranslateY }],
        }}
      >
        <TouchableOpacity
          style={[styles.card, shadows.md]}
          onPress={() => handlePlacePress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.imageContainer}>
            {item.image ? (
              <Image
                source={typeof item.image === 'number' ? item.image : { uri: item.image }}
                style={styles.imageCover}
                resizeMode="cover"
                onError={() => { }}
                defaultSource={getCategoryImage(category)}
              />
            ) : (
              <Image
                source={getCategoryImage(category)}
                style={styles.imageCover}
                resizeMode="cover"
              />
            )}
            <View style={styles.ratingBadge}>
              <Text style={styles.rating}>⭐ {item.rating ?? 0}</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.placeName} numberOfLines={2}>
              {item.name || 'Unknown Place'}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {typeof item.description === 'string'
                ? (item.description || 'No description available')
                : 'No description available'}
            </Text>

            <View style={styles.infoRow}>
              <LocalOfferIcon size={18} color="#666666" />
              <Text style={[styles.infoText, { marginLeft: spacing.sm }]}>{item.entryFee || 'Free'}</Text>
            </View>

            <View style={styles.infoRow}>
              <AccessTimeIcon size={18} color="#666666" />
              <Text style={[styles.infoText, { marginLeft: spacing.sm }]}>{item.opening || 'Check locally'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderPlaceCard = ({ item, index }: { item: Place; index: number }) => {
    return <AnimatedPlaceCard item={item} index={index} />;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7C86" />
          <Text style={styles.loadingText}>Loading {category}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ArrowBackIcon size={18} color="#0E7C86" />
            <Text style={[styles.backButton, { marginLeft: spacing.sm }]}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
      </Animated.View>

      {/* Place List */}
      {Array.isArray(places) && places.length > 0 ? (
        <FlatList
          data={places}
          renderItem={renderPlaceCard}
          keyExtractor={(item, index) => item?.id || `place-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyTitle}>Coming Soon</Text>
          <Text style={styles.emptyText}>
            We're adding amazing {category} places for you.{'\n'}Check back soon!
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.emptyButtonText}>Explore Other Categories</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    ...typography.labelMedium,
    color: '#0E7C86',
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.h4,
    color: '#000000',
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    fontSize: 48,
  },
  imageCover: {
    width: '100%',
    height: '100%',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: '#0E7C86',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  rating: {
    ...typography.labelSmall,
    color: '#FFFFFF',
    fontSize: 10,
  },
  cardContent: {
    padding: spacing.sm,
  },
  placeName: {
    ...typography.labelLarge,
    color: '#000000',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.sm,
    fontSize: 12,
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  infoLabel: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  infoText: {
    ...typography.bodySmall,
    color: '#666666',
    flex: 1,
    fontSize: 11,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodySmall,
    color: '#666666',
    marginTop: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: '#000000',
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.bodySmall,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: '#0E7C86',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  emptyButtonText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
  },
});
