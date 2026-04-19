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
import { ArrowBackIcon, LanguageIcon } from '../components/icons';
import { getAllReligionData, ReligionPlace, ReligionType, SubType, getSubTypesForReligion } from '../data/religion/religionDataFetcher';
import { PLACES_DATA } from '../data/places';
import { Place } from '../utils/api';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { FilterPills } from '../components/ui';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

// Local image map for all temples/churches that have assets in assets/assets/temple/
const TEMPLE_IMAGE_MAP: Record<string, any> = {
  // Hindu Temples
  'manakula vinayagar temple': require('../../assets/assets/temple/Arulmigu-Manakula-Vinayagar-Temple-Pondicherry-A-Divine-Blend-of-History-Culture-Devotion.jpg'),
  'arulmigu manakula vinayagar temple': require('../../assets/assets/temple/Arulmigu-Manakula-Vinayagar-Temple-Pondicherry-A-Divine-Blend-of-History-Culture-Devotion.jpg'),
  'varadaraja perumal temple': require('../../assets/assets/temple/varadaraja-temple-pondi.jpg'),
  'kamakshi amman temple': require('../../assets/assets/temple/Kamakshmi amman temple.jpg'),
  'vedapureeswarar temple': require('../../assets/assets/temple/150397172Vedapureeswarar-temple.jpg'),
  'arulmigu kanniga parameswari temple': require('../../assets/assets/temple/sri-kanniga-parameswari-temple-puducherry-tourism-entry-fee-timings-holidays-reviews-header.jpg'),
  'kanniga parameswari temple': require('../../assets/assets/temple/KANNIGA PARAMESWARI TEMPLE.jpg'),

  // Churches
  'sacred heart basilica': require('../../assets/assets/temple/basilica-of-the-sacred-heart-of-jesus-puducherry-tourism-entry-fee-timings-holidays-reviews-header.jpg'),
  'basilica of the sacred heart of jesus': require('../../assets/assets/temple/Puducherry_Sacred_Heart_Cathedral_2.jpg'),
  'immaculate conception cathedral': require('../../assets/assets/temple/immaculate-conception-cathedral-puducherry-entry-fee-timings-holidays-reviews-header.jpg'),
  'our lady of angels church': require('../../assets/assets/temple/our lady of angle church.jpg'),
  "st. andrew's church": require("../../assets/assets/temple/st andrew's church.jpg"),
  "st andrew's church": require("../../assets/assets/temple/st andrew's church.jpg"),

  // Spiritual
  'sri aurobindo ashram': require('../../assets/assets/temple/sri aurobindo ashram.jpg'),
};

// Helper: look up a local image from TEMPLE_IMAGE_MAP by name
const getTemplateLocalImage = (name: string): any | null => {
  const key = name.toLowerCase().trim();
  return TEMPLE_IMAGE_MAP[key] || null;
};


type Language = 'English' | 'Tamil' | 'Hindi' | 'Telugu' | 'Malayalam' | 'Kannada' | 'French';

interface ReligiousPlacesScreenProps {
  navigation?: any;
}

