import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowBackIcon, BusIcon, ClockIcon, MoneyCoinIcon } from '../../components/icons';
import { Card } from '../../components/ui';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { shadows } from '../../theme/shadows';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface InterCityBusScreenProps {
  navigation?: any;
}

interface InterCityDestination {
  id: string;
  name: string;
  distance: string;
  hours: string;
  availability: string;
  fareRange: string;
}

const INTERCITY_DESTINATIONS: InterCityDestination[] = [
  {
    id: 'CHN',
    name: 'Chennai',
    distance: '165 km',
    hours: '3-4 hrs',
    availability: 'Govt & Private',
    fareRange: '₹150 - ₹300',
  },
  {
    id: 'VPM',
    name: 'Villupuram',
    distance: '40 km',
    hours: '1-1.5 hrs',
    availability: 'Govt & Private',
    fareRange: '₹40 - ₹80',
  },
  {
    id: 'CDL',
    name: 'Cuddalore',
    distance: '35 km',
    hours: '1 hr',
    availability: 'Govt & Private',
    fareRange: '₹35 - ₹70',
  },
  {
    id: 'TND',
    name: 'Tindivanam',
    distance: '70 km',
    hours: '1.5-2 hrs',
    availability: 'Govt & Private',
    fareRange: '₹70 - ₹140',
  },
  {
    id: 'TRY',
    name: 'Trichy',
    distance: '220 km',
    hours: '4-5 hrs',
    availability: 'Govt & Private',
    fareRange: '₹250 - ₹450',
  },
  {
    id: 'BLR',
    name: 'Bangalore',
    distance: '320 km',
    hours: '6-7 hrs',
    availability: 'Private',
    fareRange: '₹600 - ₹1200',
  },
  {
    id: 'CBE',
    name: 'Coimbatore',
    distance: '380 km',
    hours: '7-8 hrs',
    availability: 'Private',
    fareRange: '₹800 - ₹1500',
  },
];

export default function InterCityBusScreen({ navigation }: InterCityBusScreenProps) {
  const renderDestinationCard = (destination: InterCityDestination) => (
    <Card key={destination.id} style={styles.destinationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <BusIcon size={32} color="#0E7C86" />
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{destination.name}</Text>
          <View style={styles.availabilityBadge}>
            <Text style={styles.availabilityText}>{destination.availability}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{destination.distance}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.clockIcon}>
              <ClockIcon size={18} color="#0E7C86" />
            </View>
            <Text style={styles.infoValue}>{destination.hours}</Text>
          </View>
        </View>

        <View style={styles.fareRow}>
          <MoneyCoinIcon size={20} color="#F4C430" />
          <Text style={styles.fareLabel}>Fare:</Text>
          <Text style={styles.fareValue}>{destination.fareRange}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#2176FF', '#6BA3FF']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <ArrowBackIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>InterCity Buses</Text>
            <Text style={styles.headerSubtitle}>{INTERCITY_DESTINATIONS.length} destinations</Text>
          </View>
          <View style={styles.headerIcon}>
            <BusIcon size={32} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            InterCity bus services connect Pondicherry to major cities and towns. Fares and schedules may vary. Please check with the bus operators for current information.
          </Text>
        </View>

        {/* Destinations List */}
        {INTERCITY_DESTINATIONS.map(renderDestinationCard)}

        {/* Note Section */}
        <View style={styles.noteSection}>
          <Text style={styles.noteTitle}>Note</Text>
          <Text style={styles.noteText}>
            • All fares and timings are approximate and subject to change{'\n'}
            • Govt buses are operated by Puducherry Road Transport Corporation{'\n'}
            • Private buses offer various classes (Sleeper, Semi-Sleeper, Seater){'\n'}
            • Bookings can be made at the bus stand or through online platforms
          </Text>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
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
    paddingTop: STATUSBAR_HEIGHT + spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  headerIcon: {
    marginLeft: spacing.md,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  infoBanner: {
    backgroundColor: '#EBF8FF',
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#2176FF20',
  },
  infoBannerText: {
    ...typography.bodyMedium,
    color: '#2176FF',
    lineHeight: 20,
  },
  destinationCard: {
    padding: spacing.lg,
    borderRadius: 20,
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0E7C8615',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    ...typography.h4,
    color: '#000000',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  availabilityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0E7C8620',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.full,
  },
  availabilityText: {
    ...typography.labelSmall,
    color: '#0E7C86',
    fontWeight: '600',
  },
  cardInfo: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: '#666666',
    marginRight: spacing.xs,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: '#000000',
    fontWeight: '600',
  },
  clockIcon: {
    marginRight: spacing.xs,
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  fareLabel: {
    ...typography.bodyMedium,
    color: '#666666',
    marginLeft: spacing.xs,
    marginRight: spacing.xs,
  },
  fareValue: {
    ...typography.h4,
    color: '#F4C430',
    fontWeight: '700',
  },
  noteSection: {
    backgroundColor: '#F7FAFC',
    padding: spacing.lg,
    borderRadius: 20,
    marginTop: spacing.md,
  },
  noteTitle: {
    ...typography.h4,
    color: '#000000',
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  noteText: {
    ...typography.bodyMedium,
    color: '#666666',
    lineHeight: 22,
  },
});

