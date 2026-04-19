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

// Import accommodation data
import accommodationData from '../data/hotels';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

type Language = 'English' | 'Tamil';
type MainCategory = 'Hotels' | 'Resorts' | 'PG & Stay' | 'Guest Houses' | 'Hostel';
type SubCategory = 'Budget Hotels' | 'Luxury Hotels' | 'Business Hotels' | 'Beach Resorts' | 'Eco Resorts' | 'PG for Boys' | 'PG for Girls';

interface AccommodationPlace {
  id: string;
  name: string;
  nameTamil?: string;
  category: string; // Main category or new JSON category (Hotel, Resort, PG, Stay)
  subCategory?: string; // Sub-category if applicable
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

  // Old format description
  description?: any;

  // New JSON format fields
  roomTypes?: string[];
  priceRange?: string;
  checkIn?: string;
  checkOut?: string;
  contact?: string;
  image?: string;

  images?: string[];
  entryFee?: string;
  dressCode?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  rating?: number;
}

interface AccommodationScreenProps {
  navigation?: any;
}

const MAIN_CATEGORIES: { id: MainCategory; label: string; labelTamil: string; image: string; hasSubCategories: boolean }[] = [
  {
    id: 'Hotels',
    label: 'Hotels',
    labelTamil: 'ஹோட்டல்கள்',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    hasSubCategories: true
  },
  {
    id: 'Resorts',
    label: 'Resorts',
    labelTamil: 'ரிசார்ட்டுகள்',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    hasSubCategories: true
  },
  {
    id: 'PG & Stay',
    label: 'PG & Stay',
    labelTamil: 'பி.ஜி & தங்குமிடம்',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    hasSubCategories: true
  },
  {
    id: 'Guest Houses',
    label: 'Guest Houses',
    labelTamil: 'விருந்தினர் வீடுகள்',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    hasSubCategories: false
  },
  {
    id: 'Hostel',
    label: 'Hostel',
    labelTamil: 'ஹோஸ்டல்',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    hasSubCategories: false
  },
];