export default function ReligiousPlacesScreen({ navigation }: ReligiousPlacesScreenProps) {
  const [places, setPlaces] = useState<ReligionPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<ReligionPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReligion, setSelectedReligion] = useState<ReligionType | 'All'>('All');
  const [selectedSubType, setSelectedSubType] = useState<SubType | 'All'>('All');
  const [language, setLanguage] = useState<Language>('English');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const religions: ReligionType[] = ['Hindu', 'Christian', 'Muslim', 'Jain', 'Buddhist'];

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getAllReligionData();
        if (isMounted) {
          setPlaces(Array.isArray(data) ? data : []);
          setFilteredPlaces(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading temples:', error);
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

    // Filter by religion
    if (selectedReligion !== 'All') {
      filtered = filtered.filter(p => p.religion === selectedReligion);
    }

    // Filter by sub-type
    if (selectedSubType !== 'All') {
      filtered = filtered.filter(p => p.subType === selectedSubType);
    }

    setFilteredPlaces(filtered);
  }, [selectedReligion, selectedSubType, places]);

  // Helper: look up local image - first try TEMPLE_IMAGE_MAP, then places.ts
  const getLocalImage = (placeName: string) => {
    // 1st priority: direct map from known local temple assets
    const mapped = getTemplateLocalImage(placeName);
    if (mapped) return mapped;
    // 2nd priority: places.ts data (for beaches, heritage, etc.)
    const match = PLACES_DATA.find(
      p => p.name.toLowerCase().trim() === placeName.toLowerCase().trim()
    );
    return match?.image || null;
  };

  const handlePlacePress = (place: ReligionPlace) => {
    const displayName = getDisplayName(place);
    // Use local image (maps/places.ts) if available, else fall back to JSON URL
    const localImage = getLocalImage(place.name) || getLocalImage(displayName);
    const fallbackImage = place.image || (place.images && place.images.length > 0 ? place.images[0] : '');

    // Convert ReligionPlace to Place format for PlaceDetailsScreen
    const placeForDetails: Place = {
      id: place.id,
      name: displayName,
      image: localImage || fallbackImage,
      description: getDisplayDescription(place),
      opening: place.timing || (place.openingTimeWeekdays ? `${place.openingTimeWeekdays} - ${place.closingTimeWeekdays}` : 'Open Daily'),
      entryFee: place.price || place.entryFee || 'Free',
      rating: place.rating || 0,
      mapUrl: place.mapsUrl,
      phone: place.contact || place.phoneNumber || '',
      category: place.religion.toLowerCase(),
    };
    navigation?.navigate('PlaceDetails', { place: placeForDetails, religionPlace: place });
  };

  const handleReligionFilter = (religion: ReligionType | 'All') => {
    setSelectedReligion(religion);
    setSelectedSubType('All'); // Reset sub-type when religion changes
  };

  const handleSubTypeFilter = (subType: SubType | 'All') => {
    setSelectedSubType(subType);
  };

  const getDisplayName = (place: ReligionPlace): string => {
    switch (language) {
      case 'Tamil':
        return place.nameTamil || place.name;
      case 'Hindi':
        return place.nameHindi || place.name;
      case 'Telugu':
        return place.nameTelugu || place.name;
      case 'Malayalam':
        return place.nameMalayalam || place.name;
      case 'Kannada':
        return place.nameKannada || place.name;
      case 'French':
        return place.nameFrench || place.name;
      default:
        return place.name;
    }
  };

  const getDisplayDescription = (place: ReligionPlace): string => {
    let baseDesc = place.description || 'Religious place in Pondicherry';

    switch (language) {
      case 'Tamil':
        baseDesc = place.descriptionTamil || place.description || baseDesc; break;
      case 'Hindi':
        baseDesc = place.descriptionHindi || place.description || baseDesc; break;
      case 'Telugu':
        baseDesc = place.descriptionTelugu || place.description || baseDesc; break;
      case 'Malayalam':
        baseDesc = place.descriptionMalayalam || place.description || baseDesc; break;
      case 'Kannada':
        baseDesc = place.descriptionKannada || place.description || baseDesc; break;
      case 'French':
        baseDesc = place.descriptionFrench || place.description || baseDesc; break;
    }

    let fullDesc = baseDesc + '\n\n';
    if (place.bestTime) fullDesc += 'Best Time: ' + place.bestTime + '\n';
    if (place.features && place.features.length) fullDesc += 'Features: ' + place.features.join(', ') + '\n';
    if (place.festivals && place.festivals.length) fullDesc += 'Festivals: ' + place.festivals.join(', ') + '\n';
    if (place.rules && place.rules.length) fullDesc += 'Rules: ' + place.rules.join(', ') + '\n';
    return fullDesc.trim();
  };

  const renderPlaceCard = ({ item }: { item: ReligionPlace }) => {
    if (!item) return null;

    return (
      <TouchableOpacity
        style={[styles.card, shadows.md]}
        onPress={() => handlePlacePress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          {(() => {
            // 1st priority: local asset from TEMPLE_IMAGE_MAP
            const localImg = getTemplateLocalImage(item.name);
            // 2nd priority: remote URL from JSON
            const remoteUrl = item.image || (item.images && item.images.length > 0 ? item.images[0] : null);
            const imgSrc = localImg || remoteUrl;

            return imgSrc ? (
              <Image
                source={typeof imgSrc === 'number' ? imgSrc : { uri: imgSrc }}
                style={styles.imageCover}
                resizeMode="cover"
                onError={() => { }}
              />
            ) : (
              <View style={styles.fallbackImage} />
            );
          })()}
          <View style={styles.ratingBadge}>
            <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || 'N/A'}</Text>
          </View>
          <View style={styles.religionBadge}>
            <Text style={styles.religionText}>{item.religion}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.placeName} numberOfLines={2}>
            {getDisplayName(item)}
          </Text>
          <Text style={styles.subType} numberOfLines={1}>{item.subType}</Text>
          <Text style={styles.deity} numberOfLines={1}>{item.mainDeity}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⏰</Text>
            <Text style={styles.infoText} numberOfLines={1}>
              {item.timing || (item.openingTimeWeekdays ? `${item.openingTimeWeekdays} - ${item.closingTimeWeekdays}` : 'Open Daily')}
            </Text>
          </View>

          <View style={styles.crowdBadge}>
            <Text style={styles.crowdText}>
              {item.crowdLevel}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const availableSubTypes = selectedReligion === 'All'
    ? []
    : getSubTypesForReligion(selectedReligion);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7C86" />
          <Text style={styles.loadingText}>Loading Temples...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ArrowBackIcon size={18} color="#0E7C86" />
            <Text style={[styles.backButton, { marginLeft: spacing.xs }]}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Temples</Text>
        <View style={styles.headerActions}>
          {/* Language Selector */}
          <TouchableOpacity
            onPress={() => setShowLanguageMenu(true)}
            style={styles.languageButton}
          >
            <LanguageIcon size={20} color="#0E7C86" />
            <Text style={styles.languageText}>
              {language === 'English' ? 'EN' :
                language === 'Tamil' ? 'TA' :
                  language === 'Hindi' ? 'HI' :
                    language === 'Telugu' ? 'TE' :
                      language === 'Malayalam' ? 'ML' :
                        language === 'Kannada' ? 'KN' :
                          language === 'French' ? 'FR' : 'EN'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Elegant Filter Pills replacing modal */}
      <View style={{ marginTop: spacing.sm }}>
        <FilterPills
          options={['All', ...religions]}
          selectedOption={selectedReligion}
          onSelectOption={(val) => handleReligionFilter(val as any)}
        />

        {availableSubTypes.length > 0 && (
          <View style={{ marginTop: -spacing.sm }}>
            <FilterPills
              options={['All', ...availableSubTypes]}
              selectedOption={selectedSubType}
              onSelectOption={(val) => handleSubTypeFilter(val as any)}
            />
          </View>
        )}
      </View>

      {/* Results Count */}
      <View style={styles.resultsCount}>
        <Text style={styles.resultsText}>
          {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found
        </Text>
      </View>

      {/* Place List - 2 Column Grid */}
      {filteredPlaces.length > 0 ? (
        <FlatList
          data={filteredPlaces}
          renderItem={renderPlaceCard}
          keyExtractor={(item, index) => item?.id || `place-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🕉️</Text>
          <Text style={styles.emptyTitle}>No Places Found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your filters to see more places.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => {
              setSelectedReligion('All');
              setSelectedSubType('All');
            }}
          >
            <Text style={styles.emptyButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
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
          <View style={styles.languageMenu}>
            <View style={styles.languageMenuHeader}>
              <Text style={styles.languageMenuTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageMenu(false)}>
                <Text style={styles.languageMenuClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.languageMenuBody} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'English' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('English');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'English' && styles.languageOptionTextActive
                ]}>🇬🇧 English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'Tamil' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('Tamil');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'Tamil' && styles.languageOptionTextActive
                ]}>🇮🇳 தமிழ் (Tamil)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'Hindi' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('Hindi');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'Hindi' && styles.languageOptionTextActive
                ]}>🇮🇳 हिंदी (Hindi)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'Telugu' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('Telugu');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'Telugu' && styles.languageOptionTextActive
                ]}>🇮🇳 తెలుగు (Telugu)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'Malayalam' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('Malayalam');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'Malayalam' && styles.languageOptionTextActive
                ]}>🇮🇳 മലയാളം (Malayalam)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'Kannada' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('Kannada');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'Kannada' && styles.languageOptionTextActive
                ]}>🇮🇳 ಕನ್ನಡ (Kannada)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'French' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('French');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'French' && styles.languageOptionTextActive
                ]}>🇫🇷 Français (French)</Text>
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
    ...typography.labelMedium,
    color: '#0E7C86',
  },
  headerTitle: {
    ...typography.h3,
    color: '#000000',
    flex: 1,
    marginLeft: spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: '#0E7C86' + '15',
    borderRadius: radius.sm,
    gap: spacing.xs,
  },
  languageText: {
    ...typography.labelSmall,
    color: '#0E7C86',
    fontWeight: '600',
  },
  filterButton: {
    padding: spacing.xs,
  },
  activeFilters: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E7C8620',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  activeFilterText: {
    ...typography.labelSmall,
    color: '#0E7C86',
  },
  removeFilter: {
    fontSize: 18,
    color: '#0E7C86',
    fontWeight: 'bold',
  },
  resultsCount: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: '#FFFFFF',
  },
  resultsText: {
    ...typography.bodySmall,
    color: '#666666',
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    flex: 1,
    marginHorizontal: spacing.xs,
    maxWidth: '48%',
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#FFFFFF',
    position: 'relative',
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
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  rating: {
    ...typography.labelSmall,
    color: '#FFFFFF',
    fontSize: 11,
  },
  religionBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: '#2176FF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  religionText: {
    ...typography.labelSmall,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    padding: spacing.sm,
  },
  placeName: {
    ...typography.labelMedium,
    color: '#000000',
    marginBottom: 4,
    fontWeight: '600',
    fontSize: 13,
  },
  subType: {
    ...typography.bodySmall,
    color: '#0E7C86',
    marginBottom: 2,
    fontWeight: '500',
    fontSize: 10,
  },
  deity: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: 2,
    fontSize: 10,
  },
  description: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
    lineHeight: 14,
    fontSize: 10,
  },
  location: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: 2,
    fontSize: 9,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  infoLabel: {
    ...typography.labelSmall,
    color: '#666666',
    marginRight: 2,
    fontWeight: '600',
    fontSize: 9,
  },
  infoText: {
    ...typography.bodySmall,
    color: '#666666',
    flex: 1,
    fontSize: 9,
  },
  crowdBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F4C430' + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginTop: 4,
  },
  crowdText: {
    ...typography.labelSmall,
    color: '#F4C430',
    fontSize: 9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodyMedium,
    color: '#666666',
    marginTop: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: '#000000',
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: '#666666',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: '#0E7C86',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  emptyButtonText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
  },
  // Modal Styles
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    ...typography.h3,
    color: '#000000',
  },
  modalClose: {
    fontSize: 24,
    color: '#666666',
  },
  modalBody: {
    padding: spacing.lg,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterSectionTitle: {
    ...typography.labelLarge,
    color: '#000000',
    marginBottom: spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterOptionActive: {
    backgroundColor: '#0E7C86',
    borderColor: '#0E7C86',
  },
  filterOptionText: {
    ...typography.labelMedium,
    color: '#666666',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  applyButton: {
    backgroundColor: '#0E7C86',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  applyButtonText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
  },
  languageMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    margin: spacing.lg,
    maxHeight: '70%',
    overflow: 'hidden',
    ...shadows.lg,
  },
  languageMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  languageMenuTitle: {
    ...typography.h3,
    color: '#000000',
    fontWeight: '700',
  },
  languageMenuClose: {
    fontSize: 24,
    color: '#666666',
  },
  languageMenuBody: {
    maxHeight: 400,
  },
  languageOption: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  languageOptionActive: {
    backgroundColor: '#0E7C86' + '15',
  },
  languageOptionText: {
    ...typography.labelLarge,
    color: '#000000',
  },
  languageOptionTextActive: {
    color: '#0E7C86',
    fontWeight: '600',
  },
});
