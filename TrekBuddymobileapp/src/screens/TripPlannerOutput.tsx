import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  StatusBar,
  Linking,
  Alert,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { TripDraft, DailyItinerary, DayActivity } from '../types/planner';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { LottieAnimation } from '../components/LottieAnimation';
import { LOTTIE_ANIMATIONS } from '../assets/lottie/animations';
import { db } from '../firebase/firestore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface TripPlannerOutputProps {
  route?: any;
  navigation?: any;
}

export default function TripPlannerOutput({ route, navigation }: TripPlannerOutputProps) {
  const tripData = route?.params?.tripData as TripDraft;
  const itinerary = route?.params?.itinerary as DailyItinerary[];
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const toggleDay = (dayNum: number) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to save this itinerary.');
      return;
    }

    setIsSaving(true);
    try {
      const tripToSave = {
        userId: user.uid,
        name: tripData.name || 'Puducherry Adventure',
        type: tripData.type || 'Custom Trip',
        places: itinerary.reduce((acc, curr) => acc + curr.activities.length, 0),
        status: 'planned',
        createdAt: serverTimestamp(),
        budgetType: tripData.budgetType,
        budgetAmount: tripData.budgetAmount,
        travelers: tripData.travelers,
        pace: tripData.pace,
        interests: tripData.interests,
        itinerary: itinerary.map(day => ({
          dayNumber: day.dayNumber,
          date: day.date,
          notes: day.notes,
          activities: day.activities
        }))
      };

      await addDoc(collection(db, 'users', user.uid, 'trips'), tripToSave);

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        if (navigation) {
          navigation.navigate('MyTrips');
        }
      }, 2000);
    } catch (error) {
      console.error('Error saving trip:', error);
      Alert.alert('Error', 'Failed to save the itinerary. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  const openMap = (placeName: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ' Puducherry')}`;
    Linking.openURL(url);
  };

  const renderActivity = (activity: DayActivity, index: number) => (
    <View key={index} style={styles.activityCard}>
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{activity.timeRange.split(' - ')[0]}</Text>
        <View style={styles.timelineLine} />
      </View>
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text style={styles.placeName}>{activity.placeName}</Text>
          <TouchableOpacity onPress={() => openMap(activity.placeName)}>
            <Feather name="map-pin" size={16} color="#06b6d4" />
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>
          {typeof activity.description === 'string'
            ? activity.description
            : (activity.description as any)?.specialFeatures || 'No description available'}
        </Text>
        {activity.tips && (
          <View style={styles.tipContainer}>
            <Feather name="info" size={14} color="#854d0e" />
            <Text style={styles.tipText}>{activity.tips}</Text>
          </View>
        )}
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{activity.timeSlot}</Text>
          </View>
          {activity.travelTime && (
            <View style={[styles.tag, { backgroundColor: '#e0f2fe' }]}>
              <Text style={[styles.tagText, { color: '#0284c7' }]}>{activity.travelTime} travel</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderDay = (day: DailyItinerary) => {
    const isExpanded = expandedDay === day.dayNumber;
    return (
      <View key={day.dayNumber} style={styles.dayContainer}>
        <TouchableOpacity
          style={[styles.dayHeader, isExpanded && styles.dayHeaderActive]}
          onPress={() => toggleDay(day.dayNumber)}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.dayTitle}>Day {day.dayNumber}</Text>
            <Text style={styles.dayDate}>{new Date(day.date).toDateString()}</Text>
          </View>
          <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="#475569" />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.dayContent}>
            <Text style={styles.daySummary}>{day.notes}</Text>
            {day.activities.map((act, idx) => renderActivity(act, idx))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1e293b" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{tripData.name || 'My Trip'}</Text>
            <Text style={styles.headerSubtitle}>{tripData.travelers} Travelers • {tripData.budgetType === 'total' ? '₹' + tripData.budgetAmount : '₹' + tripData.budgetAmount + '/person'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.saveButtonHeader, isSaving && { opacity: 0.5 }]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <LottieAnimation source={LOTTIE_ANIMATIONS.aiLoading} width={24} height={24} loop autoPlay />
            ) : (
              <Feather name="bookmark" size={24} color="#06b6d4" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Trip Info Card */}
          <View style={styles.tripInfoCard}>
            <LinearGradient colors={['#06b6d4', '#2563eb']} style={styles.gradientBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Feather name="calendar" size={16} color="#fff" />
                <Text style={styles.infoText}>{itinerary.length} Days</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="map" size={16} color="#fff" />
                <Text style={styles.infoText}>{tripData.interests.length} Interests</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="activity" size={16} color="#fff" />
                <Text style={styles.infoText}>{tripData.pace}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Your Itinerary</Text>
          <View style={styles.daysList}>
            {itinerary.map(renderDay)}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Success Modal */}
      {isSaved && (
        <Modal transparent visible animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LottieAnimation
                source={LOTTIE_ANIMATIONS.success}
                width={120}
                height={120}
                loop={false}
                autoPlay={true}
              />
              <Text style={styles.modalTitle}>Trip Saved!</Text>
              <Text style={styles.modalText}>Your itinerary has been saved to your profile.</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  safeArea: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 8,
  },
  saveButtonHeader: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  tripInfoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    height: 100,
    justifyContent: 'center',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoItem: {
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  daysList: {
    gap: 16,
  },
  dayContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  dayHeaderActive: {
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  dayDate: {
    fontSize: 14,
    color: '#64748b',
  },
  dayContent: {
    padding: 16,
  },
  daySummary: {
    fontSize: 14,
    color: '#475569',
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 20,
  },
  activityCard: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timeColumn: {
    width: 60,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#06b6d4',
    marginBottom: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 1,
  },
  activityContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginLeft: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    lineHeight: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fefce8',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#854d0e',
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});
