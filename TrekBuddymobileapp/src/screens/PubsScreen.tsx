import React, { useEffect, useState } from 'react';
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
  ScrollView,
  Modal,
} from 'react-native';
import { ArrowBackIcon } from '../components/icons';
import { Place } from '../utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { FilterPills } from '../components/ui';

// Import pubs data
import pubsData from '../data/pubs';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

type Language = 'English' | 'Tamil';
type PubCategory = 'All' | 'Pub' | 'Bar' | 'Lounge Bar' | 'Live Music Bar' | 'Dance Club';

interface PubPlace {
  id: string;
  name: string;
  nameTamil?: string;
  category: string;
  location: string;
  address: string;
  mapsUrl: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  openingTimeWeekdays?: string;
  closingTimeWeekdays?: string;
  openingTimeWeekends?: string;
  closingTimeWeekends?: string;
  image?: string;

  // Old format description
  description?: any;

  // New JSON Fields
  musicType?: string;
  musicGenre?: string;
  area?: string;
  phone?: string;
  openTime?: string;
  closeTime?: string;
  happyHours?: string;
  ageRestriction?: string;
  bestDays?: string;
  bestTime?: string;
  bestFor?: string;
  notes?: string;
  djOrLive?: string;
  ambienceType?: string;
  rooftop?: boolean;
  touristFriendly?: boolean;
  alcoholServed?: string[];
  liveDays?: string;

  images?: string[];
  entryFee?: string;
  dressCode?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  crowdLevel?: string;
  famousThings?: string[];
  famousMonths?: string;
  famousMonthsTamil?: string;
  rating?: number;
}

interface PubsScreenProps {
  navigation?: any;
}

const PUB_CATEGORIES: { id: PubCategory; label: string; labelTamil: string; image: string }[] = [
  {
    id: 'Pub',
    label: 'Pubs',
    labelTamil: 'பப்கள்',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'
  },
  {
    id: 'Bar',
    label: 'Bars',
    labelTamil: 'பார்கள்',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'
  },
  {
    id: 'Lounge Bar',
    label: 'Lounge Bars',
    labelTamil: 'லவுஞ்ச் பார்கள்',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800'
  },
  {
    id: 'Live Music Bar',
    label: 'Live Music Bars',
    labelTamil: 'நேரடி இசை பார்கள்',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
  },
  {
    id: 'Dance Club',
    label: 'Dance Clubs',
    labelTamil: 'நடன கிளப்புகள்',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
  },
];

