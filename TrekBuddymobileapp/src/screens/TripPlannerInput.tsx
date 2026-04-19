import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ArrowBackIcon, CalendarIcon, ArrowForwardIcon, AccountBalanceWalletIcon, AutoAwesomeIcon } from '../components/icons';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

export interface TripInput {
  startDate: string;
  endDate: string;
  budget: string;
  categories: string[];
  travelMode: string;
}

interface TripPlannerInputProps {
  navigation?: any;
  route?: {
    params?: {
      onPlanTrip?: (input: TripInput) => void;
    };
  };
}

const AVAILABLE_CATEGORIES = [
  { id: 'temples', label: 'Temples', icon: 'temple-buddhist' },
  { id: 'beaches', label: 'Beaches', icon: 'beach-access' },
  { id: 'restaurants', label: 'Food & Dining', icon: 'restaurant' },
  { id: 'pubs', label: 'Nightlife', icon: 'nightlife' },
];

const TRAVEL_MODES = [
  { id: 'walking', label: 'Walking', icon: 'directions-walk' },
  { id: 'driving', label: 'Driving', icon: 'directions-car' },
  { id: 'public', label: 'Public Transport', icon: 'directions-transit' },
  { id: 'mixed', label: 'Mixed', icon: 'swap-horiz' },
];

export default function TripPlannerInput({ navigation, route }: TripPlannerInputProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [travelMode, setTravelMode] = useState('mixed');

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDateInput = (date: string, type: 'start' | 'end') => {
    // Simple date format validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (date === '' || dateRegex.test(date)) {
      if (type === 'start') {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const handlePlanTrip = () => {
    // Validation
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select both start and end dates');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one category');
      return;
    }

    const tripInput: TripInput = {
      startDate,
      endDate,
      budget,
      categories: selectedCategories,
      travelMode,
    };

    // Navigate to output screen with input data
    navigation?.navigate('TripPlannerOutput', { tripInput });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
            <ArrowBackIcon size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plan Your Trip</Text>
        </View>

        <View style={styles.content}>
          {/* Dates Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel Dates</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateInputContainer}>
                <CalendarIcon size={20} color="#666666" />
                <TextInput
                  style={styles.dateInput}
                  placeholder="Start Date (YYYY-MM-DD)"
                  placeholderTextColor="#666666"
                  value={startDate}
                  onChangeText={(text) => handleDateInput(text, 'start')}
                />
              </View>
              <ArrowForwardIcon size={20} color="#666666" />
              <View style={styles.dateInputContainer}>
                <CalendarIcon size={20} color="#666666" />
                <TextInput
                  style={styles.dateInput}
                  placeholder="End Date (YYYY-MM-DD)"
                  placeholderTextColor="#666666"
                  value={endDate}
                  onChangeText={(text) => handleDateInput(text, 'end')}
                />
              </View>
            </View>
          </View>

          {/* Budget Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget (₹)</Text>
            <View style={styles.budgetContainer}>
              <AccountBalanceWalletIcon size={20} color="#666666" />
              <TextInput
                style={styles.budgetInput}
                placeholder="Enter your budget"
                placeholderTextColor="#666666"
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <Text style={styles.sectionDescription}>Select categories you'd like to explore</Text>
            <View style={styles.categoriesGrid}>
              {AVAILABLE_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                      shadows.sm,
                    ]}
                    onPress={() => handleCategoryToggle(category.id)}
                  >
                    <MaterialIcons
                      name={category.icon as any}
                      size={20}
                      color={isSelected ? '#FFFFFF' : '#666666'}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Travel Mode Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel Mode</Text>
            <Text style={styles.sectionDescription}>Preferred mode of transportation</Text>
            <View style={styles.travelModeGrid}>
              {TRAVEL_MODES.map((mode) => {
                const isSelected = travelMode === mode.id;
                return (
                  <TouchableOpacity
                    key={mode.id}
                    style={[
                      styles.travelModeCard,
                      isSelected && styles.travelModeCardSelected,
                      shadows.sm,
                    ]}
                    onPress={() => setTravelMode(mode.id)}
                  >
                    <MaterialIcons
                      name={mode.icon as any}
                      size={24}
                      color={isSelected ? '#FFFFFF' : '#0E7C86'}
                    />
                    <Text
                      style={[
                        styles.travelModeText,
                        isSelected && styles.travelModeTextSelected,
                      ]}
                    >
                      {mode.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Plan Trip Button */}
          <TouchableOpacity
            style={[styles.planButton, shadows.md]}
            onPress={handlePlanTrip}
          >
            <AutoAwesomeIcon size={20} color="#FFFFFF" />
            <Text style={styles.planButtonText}>Generate Itinerary</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
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
  headerTitle: {
    ...typography.h2,
    color: '#000000',
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: '#000000',
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.md,
  },
  dateInput: {
    flex: 1,
    paddingVertical: spacing.md,
    ...typography.bodyMedium,
    color: '#000000',
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  arrowIcon: {
    marginHorizontal: spacing.md,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.md,
  },
  budgetInput: {
    flex: 1,
    paddingVertical: spacing.md,
    ...typography.bodyMedium,
    color: '#000000',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: spacing.xs,
  },
  categoryChipSelected: {
    backgroundColor: '#0E7C86',
    borderColor: '#0E7C86',
  },
  categoryChipText: {
    ...typography.labelMedium,
    color: '#666666',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  travelModeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  travelModeCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: spacing.xs,
  },
  travelModeCardSelected: {
    backgroundColor: '#0E7C86',
    borderColor: '#0E7C86',
  },
  travelModeText: {
    ...typography.labelMedium,
    color: '#000000',
    textAlign: 'center',
  },
  travelModeTextSelected: {
    color: '#FFFFFF',
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E7C86',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  planButtonText: {
    ...typography.labelLarge,
    color: '#FFFFFF',
    fontSize: 16,
  },
});

