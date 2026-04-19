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
import { Place } from '../utils/api';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { FilterPills } from '../components/ui';

// Import beaches data
import beachesData from '../data/beaches.json';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

// Local image map for all beaches that have assets in assets/assets/beaches/
const BEACH_IMAGE_MAP: Record<string, any> = {
  'promenade beach': require('../../assets/assets/beaches/promenade beach.jpg'),
  'paradise beach': require('../../assets/assets/beaches/paradise beach.jpeg'),
  'serenity beach': require('../../assets/assets/beaches/serenity beach.jpg'),
  'auroville beach': require('../../assets/assets/beaches/auroville beach.jpg'),
  'eden beach': require('../../assets/assets/beaches/edan beach.jfif'),
  'edan beach': require('../../assets/assets/beaches/edan beach.jfif'),
  'reppo beach': require('../../assets/assets/beaches/reppo beach.jfif'),
  'chunnambar backwater': require('../../assets/assets/beaches/chunnabar backwater.jfif'),
  'chunnambar boat house': require('../../assets/assets/beaches/chunnabar backwater.jfif'),
  'quiet healing centre beach': require('../../assets/assets/beaches/quite healing center beach.jfif'),
  'quiet healing center beach': require('../../assets/assets/beaches/quite healing center beach.jfif'),
};

const getBeachLocalImage = (name: string): any | null => {
  return BEACH_IMAGE_MAP[name.toLowerCase().trim()] || null;
};

type Language = 'English' | 'Tamil';
type BeachType = 'All' | 'Urban Beach' | 'Island Beach' | 'Surfing Beach' | 'Quiet Beach' | 'Blue Flag Beach' | 'Private Beach' | 'Secluded Beach' | 'Fishing Village Beach' | 'Fishing Harbor Beach' | 'Backwater';
type CrowdLevel = 'All' | 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';

interface Beach {
  id: string;
  name: string;
  nameTamil?: string;
  type: string;
  location: string;
  address: string;
  mapsUrl: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  openingTimeWeekdays: string;
  closingTimeWeekdays: string;
  openingTimeWeekends: string;
  closingTimeWeekends: string;
  description: {
    nameOrigin?: string;
    historicalImportance?: string;
    naturalFeatures?: string;
    maintenance?: string;
    facilities?: string[];
    nearbyShops?: string[];
    specialFeatures?: string;
  };
  images: string[];
  entryFee: string;
  dressCode: string;
  phoneNumber: string;
  emergencyContact?: string;
  policeHelpline?: string;
  lifeguardAvailable: boolean;
  crowdLevel: string;
  peakTime?: string;
  famousThings: string[];
  famousMonths: string;
  famousMonthsTamil?: string;
  safetyAndActivities: {
    swimmingAllowed: boolean;
    swimmingNote?: string;
    waveIntensity?: string;
    lifeguardAvailability?: string;
    activitiesAllowed?: string[];
    safetyWarnings?: string[];
  };
  bestTimeToVisit?: string;
  rating: number;
}

interface BeachesScreenProps {
  navigation?: any;
}

