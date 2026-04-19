import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BusIcon, ArrowBackIcon } from '../../components/icons';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { shadows } from '../../theme/shadows';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface BusHomeScreenProps {
  navigation?: any;
}

export default function BusHomeScreen({ navigation }: BusHomeScreenProps) {
  const handleTownBusPress = () => {
    navigation?.navigate('TownBusList');
  };

  const handleInterCityPress = () => {
    navigation?.navigate('InterCityBus');
  };

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
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <ArrowBackIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Pondicherry Bus Transport</Text>
            <Text style={styles.headerSubtitle}>Explore bus routes and schedules</Text>
          </View>
          <View style={styles.headerIcon}>
            <BusIcon size={40} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Primary Navigation Cards */}
        <View style={styles.cardsContainer}>
          {/* Town/Urban Bus Routes Card */}
          <TouchableOpacity
            onPress={handleTownBusPress}
            style={styles.primaryCard}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#0E7C86', '#4ECDC4']}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardIconContainer}>
                <BusIcon size={48} color="#FFFFFF" />
              </View>
              <Text style={styles.cardTitle}>Town/Urban Bus Routes</Text>
              <Text style={styles.cardDescription}>
                Explore all urban bus routes within Pondicherry
              </Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>10 Routes Available</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* InterCity Buses Card */}
          <TouchableOpacity
            onPress={handleInterCityPress}
            style={styles.primaryCard}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#2176FF', '#6BA3FF']}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardIconContainer}>
                <BusIcon size={48} color="#FFFFFF" />
              </View>
              <Text style={styles.cardTitle}>InterCity Buses</Text>
              <Text style={styles.cardDescription}>
                Connect to nearby cities and towns
              </Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>7 Destinations</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Quick Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>
              All routes start from Pondicherry New Bus Stand
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>⏰</Text>
            <Text style={styles.infoText}>
              Operating hours vary by route, typically 5:00 AM - 10:30 PM
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💰</Text>
            <Text style={styles.infoText}>
              Fares range from ₹10 to ₹32 based on distance
            </Text>
          </View>
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
  cardsContainer: {
    marginBottom: spacing.xl,
  },
  primaryCard: {
    marginBottom: spacing.lg,
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.lg,
  },
  cardGradient: {
    padding: spacing.xl,
    borderRadius: 24,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  cardDescription: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    marginBottom: spacing.md,
  },
  cardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  cardBadgeText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#F7FAFC',
    padding: spacing.lg,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  infoTitle: {
    ...typography.h4,
    color: '#000000',
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  infoText: {
    ...typography.bodyMedium,
    color: '#666666',
    flex: 1,
    lineHeight: 20,
  },
});

