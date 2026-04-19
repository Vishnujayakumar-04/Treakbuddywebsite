import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  Image,
  Linking,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getTransitItems, TransitItem } from '../services/transitService';
import { getRentalImage } from '../data/transitImages';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface TransportScreenProps {
  navigation?: any;
}

// --- Rentals Tab ---
const VEHICLE_CATEGORIES = [
  { id: 'All', label: 'All', icon: '🏍️' },
  { id: 'Bike', label: 'Bikes', icon: '⚡' },
  { id: 'Scooty', label: 'Scooters', icon: '🛵' },
  { id: 'Car', label: 'Cars', icon: '🚗' },
  { id: 'Cycle', label: 'Cycles', icon: '🚲' },
];

function RentalsTab({ data, navigation }: { data: TransitItem[]; navigation?: any }) {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? data : data.filter(p => p.subCategory === filter);

  return (
    <>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionAccentRow}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionAccentText}>SELF DRIVE</Text>
        </View>
        <Text style={styles.sectionTitle}>Explore at Your Own Pace</Text>
        <Text style={styles.sectionSubtitle}>
          Rent a vehicle and discover Puducherry's hidden gems on your schedule.
        </Text>
      </View>

      {/* Vehicle Category Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {VEHICLE_CATEGORIES.map((cat) => {
          const isActive = filter === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setFilter(cat.id)}
              activeOpacity={0.8}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={styles.filterChipIcon}>{cat.icon}</Text>
              <Text style={[styles.filterChipLabel, isActive && styles.filterChipLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Count */}
      <Text style={styles.countText}>{filtered.length} options available</Text>

      {/* Rental Cards */}
      {filtered.map((provider) => (
        <TouchableOpacity
          key={provider.id}
          activeOpacity={0.88}
          onPress={() => navigation?.navigate('RentalDetail', { item: provider })}
        >
          <View style={styles.rentalCard}>
            {/* Image */}
            <View style={styles.rentalImageContainer}>
              {(() => {
                const localImg = getRentalImage(provider.id);
                if (localImg) {
                  return (
                    <Image source={localImg} style={styles.rentalImage} resizeMode="cover" />
                  );
                } else if (provider.image) {
                  return (
                    <Image source={typeof provider.image === 'number' ? provider.image : { uri: provider.image }} style={styles.rentalImage} resizeMode="cover" />
                  );
                } else {
                  return (
                    <View style={[styles.rentalImage, styles.rentalImagePlaceholder]}>
                      <Text style={{ fontSize: 40 }}>
                        {provider.subCategory === 'Car' ? '🚗' : provider.subCategory === 'Cycle' ? '🚲' : '🏍️'}
                      </Text>
                    </View>
                  );
                }
              })()}
              {/* Rating badge */}
              {provider.rating && (
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {provider.rating}</Text>
                </View>
              )}
            </View>

            {/* Content */}
            <View style={styles.rentalContent}>
              <Text style={styles.rentalName}>{provider.name}</Text>
              <View style={styles.rentalLocationRow}>
                <Text style={styles.rentalLocationIcon}>📍</Text>
                <Text style={styles.rentalLocation} numberOfLines={1}>{provider.location}</Text>
              </View>
              <View style={styles.rentalCategoryPill}>
                <Text style={styles.rentalCategoryText}>{provider.subCategory}</Text>
              </View>

              {/* Divider */}
              <View style={styles.rentalDivider} />

              <View style={styles.rentalFooter}>
                <View>
                  <Text style={styles.rentalStartsAt}>STARTS AT</Text>
                  <Text style={styles.rentalPrice}>{provider.price}</Text>
                </View>
                {provider.contact && (
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => Linking.openURL(`tel:${provider.contact}`)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.callButtonText}>📞 Call</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Quick Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipIcon}>💡</Text>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Quick Tip</Text>
          <Text style={styles.tipText}>
            Carry a valid driving license and ID proof for all rentals. Helmets are mandatory for two-wheelers.
          </Text>
        </View>
      </View>
    </>
  );
}

// --- Cabs Tab ---
function CabsTab({ data, navigation }: { data: TransitItem[]; navigation?: any }) {
  const [cabSubTab, setCabSubTab] = useState<'services' | 'operators'>('services');
  const cabTypes = data.filter(d => d.type === 'service');
  const operators = data.filter(d => d.type === 'operator');

  return (
    <>
      {/* Sub-tabs */}
      <View style={styles.cabSubTabsWrapper}>
        <TouchableOpacity
          style={[styles.cabSubTab, cabSubTab === 'services' && styles.cabSubTabActive]}
          onPress={() => setCabSubTab('services')}
          activeOpacity={0.8}
        >
          <Text style={[styles.cabSubTabText, cabSubTab === 'services' && styles.cabSubTabTextActive]}>
            🚕 Ride Services
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cabSubTab, cabSubTab === 'operators' && styles.cabSubTabActive]}
          onPress={() => setCabSubTab('operators')}
          activeOpacity={0.8}
        >
          <Text style={[styles.cabSubTabText, cabSubTab === 'operators' && styles.cabSubTabTextActive]}>
            🛡️ Local Operators
          </Text>
        </TouchableOpacity>
      </View>

      {/* Total count */}
      <View style={styles.cabCountBadge}>
        <Text style={styles.cabCountText}>{data.length} services available</Text>
      </View>

      {/* Ride Services */}
      {cabSubTab === 'services' && cabTypes.map((cab) => (
        <View key={cab.id} style={styles.cabServiceCard}>
          {/* amber accent top line */}
          <LinearGradient
            colors={['#f59e0b', '#f97316', '#f59e0b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cabAccentLine}
          />

          <View style={styles.cabServiceBody}>
            {/* Emoji Icon */}
            <View style={styles.cabEmojiContainer}>
              <Text style={styles.cabEmoji}>{cab.image || '🚕'}</Text>
            </View>

            {/* Details */}
            <View style={styles.cabDetailsColumn}>
              <View style={styles.cabTitleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cabName}>{cab.name}</Text>
                  <Text style={styles.cabDescription}>{cab.description}</Text>
                </View>
                {cab.tips && (
                  <View style={styles.cabTipBadge}>
                    <Text style={styles.cabTipText}>✨ {cab.tips}</Text>
                  </View>
                )}
              </View>

              {/* Stats Grid */}
              <View style={styles.cabStatsGrid}>
                <View style={[styles.cabStatItem, styles.cabStatGreen]}>
                  <Text style={styles.cabStatLabel}>BASE RATE</Text>
                  <Text style={styles.cabStatValue}>{cab.baseRate}</Text>
                </View>
                <View style={[styles.cabStatItem, styles.cabStatBlue]}>
                  <Text style={styles.cabStatLabel}>PER KM</Text>
                  <Text style={styles.cabStatValue}>{cab.perKm}</Text>
                </View>
                <View style={[styles.cabStatItem, styles.cabStatOrange]}>
                  <Text style={styles.cabStatLabel}>AVAILABLE</Text>
                  <Text style={styles.cabStatValue}>{cab.availability}</Text>
                </View>
                <View style={[styles.cabStatItem, styles.cabStatPurple]}>
                  <Text style={styles.cabStatLabel}>BOOKING</Text>
                  <Text style={styles.cabStatValue} numberOfLines={2}>{cab.bookingMethod}</Text>
                </View>
              </View>

              {/* Booking links */}
              {cab.bookingUrls && cab.bookingUrls.length > 0 && (
                <View style={styles.cabBookingSection}>
                  <Text style={styles.cabBookingLabel}>BOOK ONLINE:</Text>
                  <View style={styles.cabBookingButtons}>
                    {cab.bookingUrls.map((booking, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.cabBookingButton}
                        onPress={() => Linking.openURL(booking.url)}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#d97706', '#ea580c']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.cabBookingGradient}
                        >
                          <Text style={styles.cabBookingButtonText}>🚗 {booking.name} ↗</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      ))}

      {/* Local Operators */}
      {cabSubTab === 'operators' && (
        <View style={styles.operatorsGrid}>
          {operators.map((operator) => (
            <View key={operator.id} style={styles.operatorCard}>
              <View style={styles.operatorHeader}>
                <View style={styles.operatorIconBg}>
                  <Text style={styles.operatorIcon}>🚖</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.operatorName}>{operator.name}</Text>
                  <Text style={styles.operatorSpecialty} numberOfLines={2}>{operator.specialty}</Text>
                </View>
              </View>
              <View style={styles.operatorButtons}>
                <TouchableOpacity
                  style={styles.operatorCallBtn}
                  onPress={() => Linking.openURL(`tel:${operator.contact}`)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#059669', '#0d9488']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.operatorBtnGrad}
                  >
                    <Text style={styles.operatorBtnText}>📞 Call Now</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.operatorBookBtn}
                  onPress={() => Linking.openURL('https://hurryupcabs.com/city/pondicherry')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#d97706', '#ea580c']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.operatorBtnGrad}
                  >
                    <Text style={styles.operatorBtnText}>🚗 Book Online</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

// --- Bus Tab ---
function BusTab({ data, navigation }: { data: TransitItem[]; navigation?: any }) {
  const [busSubTab, setBusSubTab] = useState<'local' | 'interstate'>('local');
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');

  const filteredBuses = data.filter(bus => {
    if (bus.subCategory !== busSubTab) return false;
    const f = !fromFilter || bus.from?.toLowerCase().includes(fromFilter.toLowerCase()) || bus.via?.some(v => v.toLowerCase().includes(fromFilter.toLowerCase()));
    const t = !toFilter || bus.to?.toLowerCase().includes(toFilter.toLowerCase()) || bus.via?.some(v => v.toLowerCase().includes(toFilter.toLowerCase()));
    return f && t;
  });

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bus Routes & Timetables</Text>
        <Text style={styles.sectionSubtitle}>Town & Inter-city buses</Text>
      </View>

      {/* Sub-tabs */}
      <View style={styles.busSubTabs}>
        <TouchableOpacity
          style={[styles.busSubTab, busSubTab === 'local' && styles.busSubTabActive]}
          onPress={() => setBusSubTab('local')}
          activeOpacity={0.8}
        >
          <Text style={[styles.busSubTabText, busSubTab === 'local' && styles.busSubTabTextActive]}>
            🚌 Town Bus (Local)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.busSubTab, busSubTab === 'interstate' && styles.busSubTabActive]}
          onPress={() => setBusSubTab('interstate')}
          activeOpacity={0.8}
        >
          <Text style={[styles.busSubTabText, busSubTab === 'interstate' && styles.busSubTabTextActive]}>
            🏢 Inter-city
          </Text>
        </TouchableOpacity>
      </View>

      {filteredBuses.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 16, color: '#94A3B8' }}>No buses found.</Text>
      )}

      {filteredBuses.map((bus) => (
        <View key={bus.id} style={styles.busCard}>
          <View style={styles.busHeader}>
            <Text style={styles.busRouteIcon}>{bus.type?.includes('Electric') ? '🔋' : '🚌'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.busTitle}>{bus.name}</Text>
              <Text style={styles.busType}>{bus.type}</Text>
            </View>
            {bus.price && (
              <View style={styles.busPriceBadge}>
                <Text style={styles.busPriceText}>{bus.price}</Text>
              </View>
            )}
          </View>
          <View style={styles.busRouteRow}>
            <Text style={styles.busFrom}>{bus.from}</Text>
            <Text style={styles.busArrow}>➔</Text>
            <Text style={styles.busTo}>{bus.to}</Text>
          </View>
          <Text style={styles.busSchedule}>⏱️  Freq: {bus.frequency} • {bus.duration}</Text>
          {(bus.routeStops ?? bus.via ?? []).length > 0 && (
            <View style={styles.busViaContainer}>
              <Text style={styles.busViaLabel}>Stops: </Text>
              <View style={styles.busViaChips}>
                {(bus.routeStops ?? bus.via ?? []).map((stop: string, idx: number) => {
                  const stops = bus.routeStops ?? bus.via ?? [];
                  const isEndpoint = idx === 0 || idx === stops.length - 1;
                  return (
                    <View key={idx} style={[styles.busViaChip, isEndpoint && { backgroundColor: '#e0e7ff', borderColor: '#6366f1' }]}>
                      <Text style={[styles.busViaChipText, isEndpoint && { color: '#4338ca', fontWeight: '700' }]}>{stop}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      ))}
    </>
  );
}

// --- Train Tab ---
function TrainTab({ data, navigation }: { data: TransitItem[]; navigation?: any }) {
  const routes = data.filter(d => d.type === 'route');
  const station = data.find(d => d.type === 'station');

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Train Services</Text>
        <Text style={styles.sectionSubtitle}>Puducherry Railway Station (PDY)</Text>
      </View>

      {station && (
        <View style={styles.stationCard}>
          <Text style={styles.stationIcon}>🚉</Text>
          <View style={styles.stationInfo}>
            <Text style={styles.stationName}>{station.name}</Text>
            <Text style={styles.stationCode}>Code: {station.code}</Text>
            <Text style={styles.stationAddress}>{station.address}</Text>
            {station.facilities && (
              <View style={styles.stationFacilities}>
                {station.facilities.map((f, i) => (
                  <View key={i} style={styles.facilityChip}>
                    <Text style={styles.facilityText}>{f}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      <Text style={styles.trainSectionLabel}>🚆 Train Schedule</Text>

      {routes.map((train) => (
        <TouchableOpacity
          key={train.id}
          activeOpacity={0.88}
          onPress={() => navigation?.navigate('TrainDetail', { item: train })}
        >
          <View style={styles.trainCard}>
            <View style={styles.trainHeader}>
              <View style={styles.trainNumberBadge}>
                <Text style={styles.trainNumber}>#{train.number}</Text>
              </View>
              {train.availability && (
                <View style={styles.trainAvailBadge}>
                  <Text style={styles.trainAvailText}>{train.availability}</Text>
                </View>
              )}
            </View>
            <Text style={styles.trainName}>{train.name}</Text>
            <View style={styles.trainRouteRow}>
              <View style={styles.trainStop}>
                <Text style={styles.trainStopLabel}>FROM</Text>
                <Text style={styles.trainStopName}>{train.from}</Text>
                <Text style={styles.trainDeparture}>{train.departure}</Text>
              </View>
              <View style={styles.trainConnector}>
                <View style={styles.trainLine} />
                <Text style={styles.trainDuration}>{train.duration}</Text>
                <View style={styles.trainLine} />
              </View>
              <View style={[styles.trainStop, { alignItems: 'flex-end' }]}>
                <Text style={styles.trainStopLabel}>TO</Text>
                <Text style={styles.trainStopName}>{train.to}</Text>
                <Text style={styles.trainDeparture}>{train.arrival}</Text>
              </View>
            </View>
            <View style={styles.trainFooter}>
              <Text style={styles.trainClasses}>{train.classes?.join(' • ')}</Text>
              <Text style={styles.trainFare}>{train.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
}

// --- Main Screen ---
export default function TransportScreen({ navigation }: TransportScreenProps) {
  const [selectedTab, setSelectedTab] = useState('Rentals');
  const [transitData, setTransitData] = useState<TransitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const getCategoryFromTab = (tab: string) => {
    switch (tab) {
      case 'Rentals': return 'rentals';
      case 'Cabs': return 'cabs';
      case 'Bus': return 'bus';
      case 'Train': return 'train';
      default: return 'rentals';
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      fadeAnim.setValue(0);
      slideAnim.setValue(15);
      try {
        const category = getCategoryFromTab(selectedTab);
        const data = await getTransitItems(category);
        setTransitData(data);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
        ]).start();
      } catch (e) {
        console.error('Failed to load transport data', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedTab]);

  const TABS = [
    { id: 'Rentals', icon: '🏍️', label: 'Rentals' },
    { id: 'Cabs', icon: '🚖', label: 'Cabs' },
    { id: 'Bus', icon: '🚌', label: 'Bus' },
    { id: 'Train', icon: '🚆', label: 'Train' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#4f46e5', '#3b82f6', '#06b6d4']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>🚌 Transport Guide</Text>
            </View>
            <Text style={styles.headerTitle}>Getting Around{'\n'}Puducherry</Text>
            <Text style={styles.headerSubtitle}>Your complete guide to bikes, buses, trains & cabs</Text>

            <TouchableOpacity
              style={styles.plannerButton}
              onPress={() => navigation?.navigate('RoutePlanner')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.15)']}
                style={styles.plannerButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.plannerIcon}>🗺️</Text>
                <Text style={styles.plannerText}>Smart Route Planner</Text>
                <Text style={styles.plannerArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setSelectedTab(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading {selectedTab}...</Text>
            </View>
          ) : (
            <>
              {selectedTab === 'Rentals' && <RentalsTab data={transitData} navigation={navigation} />}
              {selectedTab === 'Cabs' && <CabsTab data={transitData} navigation={navigation} />}
              {selectedTab === 'Bus' && <BusTab data={transitData} navigation={navigation} />}
              {selectedTab === 'Train' && <TrainTab data={transitData} navigation={navigation} />}
            </>
          )}
          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  // Header
  header: {
    paddingTop: STATUSBAR_HEIGHT + 16,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  headerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
  },
  headerBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 38,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginBottom: 16,
  },
  plannerButton: { borderRadius: 14, overflow: 'hidden' },
  plannerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  plannerIcon: { fontSize: 20, marginRight: 10 },
  plannerText: { flex: 1, color: '#fff', fontWeight: '700', fontSize: 15 },
  plannerArrow: { color: '#fff', fontSize: 18, fontWeight: '700' },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    margin: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 2,
  },
  tabActive: {
    backgroundColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  tabIcon: { fontSize: 18 },
  tabLabel: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  tabLabelActive: { color: '#fff' },

  // Content Area
  content: { flex: 1, paddingHorizontal: 16 },

  // Loading
  loadingContainer: { padding: 40, alignItems: 'center' },
  loadingText: { color: '#94a3b8', fontWeight: '600', fontSize: 15 },

  // Section Headers
  sectionHeader: { marginTop: 8, marginBottom: 12 },
  sectionAccentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  sectionAccent: { width: 30, height: 5, backgroundColor: '#10b981', borderRadius: 3 },
  sectionAccentText: { fontSize: 11, fontWeight: '900', color: '#10b981', letterSpacing: 2 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: '#64748b' },
  countText: { fontSize: 12, color: '#64748b', fontWeight: '600', marginBottom: 12 },

  // ===== RENTALS =====
  filterRow: { paddingVertical: 8, paddingBottom: 12, gap: 8, paddingHorizontal: 2 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterChipIcon: { fontSize: 16 },
  filterChipLabel: { fontSize: 12, fontWeight: '700', color: '#475569' },
  filterChipLabelActive: { color: '#fff' },

  rentalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  rentalImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  rentalImage: {
    width: '100%',
    height: 160,
  },
  rentalImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#1e293b' },

  rentalContent: { padding: 14 },
  rentalName: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  rentalLocationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rentalLocationIcon: { fontSize: 12, marginRight: 3 },
  rentalLocation: { fontSize: 12, color: '#64748b', flex: 1 },
  rentalCategoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  rentalCategoryText: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  rentalDivider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 10 },
  rentalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rentalStartsAt: { fontSize: 10, fontWeight: '700', color: '#94a3b8', letterSpacing: 1, marginBottom: 2 },
  rentalPrice: { fontSize: 18, fontWeight: '800', color: '#059669' },
  callButton: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  callButtonText: { fontSize: 13, fontWeight: '700', color: '#16a34a' },

  // Tip Card
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  tipIcon: { fontSize: 20, marginRight: 12, marginTop: 2 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '800', color: '#1e40af', marginBottom: 4 },
  tipText: { fontSize: 13, color: '#1e40af', lineHeight: 20 },

  // ===== CABS =====
  cabSubTabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
    marginTop: 8,
    gap: 4,
  },
  cabSubTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  cabSubTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cabSubTabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  cabSubTabTextActive: { color: '#d97706' },

  cabCountBadge: {
    alignSelf: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginBottom: 14,
  },
  cabCountText: { fontSize: 12, fontWeight: '700', color: '#d97706' },

  cabServiceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cabAccentLine: { height: 3, width: '100%' },
  cabServiceBody: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
  },
  cabEmojiContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#fffbeb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
    flexShrink: 0,
  },
  cabEmoji: { fontSize: 38 },
  cabDetailsColumn: { flex: 1 },
  cabTitleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 8 },
  cabName: { fontSize: 17, fontWeight: '800', color: '#1e293b', marginBottom: 2 },
  cabDescription: { fontSize: 13, color: '#64748b', lineHeight: 18 },
  cabTipBadge: {
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#fde68a',
    flexShrink: 0,
  },
  cabTipText: { fontSize: 11, color: '#d97706', fontWeight: '600' },

  cabStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  cabStatItem: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 10,
    padding: 8,
  },
  cabStatGreen: { backgroundColor: '#f0fdf4' },
  cabStatBlue: { backgroundColor: '#eff6ff' },
  cabStatOrange: { backgroundColor: '#fff7ed' },
  cabStatPurple: { backgroundColor: '#faf5ff' },
  cabStatLabel: { fontSize: 9, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginBottom: 2 },
  cabStatValue: { fontSize: 12, fontWeight: '700', color: '#1e293b' },

  cabBookingSection: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  cabBookingLabel: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1, marginBottom: 8 },
  cabBookingButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cabBookingButton: { borderRadius: 10, overflow: 'hidden', flex: 1, minWidth: 120 },
  cabBookingGradient: { paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center' },
  cabBookingButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Operators
  operatorsGrid: { gap: 12 },
  operatorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  operatorHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  operatorIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fffbeb',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  operatorIcon: { fontSize: 24 },
  operatorName: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 2 },
  operatorSpecialty: { fontSize: 12, color: '#64748b', lineHeight: 18 },
  operatorButtons: { flexDirection: 'row', gap: 8 },
  operatorCallBtn: { flex: 1, borderRadius: 10, overflow: 'hidden' },
  operatorBookBtn: { flex: 1, borderRadius: 10, overflow: 'hidden' },
  operatorBtnGrad: { paddingVertical: 10, alignItems: 'center' },
  operatorBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // ===== BUS =====
  busSubTabs: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  busSubTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  busSubTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  busSubTabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  busSubTabTextActive: { color: '#059669' },

  busCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  busHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  busRouteIcon: { fontSize: 22 },
  busTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1e293b' },
  busType: { fontSize: 12, color: '#64748b', marginTop: 1 },
  busPriceBadge: {
    backgroundColor: '#f0fdfa',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  busPriceText: { fontSize: 12, fontWeight: '800', color: '#0f766e' },
  busRouteRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  busFrom: { flex: 1, fontSize: 13, fontWeight: '700', color: '#1e293b' },
  busArrow: { color: '#94a3b8', fontSize: 14 },
  busTo: { flex: 1, fontSize: 13, fontWeight: '700', color: '#1e293b', textAlign: 'right' },
  busSchedule: { fontSize: 13, color: '#475569', marginBottom: 8 },
  busViaContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 8 },
  busViaLabel: { fontSize: 12, color: '#94a3b8', marginRight: 4, marginTop: 2 },
  busViaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, flex: 1 },
  busViaChip: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  busViaChipText: { fontSize: 11, color: '#475569' },

  // ===== TRAIN =====
  stationCard: {
    backgroundColor: '#1e1b4b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stationIcon: { fontSize: 30, marginTop: 2 },
  stationInfo: { flex: 1 },
  stationName: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 2 },
  stationCode: { fontSize: 12, color: '#a5b4fc', fontWeight: '600', marginBottom: 2 },
  stationAddress: { fontSize: 12, color: '#c7d2fe', marginBottom: 8 },
  stationFacilities: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  facilityChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  facilityText: { fontSize: 11, color: '#e0e7ff', fontWeight: '600' },

  trainSectionLabel: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12 },

  trainCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  trainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trainNumberBadge: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  trainNumber: { fontSize: 12, fontWeight: '800', color: '#2563eb' },
  trainAvailBadge: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  trainAvailText: { fontSize: 11, fontWeight: '700', color: '#16a34a' },
  trainName: { fontSize: 15, fontWeight: '800', color: '#1e293b', marginBottom: 12 },

  trainRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  trainStop: { flex: 2 },
  trainStopLabel: { fontSize: 9, fontWeight: '900', color: '#94a3b8', letterSpacing: 1, marginBottom: 2 },
  trainStopName: { fontSize: 12, fontWeight: '700', color: '#1e293b', lineHeight: 16 },
  trainDeparture: { fontSize: 14, fontWeight: '800', color: '#4f46e5', marginTop: 2 },
  trainConnector: { flex: 1, alignItems: 'center', gap: 4 },
  trainLine: { height: 1, width: '80%', backgroundColor: '#e2e8f0' },
  trainDuration: { fontSize: 10, fontWeight: '700', color: '#64748b', textAlign: 'center' },

  trainFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  trainClasses: { fontSize: 12, color: '#64748b', fontWeight: '600', flex: 1 },
  trainFare: { fontSize: 14, fontWeight: '800', color: '#059669' },
});
