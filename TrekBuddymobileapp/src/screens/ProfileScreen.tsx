import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  subscribeToUserTrips,
  subscribeToFavorites,
  subscribeToHistory,
  HistoryItem
} from '../utils/firestore';
import { StoredTrip, StoredFavorite } from '../utils/storage';
import { spacing, radius } from '../theme/spacing';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { SettingsMenuModal } from '../components/profile/SettingsMenuModal';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

type ActivePanel = 'none' | 'trips' | 'saved' | 'visited';

interface ProfileScreenProps {
  navigation?: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, userProfile, signOut, refreshUserProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [trips, setTrips] = useState<StoredTrip[]>([]);
  const [favorites, setFavorites] = useState<StoredFavorite[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');

  useEffect(() => {
    if (!user) return;
    const unsubTrips = subscribeToUserTrips(user.uid, setTrips);
    const unsubFavs = subscribeToFavorites(user.uid, setFavorites);
    const unsubHistory = subscribeToHistory(user.uid, setHistory);
    return () => { unsubTrips(); unsubFavs(); unsubHistory(); };
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: signOut },
    ]);
  };

  const handleStatPress = (panel: ActivePanel) => {
    setActivePanel(prev => prev === panel ? 'none' : panel);
  };

  // Not signed in
  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <Ionicons name="person-circle-outline" size={80} color="#0891b2" />
        <Text style={styles.guestTitle}>You're not signed in</Text>
        <Text style={styles.guestSub}>Sign in to view your profile, saved places and trips.</Text>
        <TouchableOpacity style={styles.signInBtn} onPress={() => navigation?.navigate('Login')}>
          <Text style={styles.signInBtnText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Loading profile
  if (!userProfile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  const displayName = userProfile.name || user.email?.split('@')[0] || 'Traveler';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  // Derive trip sub-counts
  const completedTrips = trips.filter(t => (t as any).status === 'completed' || (t as any).completed);
  const plannedTrips = trips.filter(t => (t as any).status === 'planned' || (!(t as any).completed && !(t as any).status));

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Gradient Header */}
      <LinearGradient
        colors={['#0c4a6e', '#0891b2', '#06b6d4']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Extra top spacing before avatar */}
        <View style={{ paddingTop: STATUSBAR_HEIGHT + 28 }}>
          {/* Avatar Row */}
          <View style={styles.avatarRow}>
            <TouchableOpacity
              onPress={() => setEditModalVisible(true)}
              style={styles.avatarContainer}
            >
              {userProfile.profilePhotoUrl ? (
                <Image
                  source={typeof userProfile.profilePhotoUrl === 'number' ? userProfile.profilePhotoUrl : { uri: userProfile.profilePhotoUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarLetter}>{avatarLetter}</Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Feather name="edit-2" size={10} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{userProfile.email}</Text>
              <View style={styles.travelerBadge}>
                <Ionicons name="airplane-outline" size={11} color="#7dd3fc" />
                <Text style={styles.travelerBadgeText}>Puducherry Explorer</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.menuTrigger}
              onPress={() => setMenuVisible(true)}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Feather name="more-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Stats Row — tappable */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={[styles.statItem, activePanel === 'trips' && styles.statItemActive]}
              onPress={() => handleStatPress('trips')}
              activeOpacity={0.7}
            >
              <Text style={styles.statValue}>{trips.length}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={[styles.statItem, activePanel === 'saved' && styles.statItemActive]}
              onPress={() => handleStatPress('saved')}
              activeOpacity={0.7}
            >
              <Text style={styles.statValue}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={[styles.statItem, activePanel === 'visited' && styles.statItemActive]}
              onPress={() => handleStatPress('visited')}
              activeOpacity={0.7}
            >
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>Visited</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0891b2" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >

        {/* ===== TRIPS PANEL ===== */}
        {activePanel === 'trips' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🗺️ My Trips</Text>

            {/* Completed sub-section */}
            <Text style={styles.subSectionLabel}>✅ Completed ({completedTrips.length})</Text>
            {completedTrips.length > 0 ? (
              completedTrips.map((trip, i) => (
                <View key={i} style={styles.tripRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                  <Text style={styles.tripName} numberOfLines={1}>{(trip as any).name || `Trip ${i + 1}`}</Text>
                  <Text style={styles.tripDate}>{(trip as any).date || ''}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyInline}>No completed trips yet.</Text>
            )}

            {/* Planned sub-section */}
            <Text style={[styles.subSectionLabel, { marginTop: 16 }]}>📅 AI Planned ({plannedTrips.length})</Text>
            {plannedTrips.length > 0 ? (
              plannedTrips.map((trip, i) => (
                <View key={i} style={styles.tripRow}>
                  <Ionicons name="calendar-outline" size={18} color="#0891b2" />
                  <Text style={styles.tripName} numberOfLines={1}>{(trip as any).name || `Trip ${i + 1}`}</Text>
                  <Text style={styles.tripDate}>{(trip as any).date || ''}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyInline}>No planned trips yet. Use AI Planner!</Text>
            )}
          </View>
        )}

        {/* ===== SAVED PLACES PANEL ===== */}
        {activePanel === 'saved' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>❤️ Saved Places</Text>
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <TouchableOpacity
                  key={fav.placeId}
                  style={styles.savedCard}
                  activeOpacity={0.85}
                  onPress={() => navigation?.navigate('PlaceDetails', { place: fav.place })}
                >
                  {/* Cover Image */}
                  <View style={styles.savedImageWrap}>
                    {fav.place?.image ? (
                      <Image
                        source={typeof fav.place.image === 'number' ? fav.place.image : { uri: fav.place.image }}
                        style={styles.savedImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.savedImage, styles.savedImagePlaceholder]}>
                        <Ionicons name="image-outline" size={32} color="#0891b2" />
                      </View>
                    )}
                    <LinearGradient
                      colors={['transparent', 'rgba(12,74,110,0.85)']}
                      style={styles.savedImageGradient}
                    />
                    {/* Category badge */}
                    {fav.place?.category && (
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{fav.place.category}</Text>
                      </View>
                    )}
                    {/* Rating badge */}
                    {fav.place?.rating != null && (
                      <View style={styles.ratingBadge}>
                        <Text style={styles.ratingBadgeText}>⭐ {fav.place.rating}</Text>
                      </View>
                    )}
                  </View>

                  {/* Info */}
                  <View style={styles.savedInfo}>
                    <Text style={styles.savedName} numberOfLines={1}>{fav.place?.name || 'Saved Place'}</Text>
                    {(fav.place as any)?.location ? (
                      <View style={styles.savedLocationRow}>
                        <Ionicons name="location-outline" size={12} color="#0891b2" />
                        <Text style={styles.savedLocation} numberOfLines={1}>{(fav.place as any).location}</Text>
                      </View>
                    ) : null}
                    {fav.place?.description ? (
                      <Text style={styles.savedDesc} numberOfLines={2}>
                        {typeof fav.place.description === 'string'
                          ? fav.place.description
                          : (fav.place.description as any)?.specialFeatures || JSON.stringify(fav.place.description).slice(0, 80)}
                      </Text>
                    ) : null}
                    {(fav.place as any)?.opening ? (
                      <View style={styles.savedMetaRow}>
                        <Ionicons name="time-outline" size={12} color="#64748b" />
                        <Text style={styles.savedMeta}>{(fav.place as any).opening}</Text>
                      </View>
                    ) : null}
                    {(fav.place as any)?.entryFee ? (
                      <View style={styles.savedMetaRow}>
                        <Ionicons name="ticket-outline" size={12} color="#64748b" />
                        <Text style={styles.savedMeta}>{(fav.place as any).entryFee}</Text>
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Ionicons name="heart-outline" size={32} color="#cbd5e1" />
                <Text style={styles.emptyText}>No saved places yet.{'\n'}Tap ♥ on any place to save it.</Text>
              </View>
            )}
          </View>
        )}

        {/* ===== VISITED PANEL ===== */}
        {activePanel === 'visited' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧭 Visited Places</Text>
            <Text style={styles.subSectionLabel}>Places you've been to — won't appear in new recommendations</Text>
            {history.length > 0 ? (
              history.map((item, i) => (
                <View key={i} style={styles.visitedRow}>
                  <View style={styles.visitedDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.visitedName} numberOfLines={1}>{(item as any).placeName || (item as any).name || `Place ${i + 1}`}</Text>
                    {(item as any).visitedAt && (
                      <Text style={styles.visitedDate}>
                        Visited: {new Date((item as any).visitedAt?.seconds * 1000 || (item as any).visitedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#22c55e" />
                </View>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Ionicons name="map-outline" size={32} color="#cbd5e1" />
                <Text style={styles.emptyText}>No visited places recorded yet.{'\n'}Explore Puducherry and check in!</Text>
              </View>
            )}
          </View>
        )}

        {/* Default: Saved Places quick-view when no panel active */}
        {activePanel === 'none' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>❤️ Saved Places</Text>
              {favorites.length > 0 && (
                <TouchableOpacity onPress={() => setActivePanel('saved')}>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              )}
            </View>
            {favorites.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 8 }}>
                {favorites.slice(0, 6).map((fav) => (
                  <TouchableOpacity
                    key={fav.placeId}
                    style={styles.favChip}
                    activeOpacity={0.85}
                    onPress={() => navigation?.navigate('PlaceDetails', { place: fav.place })}
                  >
                    {fav.place?.image ? (
                      <Image
                        source={typeof fav.place.image === 'number' ? fav.place.image : { uri: fav.place.image }}
                        style={styles.favChipImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.favChipImage, { backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' }]}>
                        <Ionicons name="image-outline" size={22} color="#0891b2" />
                      </View>
                    )}
                    <LinearGradient
                      colors={['transparent', 'rgba(12,74,110,0.75)']}
                      style={styles.favChipGradient}
                    />
                    <Text style={styles.favChipName} numberOfLines={2}>{fav.place?.name || 'Place'}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyBox}>
                <Ionicons name="heart-outline" size={32} color="#cbd5e1" />
                <Text style={styles.emptyText}>No saved places yet.{'\n'}Tap ♥ on any place to save it.</Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>

      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        userId={user.uid}
        currentName={userProfile.name}
        currentEmail={userProfile.email}
        currentPhotoUrl={userProfile.profilePhotoUrl || null}
        isDark={isDark}
        onProfileUpdated={refreshUserProfile}
      />

      <SettingsMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        userName={displayName}
        userEmail={userProfile.email || ''}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
  },
  editBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0369a1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
    paddingRight: 10,
  },
  menuTrigger: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  travelerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  travelerBadgeText: {
    fontSize: 10,
    color: '#7dd3fc',
    fontWeight: '700',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 4,
  },
  statItemActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },

  // Body
  body: {
    flex: 1,
    marginTop: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  seeAll: {
    fontSize: 13,
    color: '#0891b2',
    fontWeight: '700',
  },

  // Trips Panel
  subSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tripName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  tripDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  emptyInline: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
    paddingVertical: 6,
  },

  // Saved Full Cards
  savedCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  savedImageWrap: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  savedImage: {
    width: '100%',
    height: '100%',
  },
  savedImagePlaceholder: {
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#0891b2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  savedInfo: {
    padding: 12,
    gap: 4,
  },
  savedName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  savedLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  savedLocation: {
    fontSize: 12,
    color: '#0891b2',
    fontWeight: '600',
    flex: 1,
  },
  savedDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginTop: 4,
  },
  savedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  savedMeta: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },

  // Visited Panel
  visitedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  visitedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0891b2',
  },
  visitedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  visitedDate: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
  },

  // Default fav chip (horizontal scroll)
  favChip: {
    width: 110,
    height: 130,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  favChipImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  favChipGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  favChipName: {
    padding: 8,
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },

  // Empty states
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Guest state
  guestTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  guestSub: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
    marginBottom: 24,
  },
  signInBtn: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  signInBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
