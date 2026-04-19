import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Linking,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { spacing, radius } from '../theme/spacing';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

// --- DATA CONSTANTS ---
import emergencyData from '../data/emergency.json';

const HOSPITALS = (emergencyData.hospitals || []).map((h: any) => ({
  name: h.name,
  type: h.type,
  specialty: h.speciality || h.specialty,
  address: h.area || h.address || 'Puducherry',
  phone: h.phone,
  tags: h.facilities ? h.facilities.split(',').slice(0, 2).map((s: string) => s.trim()) : (h.tags || [])
}));

const POLICE_STATIONS = (emergencyData.policeStations || []).map((p: any) => ({
  name: p.name,
  area: p.areaCovered || p.area || 'Puducherry',
  phone: p.phone,
  type: p.type
}));

const FIRE_STATIONS = (emergencyData.fireStations || []).map((f: any) => ({
  name: f.name,
  area: f.area || f.serviceArea || 'Puducherry',
  phone: f.phone
}));

const PHARMACIES = (emergencyData.pharmacies || []).map((p: any) => ({
  name: p.name,
  address: p.area || p.address || 'Puducherry',
  phone: p.phone,
  tags: p.is24x7 ? ["24x7", p.type] : [p.type]
}));

const QUICK_CONTACTS = emergencyData.quickContacts || {
  police: "100", ambulance: "108", fire: "101", womenHelpline: "1091"
};


export default function EmergencyScreenTab() {
  const [activeTab, setActiveTab] = useState('hospitals');

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => { });
  };

  const handleLocation = (name: string, address: string, mapUrl?: string) => {
    const url = mapUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address} Puducherry`)}`;
    Linking.openURL(url).catch(() => { });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'hospitals':
        return HOSPITALS.map((item, index) => (
          <FacilityCard key={index} item={item} index={index} icon="hospital-building" type="hospital" onCall={handleCall} onLocation={handleLocation} />
        ));
      case 'police':
        return POLICE_STATIONS.map((item, index) => (
          <ContactRow key={index} item={item} index={index} icon="shield" color="blue" onCall={handleCall} onLocation={handleLocation} />
        ));
      case 'fire':
        return FIRE_STATIONS.map((item, index) => (
          <ContactRow key={index} item={item} index={index} icon="fire" color="orange" onCall={handleCall} onLocation={handleLocation} />
        ));
      case 'pharmacy':
        return PHARMACIES.map((item, index) => (
          <FacilityCard key={index} item={item} index={index} icon="pill" type="pharmacy" onCall={handleCall} onLocation={handleLocation} />
        ));
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      {/* Reduced height and adjusted padding for less "clumsy" look */}
      <LinearGradient
        colors={['#0f172a', '#334155']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.headerTopRow}>
              <View>
                <View style={styles.badgeContainer}>
                  <Feather name="alert-circle" size={12} color="#fca5a5" />
                  <Text style={styles.badgeText}>24x7 Support</Text>
                </View>
                <Text style={styles.headerTitle}>Emergency <Text style={{ color: '#f87171' }}>Helpline</Text></Text>
                <Text style={styles.headerSubtitle}>Tap below to dial instantly.</Text>
              </View>
              {/* Visual Graphic or Icon can go here if needed, keeping it clean for now */}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >

        {/* Quick Dial Grid - SINGLE ROW (1x4) */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.quickDialContainer}>
          {/* <Text style={styles.sectionTitle}>Quick Dial</Text> */}
          <View style={styles.singleRowGrid}>
            <QuickDialCard label="Police" number={QUICK_CONTACTS.police || "100"} icon="shield" color="#3b82f6" onPress={() => handleCall(QUICK_CONTACTS.police || '100')} />
            <QuickDialCard label="Ambulance" number={QUICK_CONTACTS.ambulance || "108"} icon="ambulance" color="#ef4444" onPress={() => handleCall(QUICK_CONTACTS.ambulance || '108')} />
            <QuickDialCard label="Fire" number={QUICK_CONTACTS.fire || "101"} icon="fire" color="#f97316" onPress={() => handleCall(QUICK_CONTACTS.fire || '101')} />
            <QuickDialCard label="Women" number={QUICK_CONTACTS.womenHelpline || "1091"} icon="phone" color="#ec4899" onPress={() => handleCall(QUICK_CONTACTS.womenHelpline || '1091')} />
          </View>
        </Animated.View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 12 }}>
            <TabButton active={activeTab === 'hospitals'} label="Hospitals" icon="activity" onPress={() => setActiveTab('hospitals')} />
            <TabButton active={activeTab === 'police'} label="Police" icon="shield" onPress={() => setActiveTab('police')} />
            <TabButton active={activeTab === 'fire'} label="Fire" icon="alert-circle" onPress={() => setActiveTab('fire')} />
            <TabButton active={activeTab === 'pharmacy'} label="Pharmacy" icon="plus-circle" onPress={() => setActiveTab('pharmacy')} />
          </ScrollView>
        </View>

        {/* List Content */}
        <View style={styles.listContainer}>
          {renderContent()}
        </View>

      </ScrollView>
    </View>
  );
}