const SUB_CATEGORIES: Record<MainCategory, { id: SubCategory; label: string; labelTamil: string; image: string }[]> = {
  'Hotels': [
    { id: 'Budget Hotels', label: 'Budget Hotels', labelTamil: 'பட்ஜெட் ஹோட்டல்கள்', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
    { id: 'Luxury Hotels', label: 'Luxury Hotels', labelTamil: 'லக்ஷரி ஹோட்டல்கள்', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800' },
    { id: 'Business Hotels', label: 'Business Hotels', labelTamil: 'வணிக ஹோட்டல்கள்', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  ],
  'Resorts': [
    { id: 'Beach Resorts', label: 'Beach Resorts', labelTamil: 'கடற்கரை ரிசார்ட்டுகள்', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800' },
    { id: 'Eco Resorts', label: 'Eco Resorts', labelTamil: 'சூழல் ரிசார்ட்டுகள்', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
  ],
  'PG & Stay': [
    { id: 'PG for Boys', label: 'PG for Boys', labelTamil: 'சிறுவர்களுக்கான பி.ஜி', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
    { id: 'PG for Girls', label: 'PG for Girls', labelTamil: 'சிறுமிகளுக்கான பி.ஜி', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
  ],
  'Guest Houses': [],
  'Hostel': [],
};

export default function AccommodationScreen({ navigation }: AccommodationScreenProps) {
  const [places, setPlaces] = useState<AccommodationPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<AccommodationPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [showCategoryView, setShowCategoryView] = useState(true);
  const [showSubCategoryView, setShowSubCategoryView] = useState(false);
  const [language, setLanguage] = useState<Language>('English');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = accommodationData as AccommodationPlace[];
        if (isMounted) {
          setPlaces(Array.isArray(data) ? data : []);
          setFilteredPlaces(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading accommodation places:', error);
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

    // Filter by main category
    if (selectedMainCategory) {
      filtered = filtered.filter(p => {
        // Handle new JSON categories
        if (selectedMainCategory === 'Hotels' && p.category === 'Hotel') return true;
        if (selectedMainCategory === 'Resorts' && p.category === 'Resort') return true;
        if (selectedMainCategory === 'PG & Stay' && (p.category === 'PG' || p.category === 'Stay')) return true;
        // Handle old categories
        return p.category === selectedMainCategory;
      });

      // Filter by sub-category if selected
      if (selectedSubCategory) {
        filtered = filtered.filter(p => p.subCategory === selectedSubCategory);
      }
    }

    setFilteredPlaces(filtered);
  }, [selectedMainCategory, selectedSubCategory, places]);

  const handleMainCategoryPress = (category: MainCategory) => {
    const mainCat = MAIN_CATEGORIES.find(c => c.id === category);
    if (mainCat?.hasSubCategories) {
      setSelectedMainCategory(category);
      setShowCategoryView(false);
      setShowSubCategoryView(true);
    } else {
      // Direct category, no sub-categories
      setSelectedMainCategory(category);
      setShowCategoryView(false);
      setShowSubCategoryView(false);
    }
  };

  const handleSubCategoryPress = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setShowSubCategoryView(false);
  };

  const handlePlacePress = (place: AccommodationPlace) => {
    const placeForDetails: Place = {
      id: place.id,
      name: getDisplayName(place),
      image: place.image || (place.images && place.images.length > 0 ? place.images[0] : ''),
      description: getDisplayDescription(place),
      opening: place.checkIn ? `Check-in: ${place.checkIn} | Check-out: ${place.checkOut}` : (place.openingTimeWeekdays ? `${place.openingTimeWeekdays} - ${place.closingTimeWeekdays}` : 'Open 24/7'),
      entryFee: place.priceRange || place.entryFee || 'Contact for pricing',
      rating: place.rating || 0,
      mapUrl: place.mapsUrl,
      phone: place.contact || place.phoneNumber || '',
      category: place.category.toLowerCase(),
    };
    navigation?.navigate('PlaceDetails', { place: placeForDetails, accommodationPlace: place });
  };

  const getDisplayName = (place: AccommodationPlace): string => {
    if (language === 'Tamil' && place.nameTamil) {
      return place.nameTamil;
    }
    return place.name;
  };

  const getDisplayDescription = (place: AccommodationPlace): string => {
    if (typeof place.description === 'string') {
      let desc = place.description + '\n\n';
      if (place.roomTypes && place.roomTypes.length > 0) {
        desc += 'Rooms: ' + place.roomTypes.join(', ') + '\n';
      }
      return desc;
    }

    const desc = place.description;
    if (!desc) return 'Accommodation in Pondicherry';

    let fullDesc = '';
    if (desc.specialFeatures) fullDesc += desc.specialFeatures + '\n\n';
    if (desc.facilities && desc.facilities.length > 0) {
      fullDesc += 'Facilities: ' + desc.facilities.join(', ') + '\n\n';
    }
    if (desc.amenities && desc.amenities.length > 0) {
      fullDesc += 'Amenities: ' + desc.amenities.join(', ') + '\n\n';
    }
    if (desc.visitorPurpose) fullDesc += desc.visitorPurpose;

    return fullDesc || 'Accommodation in Pondicherry';
  };

  const getLanguageCode = (): string => {
    switch (language) {
      case 'Tamil': return 'TA';
      default: return 'EN';
    }
  };

  const handleBack = () => {
    if (showSubCategoryView) {
      // Go back to main categories
      setShowSubCategoryView(false);
      setShowCategoryView(true);
      setSelectedMainCategory(null);
      setSelectedSubCategory(null);
    } else if (!showCategoryView) {
      // Go back to sub-categories if applicable, or main categories
      if (selectedMainCategory && MAIN_CATEGORIES.find(c => c.id === selectedMainCategory)?.hasSubCategories) {
        setShowSubCategoryView(true);
        setShowCategoryView(false);
        setSelectedSubCategory(null);
      } else {
        setShowCategoryView(true);
        setShowSubCategoryView(false);
        setSelectedMainCategory(null);
        setSelectedSubCategory(null);
      }
    } else {
      // Go back to previous screen
      navigation?.goBack();
    }
  };

  const getCurrentTitle = (): string => {
    if (showSubCategoryView && selectedMainCategory) {
      return MAIN_CATEGORIES.find(c => c.id === selectedMainCategory)?.label || 'Select Category';
    }
    if (!showCategoryView && selectedSubCategory) {
      return selectedSubCategory;
    }
    if (!showCategoryView && selectedMainCategory) {
      return MAIN_CATEGORIES.find(c => c.id === selectedMainCategory)?.label || 'Accommodation';
    }
    return 'Accommodation';
  };

  const renderMainCategoryCard = ({ item, index }: { item: typeof MAIN_CATEGORIES[0]; index: number }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      onPress={() => handleMainCategoryPress(item.id)}
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

  const renderSubCategoryCard = ({ item, index }: { item: typeof SUB_CATEGORIES[MainCategory][0]; index: number }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      onPress={() => handleSubCategoryPress(item.id)}
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

  const renderPlaceCard = ({ item, index }: { item: AccommodationPlace; index: number }) => (
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
            <Text style={styles.categoryBadgeText}>{item.subCategory || item.category}</Text>
          </View>
        </View>
        {item.priceRange && (
          <Text style={styles.priceText}>{item.priceRange}</Text>
        )}
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
        <Text style={styles.loadingText}>Loading accommodation...</Text>
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
          onPress={handleBack}
        >
          <ArrowBackIcon size={24} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {getCurrentTitle()}
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

      {/* Dual Row Filter Pills to control Main / Sub without modals */}
      {!showCategoryView && !showSubCategoryView && (
        <View style={{ marginTop: spacing.md }}>
          <FilterPills
            options={['All', ...MAIN_CATEGORIES.map(c => c.id)] as string[]}
            selectedOption={selectedMainCategory || 'All'}
            onSelectOption={(val) => {
              if (val === 'All') {
                setSelectedMainCategory(null);
                setSelectedSubCategory(null);
                setShowCategoryView(true);
              } else {
                handleMainCategoryPress(val as MainCategory);
                // the handleMainCategoryPress changes showSubCategoryView, but since the user tapped it from here, let's keep it in the places view
                setShowSubCategoryView(false);
              }
            }}
          />
          {selectedMainCategory && SUB_CATEGORIES[selectedMainCategory]?.length > 0 && (
            <View style={{ marginTop: spacing.sm }}>
              <FilterPills
                options={['All', ...((SUB_CATEGORIES[selectedMainCategory] || []).map(c => c.id))]}
                selectedOption={selectedSubCategory || 'All'}
                onSelectOption={(val) => {
                  if (val === 'All') setSelectedSubCategory(null);
                  else setSelectedSubCategory(val as SubCategory);
                }}
              />
            </View>
          )}
        </View>
      )}

      {/* Main Categories View */}
      {showCategoryView ? (
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          <FlatList
            data={MAIN_CATEGORIES}
            renderItem={renderMainCategoryCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : showSubCategoryView && selectedMainCategory ? (
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Select Sub-Category</Text>
          <FlatList
            data={SUB_CATEGORIES[selectedMainCategory]}
            renderItem={renderSubCategoryCard}
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
    backgroundColor: '#2176FF' + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  categoryBadgeText: {
    ...typography.labelSmall,
    color: '#2176FF',
    fontSize: 9,
  },
  priceText: {
    ...typography.labelSmall,
    color: '#0E7C86',
    fontWeight: '600',
    marginTop: 4,
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
