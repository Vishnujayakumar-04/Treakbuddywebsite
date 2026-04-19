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
import { ArrowBackIcon, FilterIcon } from '../components/icons';
import { Place } from '../utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

// Import theatres data
import theatresData from '../data/theatres';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

type Language = 'English' | 'Tamil';

interface Theatre {
  id: string;
  name: string;
  nameTamil?: string;
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
  description?: {
    whenEstablished?: string;
    whoOwns?: string;
    specialFeatures?: string;
    facilities?: string[];
    screenCount?: number;
    seatingCapacity?: string;
  };
  images: string[];
  entryFee?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  crowdLevel?: string;
  famousThings?: string[];
  rating?: number;
}

interface TheatresScreenProps {
  navigation?: any;
}

// Predefined list of theatres
const THEATRE_NAMES = [
  'PVR Cinemas',
  'Raja Theatre',
  'Divya Theatre',
  'Radhana Theatre',
  'Jeeva Theatre',
  'Rukmani Theatre',
  'Shanmuga Theatre',
  'Balaji Theatre',
];

const THEATRE_NAMES_TAMIL = [
  'PVR சினிமாஸ்',
  'ராஜா தியேட்டர்',
  'திவ்யா தியேட்டர்',
  'ராதனா தியேட்டர்',
  'ஜீவா தியேட்டர்',
  'ருக்மணி தியேட்டர்',
  'சண்முகா தியேட்டர்',
  'பாலாஜி தியேட்டர்',
];

export default function TheatresScreen({ navigation }: TheatresScreenProps) {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [filteredTheatres, setFilteredTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('English');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = theatresData as Theatre[];
        if (isMounted) {
          // If data is empty, create placeholder entries for the 8 theatres
          if (!Array.isArray(data) || data.length === 0) {
            const placeholderTheatres: Theatre[] = THEATRE_NAMES.map((name, index) => ({
              id: `theatre-${index + 1}`,
              name: name,
              nameTamil: THEATRE_NAMES_TAMIL[index],
              location: 'Puducherry',
              address: 'Address to be updated',
              mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(name + ' Puducherry')}`,
              images: ['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'],
              openingTimeWeekdays: '10:00 AM',
              closingTimeWeekdays: '11:00 PM',
              openingTimeWeekends: '10:00 AM',
              closingTimeWeekends: '11:30 PM',
              description: {
                specialFeatures: 'Cinema theatre in Puducherry',
              },
              entryFee: 'Varies by show',
              phoneNumber: 'Not listed',
              crowdLevel: 'Medium',
              rating: 0,
            }));
            setTheatres(placeholderTheatres);
            setFilteredTheatres(placeholderTheatres);
          } else {
            setTheatres(data);
            setFilteredTheatres(data);
          }
        }
      } catch (error) {
        console.error('Error loading theatres:', error);
        if (isMounted) {
          // Create placeholder entries on error
          const placeholderTheatres: Theatre[] = THEATRE_NAMES.map((name, index) => ({
            id: `theatre-${index + 1}`,
            name: name,
            nameTamil: THEATRE_NAMES_TAMIL[index],
            location: 'Puducherry',
            address: 'Address to be updated',
            mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(name + ' Puducherry')}`,
            images: ['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'],
            openingTimeWeekdays: '10:00 AM',
            closingTimeWeekdays: '11:00 PM',
            openingTimeWeekends: '10:00 AM',
            closingTimeWeekends: '11:30 PM',
            description: {
              specialFeatures: 'Cinema theatre in Puducherry',
            },
            entryFee: 'Varies by show',
            phoneNumber: 'Not listed',
            crowdLevel: 'Medium',
            rating: 0,
          }));
          setTheatres(placeholderTheatres);
          setFilteredTheatres(placeholderTheatres);
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

  const handleTheatrePress = (theatre: Theatre) => {
    const placeForDetails: Place = {
      id: theatre.id,
      name: getDisplayName(theatre),
      image: theatre.images && theatre.images.length > 0 ? theatre.images[0] : '',
      description: getDisplayDescription(theatre),
      opening: theatre.openingTimeWeekdays ? `${theatre.openingTimeWeekdays} - ${theatre.closingTimeWeekdays}` : 'Open',
      entryFee: theatre.entryFee || 'Varies by show',
      rating: theatre.rating || 0,
      mapUrl: theatre.mapsUrl,
      phone: theatre.phoneNumber || '',
      category: 'theatres',
    };
    navigation?.navigate('PlaceDetails', { place: placeForDetails, theatre: theatre });
  };

  const getDisplayName = (theatre: Theatre): string => {
    if (language === 'Tamil' && theatre.nameTamil) {
      return theatre.nameTamil;
    }
    return theatre.name;
  };

  const getDisplayDescription = (theatre: Theatre): string => {
    const desc = theatre.description;
    if (!desc) return 'Cinema theatre in Pondicherry';

    let fullDesc = '';
    if (desc.specialFeatures) fullDesc += desc.specialFeatures + '\n\n';
    if (desc.facilities && desc.facilities.length > 0) {
      fullDesc += 'Facilities: ' + desc.facilities.join(', ');
    }

    return fullDesc || 'Cinema theatre in Pondicherry';
  };

  const getLanguageCode = (): string => {
    switch (language) {
      case 'Tamil': return 'TA';
      default: return 'EN';
    }
  };

  const renderTheatreCard = ({ item, index }: { item: Theatre; index: number }) => (
    <TouchableOpacity
      style={[
        styles.theatreCard,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      onPress={() => handleTheatrePress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={typeof item.images?.[0] === 'number' ? item.images?.[0] : { uri: item.images?.[0] || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'  }}
        style={styles.theatreImage}
        resizeMode="cover"
      />
      <View style={styles.theatreInfo}>
        <Text style={styles.theatreName} numberOfLines={2}>
          {getDisplayName(item)}
        </Text>
        <Text style={styles.theatreLocation} numberOfLines={1}>
          {item.location}
        </Text>
        {item.rating && item.rating > 0 && (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E7C86" />
        <Text style={styles.loadingText}>Loading theatres...</Text>
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

        <Text style={styles.headerTitle}>Theatres & Cinemas</Text>

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

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          {filteredTheatres.length} {filteredTheatres.length === 1 ? 'theatre' : 'theatres'} found
        </Text>
      </View>

      {/* Theatres Grid */}
      <FlatList
        data={filteredTheatres}
        renderItem={renderTheatreCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No theatres found</Text>
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
  theatreCard: {
    width: '48.5%',
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
  theatreImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  theatreInfo: {
    padding: spacing.sm,
  },
  theatreName: {
    ...typography.labelMedium,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 4,
  },
  theatreLocation: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
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
  languageOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  languageOptionActive: {
    backgroundColor: '#0E7C86' + '10',
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