// --- SUB COMPONENTS ---

function QuickDialCard({ label, number, icon, color, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.cardWrapper}>
      <View style={[styles.quickCard, { shadowColor: color }]}>
        <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]}>
          <MaterialCommunityIcons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.quickLabel}>{label}</Text>
        <Text style={[styles.quickNumber, { color: color }]}>{number}</Text>
      </View>
    </TouchableOpacity>
  );
}

function TabButton({ active, label, icon, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tabButton,
        active && styles.tabButtonActive,
      ]}
    >
      <Feather name={icon} size={14} color={active ? '#fff' : '#64748b'} />
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function FacilityCard({ item, index, icon, type, onCall, onLocation }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()} style={styles.facilityCard}>
      <View style={styles.facilityHeader}>
        <View style={styles.facilityTypeContainer}>
          <MaterialCommunityIcons name={icon} size={20} color={type === 'hospital' ? '#ef4444' : '#10b981'} />
          <View>
            <Text style={styles.cardTitle}>{item.name}</Text>
            {item.type && <Text style={styles.facilityTypeBadge}>{item.type}</Text>}
          </View>
        </View>
      </View>

      {item.specialty && <Text style={styles.cardSubtitle}>{item.specialty}</Text>}

      <View style={styles.infoRow}>
        <Feather name="map-pin" size={12} color="#64748b" />
        <Text style={styles.infoText}>{item.address}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.tagsRow}>
          {item.tags?.map((tag: string, i: number) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => onLocation(item.name, item.address, item.mapUrl)}
            style={[styles.miniCallAction, { backgroundColor: '#0284c7' }]}
          >
            <Feather name="map-pin" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onCall(item.phone)} style={styles.miniCallAction}>
            <Feather name="phone" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

function ContactRow({ item, index, icon, color, onCall, onLocation }: any) {
  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()} style={styles.rowCard}>
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, { backgroundColor: color === 'blue' ? '#eff6ff' : '#fff7ed' }]}>
          <Feather name={icon === 'shield' ? 'shield' : 'alert-triangle'} size={20} color={color === 'blue' ? '#3b82f6' : '#f97316'} />
        </View>
        <View>
          <Text style={styles.rowTitle}>{item.name}</Text>
          <Text style={styles.rowSubtitle}>{item.area}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={() => onLocation(item.name, item.area, item.mapUrl)}
          style={[styles.rowCallBtn, { backgroundColor: '#0284c7' }]}
        >
          <Feather name="map-pin" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onCall(item.phone)} style={[styles.rowCallBtn, { backgroundColor: color === 'blue' ? '#3b82f6' : '#f97316' }]}>
          <Feather name="phone" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: STATUSBAR_HEIGHT + spacing.md,
    paddingBottom: 40, // Increased bottom padding to overlap content
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    marginTop: spacing.xs,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fca5a5',
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#cbd5e1',
    marginTop: 2,
  },
  content: {
    flex: 1,
    marginTop: -30, // Pull up to overlap header
  },
  quickDialContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: spacing.sm,
    opacity: 0.9,
    paddingLeft: 4,
  },
  singleRowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardWrapper: {
    flex: 1, // Distribute equal width
  },
  quickCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16, // Vertical padding for height
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 110, // Fixed height for uniformity
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 2,
    textAlign: 'center',
  },
  quickNumber: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  // Tabs
  tabsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20, // Pill shape
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#fff',
  },
  // Lists
  listContainer: {
    paddingHorizontal: spacing.lg,
    gap: 12,
  },
  // Facility Card
  facilityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  facilityTypeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  facilityTypeBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 0,
    flexShrink: 1,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
    marginLeft: 32, // Indent to align with title (icon width + gap)
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
    marginLeft: 32,
  },
  infoText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 32,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  miniCallAction: {
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 10,
  },
  // Row Card (Police/Fire)
  rowCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  rowCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
