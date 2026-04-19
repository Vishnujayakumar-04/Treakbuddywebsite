import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowBackIcon, BusIcon } from '../../components/icons';
import { BusRouteCard, UrbanRoute } from './BusSharedComponents';
import { SectionTitle } from '../../components/ui';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import urbanBusRoutesData from '../../data/urbanBusRoutes.json';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface TownBusListScreenProps {
  navigation?: any;
}

export default function TownBusListScreen({ navigation }: TownBusListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [routes, setRoutes] = useState<UrbanRoute[]>([]);

  useEffect(() => {
    try {
      const data = urbanBusRoutesData as { urban_routes: UrbanRoute[] };
      setRoutes(data.urban_routes || []);
    } catch (error) {
      console.error('Error loading bus routes:', error);
      setRoutes([]);
    }
  }, []);

  const filteredRoutes = routes.filter((route) =>
    route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.start.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.end.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoutePress = (route: UrbanRoute) => {
    navigation?.navigate('BusRouteDetails', { routeId: route.id, route });
  };

  const renderRouteItem = ({ item }: { item: UrbanRoute }) => (
    <BusRouteCard route={item} onPress={() => handleRoutePress(item)} />
  );

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
            <Text style={styles.headerTitle}>Town/Urban Bus Routes</Text>
            <Text style={styles.headerSubtitle}>{routes.length} routes available</Text>
          </View>
          <View style={styles.headerIcon}>
            <BusIcon size={32} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by route name, start, or end..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              activeOpacity={0.8}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Results Count */}
        {searchQuery.length > 0 && (
          <Text style={styles.resultsText}>
            {filteredRoutes.length} route{filteredRoutes.length !== 1 ? 's' : ''} found
          </Text>
        )}

        {/* Routes List */}
        {filteredRoutes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <BusIcon size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>
              {searchQuery.length > 0 ? 'No routes found' : 'No routes available'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery.length > 0
                ? 'Try a different search term'
                : 'Routes will be available soon'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredRoutes}
            renderItem={renderRouteItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <SectionTitle
                title={searchQuery.length > 0 ? 'Search Results' : 'All Routes'}
                subtitle={searchQuery.length > 0 ? undefined : 'Tap on any route to view details'}
              />
            }
          />
        )}

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
      </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: '#000000',
    paddingVertical: spacing.md,
    paddingRight: spacing.sm,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsText: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.sm,
    marginTop: -spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.h4,
    color: '#666666',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.bodyMedium,
    color: '#999999',
    textAlign: 'center',
  },
});