export default function PubsScreen({ navigation }: PubsScreenProps) {
  const [places, setPlaces] = useState<PubPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<PubPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PubCategory>('All');
  const [showCategoryView, setShowCategoryView] = useState(true);
  const [language, setLanguage] = useState<Language>('English');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = pubsData as PubPlace[];
        if (isMounted) {
          setPlaces(Array.isArray(data) ? data : []);
          setFilteredPlaces(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading pubs places:', error);
        if (isMounted) {
          setPlaces([]);
          setFilteredPlaces([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let filtered = [...places];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredPlaces(filtered);
  }, [selectedCategory, places]);

  const handleCategoryPress = (category: PubCategory) => {
    setSelectedCategory(category);
    setShowCategoryView(false);
  };

  const handlePlacePress = (place: PubPlace) => {
    const placeForDetails: Place = {
      id: place.id,
      name: getDisplayName(place),
      image: place.image || (place.images && place.images.length > 0 ? place.images[0] : ''),
      description: getDisplayDescription(place),
      opening: place.openTime ? `${place.openTime} - ${place.closeTime}` : (place.openingTimeWeekdays ? `${place.openingTimeWeekdays} - ${place.closingTimeWeekdays}` : 'Open Nightly'),
      entryFee: place.entryFee || 'Varies',
      rating: place.rating || 0,
      mapUrl: place.mapsUrl,
      phone: place.phone || place.phoneNumber || '',
      category: place.category.toLowerCase(),
    };
    navigation?.navigate('PlaceDetails', { place: placeForDetails, pubPlace: place });
  };

  const getDisplayName = (place: PubPlace): string => {
    if (language === 'Tamil' && place.nameTamil) {
      return place.nameTamil;
    }
    return place.name;
  };

  const getDisplayDescription = (place: PubPlace): string => {
    if (typeof place.description === 'string') {
      let desc = place.description + '\n\n';
      if (place.musicType || place.musicGenre) desc += 'Music: ' + (place.musicType || place.musicGenre) + '\n';
      if (place.happyHours) desc += 'Happy Hours: ' + place.happyHours + '\n';
      if (place.dressCode) desc += 'Dress Code: ' + place.dressCode + '\n';
      if (place.notes) desc += '\n' + place.notes;
      return desc.trim();
    }

    const desc = place.description;
    if (!desc) return 'Pub or bar in Pondicherry';

    let fullDesc = '';
    if (desc.specialFeatures) fullDesc += desc.specialFeatures + '\n\n';
    if (desc.musicType) fullDesc += 'Music: ' + desc.musicType + '\n\n';
    if (desc.atmosphere) fullDesc += 'Atmosphere: ' + desc.atmosphere + '\n\n';
    if (desc.visitorPurpose) fullDesc += desc.visitorPurpose;

    return fullDesc || 'Pub or bar in Pondicherry';
  };

  const getLanguageCode = (): string => {
    switch (language) {
      case 'Tamil': return 'TA';
      default: return 'EN';
    }
  };

  const renderCategoryCard = ({ item, index }: { item: typeof PUB_CATEGORIES[0]; index: number }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      onPress={() => handleCategoryPress(item.id)}
      activeOpacity={0.85}
    >
      <View style={styles.categoryImageContainer}>
        <Image
          source={typeof item.image === 'number' ? item.image : { uri: item.image }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        />
      </View>
      <View style={styles.categoryLabelContainer}>
        <Text style={styles.categoryLabel}>
          {language === 'Tamil' ? item.labelTamil : item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPlaceCard = ({ item, index }: { item: PubPlace; index: number }) => (
    <TouchableOpacity
      style={[
        styles.placeCard,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      onPress={() => handlePlacePress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={typeof item.image === 'number' ? item.image : { uri: item.image || (item.images?.[0]) || 'https://via.placeholder.com/300x200'  }}
        style={styles.placeImage}
        resizeMode="cover"
      />
      <View style={styles.placeInfo}>
        <Text style={styles.placeName} numberOfLines={2}>
          {getDisplayName(item)}
        </Text>
        <Text style={styles.placeLocation} numberOfLines={1}>
          {item.location}
        </Text>
        <View style={styles.placeMetaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
        </View>
        {item.rating && item.rating > 0 && (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderActiveFilters = () => null;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E7C86" />
        <Text style={styles.loadingText}>Loading pubs & bars...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (showCategoryView) {
              navigation?.goBack();
            } else {
              setShowCategoryView(true);
              setSelectedCategory('All');
            }
          }}
        >
          <ArrowBackIcon size={24} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {showCategoryView ? 'Pubs & Bars' : selectedCategory === 'All' ? 'All Places' : selectedCategory}
        </Text>

        <View style={styles.headerActions}>
          {/* Language Selector */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowLanguageMenu(true)}
          >
            <Text style={styles.languageCode}>{getLanguageCode()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Elegant Filter Pills returning direct control */}
      {!showCategoryView && (
        <View style={{ marginTop: spacing.md }}>
          <FilterPills
            options={['All', ...PUB_CATEGORIES.map(c => c.id)] as PubCategory[]}
            selectedOption={selectedCategory}
            onSelectOption={(val) => setSelectedCategory(val as PubCategory)}
          />
        </View>
      )}

      {/* Categories View */}
      {showCategoryView ? (
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          <FlatList
            data={PUB_CATEGORIES}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <>
          {/* Results Count */}
          <View style={styles.resultsBar}>
            <Text style={styles.resultsText}>
              {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found
            </Text>
          </View>

          {/* Places Grid */}
          <FlatList
            data={filteredPlaces}
            renderItem={renderPlaceCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No places found</Text>
                <Text style={styles.emptySubtext}>Try selecting a different category</Text>
              </View>
            }
          />
        </>
      )}



      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageMenu(false)}
        >
          <View style={styles.languageModalContent}>
            <View style={styles.languageModalHeader}>
              <Text style={styles.languageModalTitle}>Select Language</Text>
              <TouchableOpacity
                onPress={() => setShowLanguageMenu(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.languageOption, language === 'English' && styles.languageOptionActive]}
                onPress={() => {
                  setLanguage('English');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[styles.languageOptionText, language === 'English' && styles.languageOptionTextActive]}>English</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.languageOption, language === 'Tamil' && styles.languageOptionActive]}
                onPress={() => {
                  setLanguage('Tamil');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[styles.languageOptionText, language === 'Tamil' && styles.languageOptionTextActive]}>தமிழ் (Tamil)</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    ...typography.bodyMedium,
    color: '#666666',
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h4,
    color: '#000000',
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
    ...shadows.sm,
  },
  languageCode: {
    ...typography.labelMedium,
    color: '#0E7C86',
    fontWeight: '700',
  },
  activeFiltersContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  activeFilterTag: {
    backgroundColor: '#0E7C8620',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: '#0E7C86',
  },
  activeFilterText: {
    ...typography.labelSmall,
    color: '#0E7C86',
  },
  clearFiltersButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  clearFiltersText: {
    ...typography.labelSmall,
    color: '#E84A4A',
    fontWeight: '600',
  },
  categoriesContainer: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: '#000000',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  resultsBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  resultsText: {
    ...typography.bodySmall,
    color: '#666666',
  },
  listContainer: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48.5%',
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardLeft: {
    marginRight: spacing.xs,
  },
  cardRight: {
    marginLeft: spacing.xs,
  },
  categoryImageContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  categoryLabelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  categoryLabel: {
    ...typography.labelLarge,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  placeCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },
  placeImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  placeInfo: {
    padding: spacing.sm,
  },
  placeName: {
    ...typography.labelMedium,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 4,
  },
  placeLocation: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
  },
  placeMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: '#F4C430' + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  categoryBadgeText: {
    ...typography.labelSmall,
    color: '#F4C430',
    fontSize: 9,
  },
  ratingRow: {
    marginTop: 4,
  },
  ratingText: {
    ...typography.labelSmall,
    color: '#F4C430',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.h4,
    color: '#666666',
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: '#666666',
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '80%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    ...typography.h4,
    color: '#000000',
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '600',
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  filterLabel: {
    ...typography.labelMedium,
    color: '#000000',
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterOptionActive: {
    backgroundColor: '#0E7C86',
    borderColor: '#0E7C86',
  },
  filterOptionText: {
    ...typography.labelSmall,
    color: '#666666',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#0E7C86',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  languageModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: spacing.xl,
    marginTop: 'auto',
  },
  languageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  languageModalTitle: {
    ...typography.h4,
    color: '#000000',
    fontWeight: '700',
  },
  languageOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  languageOptionActive: {
    backgroundColor: '#0E7C8610',
  },
  languageOptionText: {
    ...typography.bodyMedium,
    color: '#000000',
  },
  languageOptionTextActive: {
    color: '#0E7C86',
    fontWeight: '600',
  },
});
