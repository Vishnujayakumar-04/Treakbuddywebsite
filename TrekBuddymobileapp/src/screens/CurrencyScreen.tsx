import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { spacing, radius } from '../theme/spacing';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export interface Currency {
    code: string;
    name: string;
    symbol: string;
}

const LOCAL_SUPPORTED_CURRENCIES: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

interface FirestorePlace {
  id?: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  timings: string;
  contact: string;
  type: string;
  mapUrl: string;
  image: string;
}

const SEED_DATA: FirestorePlace[] = [
  { id: '1', name: "Thomas Cook Forex - Puducherry", category: "currency_exchange", location: "Mission Street, Puducherry", rating: 4.5, timings: "10:00 AM - 7:00 PM", contact: "+91 9876543210", type: "Authorized Dealer", mapUrl: "https://www.google.com/maps/search/?api=1&query=Thomas+Cook+Forex+Puducherry", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80" },
  { id: '2', name: "Unimoni Financial Services", category: "currency_exchange", location: "Anna Salai, Puducherry", rating: 4.3, timings: "9:30 AM - 6:30 PM", contact: "+91 9123456780", type: "Forex & Remittance", mapUrl: "https://www.google.com/maps/search/?api=1&query=Unimoni+Puducherry", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80" },
  { id: '3', name: "Weizmann Forex Ltd", category: "currency_exchange", location: "MG Road, Puducherry", rating: 4.2, timings: "10:00 AM - 6:00 PM", contact: "+91 9988776655", type: "Forex Services", mapUrl: "https://www.google.com/maps/search/?api=1&query=Weizmann+Forex+Puducherry", image: "https://images.unsplash.com/photo-1621252179027-94459d278660?w=800&q=80" }
];

export default function CurrencyScreen({ navigation }: { navigation?: any }) {
  // Converter State
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('INR');

  // Modal Pickers
  const [openModal, setOpenModal] = useState<'from' | 'to' | null>(null);

  // Firestore Places
  const [places, setPlaces] = useState<FirestorePlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [filterType, setFilterType] = useState<'All' | 'Top Rated'>('All');

  const fetchRates = async () => {
    setLoadingRates(true);
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=INR');
      if (!res.ok) throw new Error(`Rates HTTP ${res.status}`);
      const data = await res.json();
      setRates(data.rates ?? null);
    } catch (e) {
      console.log('Failed to fetch live rates. Using offline fallback rates');
      setRates({
        USD: 0.012, GBP: 0.0094, EUR: 0.011, AUD: 0.018,
        CAD: 0.016, JPY: 1.83, SGD: 0.016, CHF: 0.011,
        MYR: 0.057, AED: 0.044, LKR: 3.65
      });
    } finally {
      setLoadingRates(false);
    }
  };

  const fetchFirebasePlaces = async () => {
    setLoadingPlaces(true);
    try {
      const placesRef = collection(db, 'places');
      const q = query(placesRef, where('category', '==', 'currency_exchange'));
      const querySnapshot = await getDocs(q);
      
      let fetchedPlaces: FirestorePlace[] = [];
      querySnapshot.forEach((doc) => {
        fetchedPlaces.push({ id: doc.id, ...(doc.data() as Omit<FirestorePlace, 'id'>) });
      });

      if (fetchedPlaces.length === 0) {
        throw new Error("Empty collection");
      }
      fetchedPlaces.sort((a, b) => b.rating - a.rating);
      setPlaces(fetchedPlaces);
    } catch (e: any) {
      console.log('Firestore Fetch Error — using local fallback data');
      setPlaces(SEED_DATA.sort((a, b) => b.rating - a.rating));
    } finally {
      setLoadingPlaces(false);
    }
  };

  useEffect(() => {
    fetchRates();
    fetchFirebasePlaces();
  }, []);

  const convertedAmount = useMemo(() => {
    if (!rates) return '—';
    const n = Number(amount);
    if (!Number.isFinite(n)) return '—';
    if (fromCurrency === toCurrency) return n.toFixed(2);

    const fromRate = fromCurrency === 'INR' ? 1 : rates[fromCurrency];
    const toRate = toCurrency === 'INR' ? 1 : rates[toCurrency];
    if (!fromRate || !toRate) return '—';

    const inINR = n / fromRate;
    const out = inINR * toRate;
    return out.toFixed(2);
  }, [amount, fromCurrency, rates, toCurrency]);

  const filteredPlaces = useMemo(() => {
    let result = places;
    if (filterType === 'Top Rated') {
      result = result.filter(place => place.rating > 4.3);
    }
    return result;
  }, [filterType, places]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const renderCurrencySelector = () => (
    <Modal visible={!!openModal} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <TouchableOpacity onPress={() => setOpenModal(null)}>
              <Feather name="x" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={LOCAL_SUPPORTED_CURRENCIES}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.currencyItem}
                onPress={() => {
                  if (openModal === 'from') setFromCurrency(item.code);
                  if (openModal === 'to') setToCurrency(item.code);
                  setOpenModal(null);
                }}
              >
                <Text style={styles.currencySymbol}>{item.symbol}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.currencyCode}>{item.code}</Text>
                  <Text style={styles.currencyName}>{item.name}</Text>
                </View>
                {(openModal === 'from' ? fromCurrency : toCurrency) === item.code && (
                  <Feather name="check-circle" size={20} color="#10b981" />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Currency Exchange</Text>
        <TouchableOpacity onPress={() => { fetchRates(); fetchFirebasePlaces(); }}>
          <Feather name="refresh-cw" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Converter Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.converterCard}>
          <LinearGradient colors={['#10b981', '#059669']} style={styles.converterGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            
            {/* From */}
            <View style={styles.converterRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.converterLabel}>Amount</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
              </View>
              <TouchableOpacity style={styles.currencySelector} onPress={() => setOpenModal('from')}>
                <Text style={styles.currencySelectorText}>{fromCurrency}</Text>
                <Feather name="chevron-down" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Swap */}
            <View style={styles.swapWrapper}>
              <View style={styles.swapLine} />
              <TouchableOpacity style={styles.swapButton} onPress={handleSwap} activeOpacity={0.8}>
                <Feather name="refresh-ccw" size={18} color="#059669" />
              </TouchableOpacity>
              <View style={styles.swapLine} />
            </View>

            {/* To */}
            <View style={styles.converterRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.converterLabel}>Received</Text>
                {loadingRates ? (
                  <ActivityIndicator color="#fff" style={{ alignSelf: 'flex-start', marginTop: 8 }} />
                ) : (
                  <Text style={styles.amountOutput} numberOfLines={1} adjustsFontSizeToFit>{convertedAmount}</Text>
                )}
              </View>
              <TouchableOpacity style={styles.currencySelector} onPress={() => setOpenModal('to')}>
                <Text style={styles.currencySelectorText}>{toCurrency}</Text>
                <Feather name="chevron-down" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

          </LinearGradient>
        </Animated.View>

        {/* Locations List */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Local Exchange Places</Text>
          <View style={styles.filterChipsRow}>
            {(['All', 'Top Rated'] as const).map(type => (
              <TouchableOpacity 
                key={type} 
                onPress={() => setFilterType(type)}
                style={[styles.filterChip, filterType === type && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, filterType === type && styles.filterChipTextActive]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {loadingPlaces ? (
          <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
        ) : (
          filteredPlaces.map((place, index) => (
            <Animated.View key={place.id} entering={FadeInUp.delay(200 + (index * 100))}>
              <View style={styles.placeCard}>
                <Image source={{ uri: place.image }} style={styles.placeImage} />
                <View style={styles.placeBadge}>
                    <Text style={styles.placeBadgeText}>⭐ {place.rating}</Text>
                </View>
                <View style={styles.placeContent}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeType}>{place.type}</Text>
                  
                  <View style={styles.placeDetailRow}>
                    <Feather name="map-pin" size={14} color="#64748b" style={styles.placeDetailIcon} />
                    <Text style={styles.placeDetailText} numberOfLines={2}>{place.location}</Text>
                  </View>
                  
                  <View style={styles.placeDetailRow}>
                    <Feather name="clock" size={14} color="#f59e0b" style={styles.placeDetailIcon} />
                    <Text style={styles.placeDetailText}>{place.timings}</Text>
                  </View>

                  <View style={styles.placeActionRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(place.mapUrl)}>
                      <Feather name="navigation" size={16} color="#fff" />
                      <Text style={styles.actionBtnText}>Directions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={() => Linking.openURL(`tel:${place.contact}`)}>
                      <Feather name="phone" size={16} color="#059669" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))
        )}

      </ScrollView>

      {renderCurrencySelector()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    paddingTop: STATUSBAR_HEIGHT + 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
  },
  backButton: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  converterCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  converterGradient: { padding: 24 },
  converterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  inputWrapper: { flex: 1, marginRight: 16 },
  converterLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  amountInput: {
    fontSize: 32, fontWeight: '900', color: '#fff', padding: 0, margin: 0,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.3)', paddingBottom: 4,
  },
  amountOutput: {
    fontSize: 32, fontWeight: '900', color: '#fff', padding: 0, margin: 0,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.3)', paddingBottom: 4,
  },
  currencySelector: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14,
  },
  currencySelectorText: { color: '#fff', fontSize: 18, fontWeight: '800', marginRight: 8 },
  swapWrapper: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  swapLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  swapButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginHorizontal: 12 },

  listHeader: { marginTop: 32, marginBottom: 16 },
  listTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  filterChipsRow: { flexDirection: 'row', gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0',
  },
  filterChipActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  filterChipText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  filterChipTextActive: { color: '#fff' },

  placeCard: {
    backgroundColor: '#fff', borderRadius: 20, marginBottom: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, elevation: 4,
  },
  placeImage: { width: '100%', height: 140, backgroundColor: '#e2e8f0' },
  placeBadge: {
    position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  placeBadgeText: { fontSize: 12, fontWeight: '800', color: '#1e293b' },
  placeContent: { padding: 16 },
  placeName: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 2 },
  placeType: { fontSize: 12, color: '#10b981', fontWeight: '700', marginBottom: 12 },
  placeDetailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  placeDetailIcon: { marginTop: 2, marginRight: 8 },
  placeDetailText: { flex: 1, fontSize: 13, color: '#64748b', lineHeight: 18 },
  placeActionRow: { flexDirection: 'row', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#059669', paddingVertical: 10, borderRadius: 12, gap: 8,
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  actionBtnOutline: { flex: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: '#059669', paddingHorizontal: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    height: '60%', padding: 20,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  separator: { height: 1, backgroundColor: '#f1f5f9' },
  currencyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 16 },
  currencySymbol: { fontSize: 24, fontWeight: '700', color: '#1e293b', width: 40, textAlign: 'center' },
  currencyCode: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  currencyName: { fontSize: 13, color: '#64748b', marginTop: 2 },
});
