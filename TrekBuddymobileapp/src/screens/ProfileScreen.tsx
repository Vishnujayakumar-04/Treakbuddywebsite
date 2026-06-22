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
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';
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

type ActivePanel = 'none' | 'trips' | 'saved' | 'visited';

export default function ProfileScreen({ navigation }: { navigation?: any }) {
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

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <View style={styles.guestGlow} />
        <Ionicons name="person-circle-outline" size={100} color="rgba(34,211,238,0.8)" />
        <Text style={styles.guestTitle}>Restricted Access</Text>
        <Text style={styles.guestSub}>Secure your cloud traveler ID to view saved itineraries.</Text>
        <TouchableOpacity style={styles.signInBtnWrapper} onPress={() => navigation?.navigate('Login')} activeOpacity={0.8}>
           <LinearGradient colors={['#06b6d4', '#2563eb']} style={styles.signInBtn}>
             <Text style={styles.signInBtnText}>Connect Traveler ID</Text>
           </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ActivityIndicator size="large" color="#22d3ee" />
      </View>
    );
  }

  const displayName = userProfile.name || user.email?.split('@')[0] || 'Traveler';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const completedTrips = trips.filter(t => (t as any).status === 'completed' || (t as any).completed);
  const plannedTrips = trips.filter(t => (t as any).status === 'planned' || (!(t as any).completed && !(t as any).status));

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Hero Header Space */}
      <View style={styles.header}>
        <LinearGradient colors={['rgba(6,182,212,0.15)', 'transparent']} style={StyleSheet.absoluteFillObject} />
        <View style={{ paddingTop: STATUSBAR_HEIGHT + 20, zIndex: 10 }}>
          <View style={styles.avatarRow}>
            <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.avatarContainer}>
              {userProfile.profilePhotoUrl ? (
                <Image source={typeof userProfile.profilePhotoUrl === 'number' ? userProfile.profilePhotoUrl : { uri: userProfile.profilePhotoUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarLetter}>{avatarLetter}</Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Feather name="edit-2" size={12} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{userProfile.email}</Text>
              <View style={styles.travelerBadge}>
                <Ionicons name="flash" size={12} color="#22d3ee" />
                <Text style={styles.travelerBadgeText}>PRO TRAVELER</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.menuTrigger} onPress={() => setMenuVisible(true)}>
              <Feather name="settings" size={24} color="#f8fafc" />
            </TouchableOpacity>
          </View>

          {/* Stats Glass Row */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
            <TouchableOpacity style={[styles.statItem, activePanel === 'trips' && styles.statItemActive]} onPress={() => handleStatPress('trips')} activeOpacity={0.7}>
              <Text style={styles.statValue}>{trips.length}</Text>
              <Text style={styles.statLabel}>Journeys</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={[styles.statItem, activePanel === 'saved' && styles.statItemActive]} onPress={() => handleStatPress('saved')} activeOpacity={0.7}>
              <Text style={styles.statValue}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Vault</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={[styles.statItem, activePanel === 'visited' && styles.statItemActive]} onPress={() => handleStatPress('visited')} activeOpacity={0.7}>
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>History</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22d3ee" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* TRIPS PANEL */}
        {activePanel === 'trips' && (
          <Animated.View entering={FadeInDown.springify()} layout={Layout.springify()} style={styles.section}>
            <View style={styles.glassFrosting} />
            <Text style={styles.sectionTitle}>My Journeys</Text>

            <Text style={styles.subSectionLabel}>Completed</Text>
            {completedTrips.length > 0 ? (
              completedTrips.map((trip, i) => (
                <View key={i} style={styles.tripRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                  <Text style={styles.tripName} numberOfLines={1}>{(trip as any).name || `Trip ${i + 1}`}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyInline}>No completed trips yet.</Text>
            )}

            <Text style={[styles.subSectionLabel, { marginTop: 16 }]}>Active Plans</Text>
            {plannedTrips.length > 0 ? (
              plannedTrips.map((trip, i) => (
                <View key={i} style={styles.tripRow}>
                  <Feather name="map" size={16} color="#22d3ee" />
                  <Text style={styles.tripName} numberOfLines={1}>{(trip as any).name || `Trip ${i + 1}`}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyInline}>No planned trips yet. Use AI Planner!</Text>
            )}
          </Animated.View>
        )}

        {/* SAVED PLACES PANEL */}
        {activePanel === 'saved' && (
          <Animated.View entering={FadeInDown.springify()} layout={Layout.springify()} style={styles.section}>
            <View style={styles.glassFrosting} />
            <Text style={styles.sectionTitle}>Vaulted Places</Text>
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <TouchableOpacity
                  key={fav.placeId}
                  style={styles.savedCard}
                  activeOpacity={0.85}
                  onPress={() => navigation?.navigate('PlaceDetails', { place: fav.place })}
                >
                  <View style={styles.savedImageWrap}>
                    {fav.place?.image ? (
                      <Image source={typeof fav.place.image === 'number' ? fav.place.image : { uri: fav.place.image }} style={styles.savedImage} />
                    ) : (
                      <View style={[styles.savedImage, styles.savedImagePlaceholder]}>
                        <Ionicons name="image-outline" size={32} color="#22d3ee" />
                      </View>
                    )}
                    <LinearGradient colors={['transparent', '#0f172a']} style={styles.savedImageGradient} />
                    {fav.place?.category && (
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{fav.place.category}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.savedInfo}>
                    <Text style={styles.savedName} numberOfLines={1}>{fav.place?.name || 'Saved Place'}</Text>
                    {fav.place?.description && <Text style={styles.savedDesc} numberOfLines={2}>{typeof fav.place.description === 'string' ? fav.place.description : JSON.stringify(fav.place.description).slice(0, 80)}</Text>}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Ionicons name="heart-outline" size={40} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>Vault is secured but empty.</Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* VISITED PANEL */}
        {activePanel === 'visited' && (
          <Animated.View entering={FadeInDown.springify()} layout={Layout.springify()} style={styles.section}>
            <View style={styles.glassFrosting} />
            <Text style={styles.sectionTitle}>History Logs</Text>
            <Text style={styles.subSectionLabel}>Locations excluded from AI suggestions</Text>
            {history.length > 0 ? (
              history.map((item, i) => (
                <View key={i} style={styles.visitedRow}>
                  <View style={styles.visitedDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.visitedName} numberOfLines={1}>{(item as any).placeName || (item as any).name || `Place ${i + 1}`}</Text>
                  </View>
                  <Feather name="check" size={16} color="#22c55e" />
                </View>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Feather name="clock" size={40} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>No check-ins performed yet.</Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* DEFAULT VIEW */}
        {activePanel === 'none' && (
          <Animated.View entering={FadeInDown.springify()} layout={Layout.springify()} style={[styles.section, { backgroundColor: 'transparent', borderWidth: 0 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: 20 }]}>Quick Vault</Text>
              {favorites.length > 0 && (
                <TouchableOpacity onPress={() => setActivePanel('saved')}>
                  <Text style={styles.seeAll}>Expand</Text>
                </TouchableOpacity>
              )}
            </View>
            {favorites.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                {favorites.slice(0, 6).map((fav) => (
                  <TouchableOpacity
                    key={fav.placeId}
                    style={styles.favChip}
                    onPress={() => navigation?.navigate('PlaceDetails', { place: fav.place })}
                  >
                    {fav.place?.image ? (
                      <Image source={typeof fav.place.image === 'number' ? fav.place.image : { uri: fav.place.image }} style={styles.favChipImage} />
                    ) : (
                      <View style={[styles.favChipImage, { backgroundColor: '#1e293b' }]} />
                    )}
                    <LinearGradient colors={['transparent', 'rgba(2,6,23,0.95)']} style={styles.favChipGradient} />
                    <Text style={styles.favChipName} numberOfLines={2}>{fav.place?.name || 'Place'}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={[styles.emptyBox, { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 }]}>
                <Ionicons name="folder-open-outline" size={40} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>Your fast-access vault is empty.</Text>
              </View>
            )}
          </Animated.View>
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
    backgroundColor: '#020617', // Ultimate depth dark mode
  },
  header: {
    position: 'relative',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    marginRight: spacing.md,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#22d3ee',
  },
  avatarImage: {
    width: '100%', height: '100%', borderRadius: 40,
  },
  avatarPlaceholder: {
    width: '100%', height: '100%', borderRadius: 40,
    backgroundColor: 'rgba(34,211,238,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 32, fontWeight: '900', color: '#22d3ee',
  },
  editBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#06b6d4', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#020617',
  },
  userInfo: { flex: 1, paddingRight: 10 },
  userName: { fontSize: 24, fontWeight: '900', color: '#f8fafc', marginBottom: 2 },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 },
  travelerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: 'rgba(34,211,238,0.1)', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(34,211,238,0.2)',
  },
  travelerBadgeText: { fontSize: 9, color: '#22d3ee', fontWeight: '900', letterSpacing: 1 },
  menuTrigger: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  statsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24,
    paddingVertical: 16, paddingHorizontal: spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statItemActive: { opacity: 0.5 },
  statValue: { fontSize: 20, fontWeight: '900', color: '#f8fafc' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '700', marginTop: 4, letterSpacing: 0.5 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 8 },
  body: { flex: 1, marginTop: 10 },
  section: {
    marginHorizontal: 16, marginBottom: 16, borderRadius: 24, padding: 20,
    backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative', overflow: 'hidden',
  },
  glassFrosting: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.4)' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#f8fafc', marginBottom: 16, letterSpacing: -0.5 },
  seeAll: { fontSize: 14, color: '#22d3ee', fontWeight: '700' },
  subSectionLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  tripName: { flex: 1, fontSize: 15, fontWeight: '700', color: '#cbd5e1' },
  emptyInline: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', paddingVertical: 10 },
  savedCard: {
    borderRadius: 20, overflow: 'hidden', marginBottom: 16, backgroundColor: '#0f172a',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  savedImageWrap: { width: '100%', height: 140, position: 'relative' },
  savedImage: { width: '100%', height: '100%' },
  savedImagePlaceholder: { backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  savedImageGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  categoryBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  categoryBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', textTransform: 'capitalize' },
  savedInfo: { padding: 16 },
  savedName: { fontSize: 16, fontWeight: '900', color: '#f8fafc', marginBottom: 4 },
  savedDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 20 },
  visitedRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  visitedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22d3ee' },
  visitedName: { fontSize: 15, fontWeight: '700', color: '#cbd5e1' },
  favChip: { width: 140, height: 180, borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  favChipImage: { position: 'absolute', width: '100%', height: '100%' },
  favChipGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 90 },
  favChipName: { padding: 12, fontSize: 14, fontWeight: '800', color: '#f8fafc', lineHeight: 20 },
  emptyBox: { alignItems: 'center', paddingVertical: 40, gap: 16 },
  emptyText: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontWeight: '500' },
  guestGlow: { position: 'absolute', top: 200, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(34,211,238,0.15)', filter: 'blur(50px)' },
  guestTitle: { fontSize: 28, fontWeight: '900', color: '#f8fafc', marginTop: 24, marginBottom: 8 },
  guestSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22, marginBottom: 32 },
  signInBtnWrapper: { borderRadius: 16, overflow: 'hidden', shadowColor: '#22d3ee', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  signInBtn: { paddingHorizontal: 40, paddingVertical: 18, alignItems: 'center' },
  signInBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});
