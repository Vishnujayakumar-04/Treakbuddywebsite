import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowBackIcon, BusIcon, ClockIcon, MoneyCoinIcon, MapIcon } from '../../components/icons';
import { FareInfoCard, StopChip, InfoSectionCard, UrbanRoute } from './BusSharedComponents';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { shadows } from '../../theme/shadows';
import urbanBusRoutesData from '../../data/urbanBusRoutes.json';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface BusRouteDetailsScreenProps {
  navigation?: any;
  route?: {
    params?: {
      routeId?: string;
      route?: UrbanRoute;
    };
  };
}

export default function BusRouteDetailsScreen({ navigation, route: routeParams }: BusRouteDetailsScreenProps) {
  const routeId = routeParams?.params?.routeId;
  const routeData = routeParams?.params?.route;
  const [route, setRoute] = useState<UrbanRoute | null>(routeData || null);

  useEffect(() => {
    if (!route && routeId) {
      try {
        const data = urbanBusRoutesData as { urban_routes: UrbanRoute[] };
        const foundRoute = data.urban_routes.find((r) => r.id === routeId);
        if (foundRoute) {
          setRoute(foundRoute);
        }
      } catch (error) {
        console.error('Error loading route:', error);
      }
    }
  }, [routeId, route]);

  const handleOpenInMaps = () => {
    if (!route) return;

    const startLocation = encodeURIComponent(route.start);
    const endLocation = encodeURIComponent(route.end);
    const mapsUrl = `https://www.google.com/maps/dir/${startLocation}/${endLocation}`;

    Linking.openURL(mapsUrl).catch((err) => {
      Alert.alert('Error', 'Could not open maps. Please try again.');
      console.error('Error opening maps:', err);
    });
  };

  if (!route) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Route not found</Text>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const allStops = [route.start, ...route.via, route.end];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#0E7C86', '#4ECDC4']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButtonHeader}
            activeOpacity={0.8}
          >
            <ArrowBackIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle} numberOfLines={2}>{route.routeName}</Text>
            <Text style={styles.headerSubtitle}>{route.id}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Route ID Badge */}
        <View style={styles.routeIdContainer}>
          <View style={styles.routeIdBadge}>
            <BusIcon size={20} color="#0E7C86" />
            <Text style={styles.routeIdText}>{route.id}</Text>
          </View>
        </View>

        {/* Info Sections */}
        <InfoSectionCard
          title="Route Information"
          icon={<BusIcon size={24} color="#0E7C86" />}
        >
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Start</Text>
              <Text style={styles.infoValue}>{route.start}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>End</Text>
              <Text style={styles.infoValue}>{route.end}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{route.distance_km} km</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Type</Text>
              <View style={styles.typeBadgeSmall}>
                <Text style={styles.typeTextSmall}>{route.type}</Text>
              </View>
            </View>
          </View>
        </InfoSectionCard>

        <InfoSectionCard
          title="Schedule"
          icon={<ClockIcon size={24} color="#0E7C86" />}
        >
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Frequency</Text>
              <Text style={styles.infoValue}>{route.frequency}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Operation Time</Text>
              <Text style={styles.infoValue}>{route.operation_time}</Text>
            </View>
          </View>
        </InfoSectionCard>

        {/* Stops Section */}
        <View style={styles.stopsSection}>
          <View style={styles.stopsHeader}>
            <MapIcon size={24} color="#0E7C86" />
            <Text style={styles.stopsTitle}>Bus Stops ({allStops.length})</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stopsContainer}
          >
            {allStops.map((stop, index) => (
              <StopChip
                key={index}
                stop={stop}
                index={index}
                isLast={index === allStops.length - 1}
              />
            ))}
          </ScrollView>
        </View>

        {/* Fare Info Card */}
        <FareInfoCard fareMin={route.fare_min} fareMax={route.fare_max} type={route.type} />

        {/* Open in Maps CTA */}
        <TouchableOpacity
          onPress={handleOpenInMaps}
          style={styles.mapsButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#0E7C86', '#4ECDC4']}
            style={styles.mapsButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MapIcon size={24} color="#FFFFFF" />
            <Text style={styles.mapsButtonText}>Open in Maps</Text>
          </LinearGradient>
        </TouchableOpacity>

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
  backButtonHeader: {
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  routeIdContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  routeIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E7C8620',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  routeIdText: {
    ...typography.h4,
    color: '#0E7C86',
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  infoItem: {
    flex: 1,
    marginRight: spacing.md,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: '#000000',
    fontWeight: '600',
  },
  typeBadgeSmall: {
    alignSelf: 'flex-start',
    backgroundColor: '#0E7C8620',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.xs,
  },
  typeTextSmall: {
    ...typography.labelSmall,
    color: '#0E7C86',
    fontWeight: '600',
  },
  stopsSection: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: '#F7FAFC',
    borderRadius: 20,
  },
  stopsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stopsTitle: {
    ...typography.h4,
    color: '#000000',
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  stopsContainer: {
    paddingVertical: spacing.xs,
  },
  mapsButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  mapsButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  mapsButtonText: {
    ...typography.h4,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.h3,
    color: '#666666',
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: '#0E7C86',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  backButtonText: {
    ...typography.buttonText,
  },
});