export default function BeachesScreen({ navigation }: BeachesScreenProps) {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [filteredBeaches, setFilteredBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<BeachType>('All');
  const [selectedCrowd, setSelectedCrowd] = useState<CrowdLevel>('All');
  const [language, setLanguage] = useState<Language>('English');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const beachTypes: BeachType[] = ['All', 'Urban Beach', 'Island Beach', 'Surfing Beach', 'Blue Flag Beach', 'Quiet Beach', 'Fishing Village Beach', 'Backwater'];
  const crowdLevels: CrowdLevel[] = ['All', 'Very Low', 'Low', 'Medium', 'High', 'Very High'];

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = beachesData as Beach[];
        if (isMounted) {
          setBeaches(Array.isArray(data) ? data : []);
          setFilteredBeaches(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading beaches:', error);
        if (isMounted) {
          setBeaches([]);
          setFilteredBeaches([]);
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
    let filtered = [...beaches];

    // Filter by type
    if (selectedType !== 'All') {
      filtered = filtered.filter(b => b.type === selectedType);
    }

    // Filter by crowd level
    if (selectedCrowd !== 'All') {
      filtered = filtered.filter(b => b.crowdLevel.includes(selectedCrowd));
    }

    setFilteredBeaches(filtered);
  }, [selectedType, selectedCrowd, beaches]);

  const handleBeachPress = (beach: Beach) => {
    // Use local asset if available, else fall back to JSON URL
    const localImage = getBeachLocalImage(beach.name);
    const fallbackImage = beach.images && beach.images.length > 0 ? beach.images[0] : '';

    // Convert Beach to Place format for PlaceDetailsScreen
    const placeForDetails: Place = {
      id: beach.id,
      name: getDisplayName(beach),
      image: localImage || fallbackImage,
      description: getDisplayDescription(beach),
      opening: `${beach.openingTimeWeekdays}`,
      entryFee: beach.entryFee || 'Free',
      rating: beach.rating || 0,
      mapUrl: beach.mapsUrl,
      phone: beach.phoneNumber,
      category: 'beaches',
    };
    navigation?.navigate('PlaceDetails', { place: placeForDetails, beachData: beach });
  };

  const getDisplayName = (beach: Beach): string => {
    if (language === 'Tamil' && beach.nameTamil) {
      return beach.nameTamil;
    }
    return beach.name;
  };

  const getDisplayDescription = (beach: Beach): string => {
    const desc = beach.description;
    let fullDesc = '';

    if (desc.nameOrigin) fullDesc += desc.nameOrigin + '\n\n';
    if (desc.specialFeatures) fullDesc += desc.specialFeatures;

    return fullDesc || 'Beautiful beach in Pondicherry';
  };

  const getLanguageCode = (): string => {
    switch (language) {
      case 'Tamil': return 'TA';
      default: return 'EN';
    }
  };

  const renderBeachCard = ({ item, index }: { item: Beach; index: number }) => (
    <TouchableOpacity
      style={[
        styles.placeCard,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      onPress={() => handleBeachPress(item)}
      activeOpacity={0.7}
    >
      {(() => {
        const localImg = getBeachLocalImage(item.name);
        const remoteUrl = item.images && item.images.length > 0 ? item.images[0] : null;
        const imgSrc = localImg || remoteUrl;
        return (
          <Image
            source={typeof imgSrc === 'number' ? imgSrc : { uri: imgSrc || 'https://via.placeholder.com/300x200' }}
            style={styles.placeImage}
            resizeMode="cover"
          />
        );
      })()}
      <View style={styles.placeInfo}>
        <Text style={styles.placeName} numberOfLines={2}>
          {getDisplayName(item)}
        </Text>
        <Text style={styles.placeLocation} numberOfLines={1}>
          {item.location}
        </Text>
        <View style={styles.placeMetaRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{item.type}</Text>
          </View>
          <View style={[
            styles.crowdBadge,
            item.crowdLevel.includes('High') ? styles.crowdHigh :
              item.crowdLevel.includes('Low') ? styles.crowdLow : styles.crowdMedium
          ]}>
            <Text style={styles.crowdBadgeText}>{item.crowdLevel}</Text>
          </View>
        </View>
        <View style={styles.swimmingRow}>
          <Text style={styles.swimmingText}>
            {item.safetyAndActivities.swimmingAllowed ? '🏊 Swimming Allowed' : '⚠️ No Swimming'}
          </Text>
        </View>
        {item.rating > 0 && (
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
        <Text style={styles.loadingText}>Loading beaches...</Text>
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
          onPress={() => navigation?.goBack()}
        >
          <ArrowBackIcon size={24} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Beaches</Text>

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

      {/* Elegant Filter Pills replacing modal */}
      <View style={{ marginTop: spacing.md }}>
        <FilterPills
          options={beachTypes}
          selectedOption={selectedType}
          onSelectOption={(val) => setSelectedType(val as BeachType)}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          {filteredBeaches.length} {filteredBeaches.length === 1 ? 'beach' : 'beaches'} found
        </Text>
      </View>

      {/* Beaches Grid */}
      <FlatList
        data={filteredBeaches}
        renderItem={renderBeachCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No beaches found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
      />



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
  placeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
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
  typeBadge: {
    backgroundColor: '#2176FF' + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginRight: 4,
    marginBottom: 4,
  },
  typeBadgeText: {
    ...typography.labelSmall,
    color: '#2176FF',
    fontSize: 9,
  },
  crowdBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  crowdLow: {
    backgroundColor: '#48BB78' + '20',
  },
  crowdMedium: {
    backgroundColor: '#F4C430' + '20',
  },
  crowdHigh: {
    backgroundColor: '#E84A4A' + '20',
  },
  crowdBadgeText: {
    ...typography.labelSmall,
    color: '#666666',
    fontSize: 9,
  },
  swimmingRow: {
    marginTop: 4,
  },
  swimmingText: {
    ...typography.labelSmall,
    color: '#666666',
    fontSize: 10,
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
