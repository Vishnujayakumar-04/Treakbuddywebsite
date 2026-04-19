import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { generateItinerary } from '../services/aiPlanner';
import { TripDraft, TripType, TravelPace, BudgetType, TripInterest, StayArea, TransportType } from '../types/planner';
import { spacing, radius } from '../theme/spacing';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

const INITIAL_DRAFT: TripDraft = {
  name: '',
  type: 'Solo',
  travelers: 1,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000 * 2).toISOString(), // +2 days
  budgetAmount: 5000,
  budgetType: 'per person',
  pace: 'Balanced',
  interests: ['Beaches', 'Heritage'],
  stayArea: 'Not decided',
  transport: 'Mixed',
  mobilityDetails: false,
  travelingWithKids: false,
  travelingWithElderly: false,
  preferredStartTime: 'Morning'
};

const STEPS = ['Basics', 'Dates', 'Preferences', 'Review'];

export default function TripPlannerScreen({ navigation }: { navigation?: any }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<TripDraft>(INITIAL_DRAFT);
  const [loading, setLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const updateDraft = (updates: Partial<TripDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (step === 0 && !draft.name.trim()) {
      Alert.alert("Missing Info", "Please enter a trip name.");
      return;
    }
    if (step === 1) {
      const start = new Date(draft.startDate);
      const end = new Date(draft.endDate);
      if (end < start) {
        Alert.alert("Invalid Dates", "End date cannot be before start date.");
        return;
      }
    }
    if (step === 2 && draft.interests.length === 0) {
      Alert.alert("Missing Info", "Please select at least one interest.");
      return;
    }

    if (step < STEPS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleGenerate = async () => {
    // if (!user) { Alert.alert("Login Required", "Please login to save trips."); return; } // Relaxed for prototype

    try {
      setLoading(true);
      const itinerary = await generateItinerary(draft);
      // Navigate to output
      navigation?.navigate('TripPlannerOutput', {
        tripData: { ...draft, itinerary },
        itinerary: itinerary
      });
    } catch (error: any) {
      Alert.alert("Generation Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: TripInterest) => {
    setDraft(prev => {
      const exists = prev.interests.includes(interest);
      if (exists) return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      return { ...prev, interests: [...prev.interests, interest] };
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 0: // Basics
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Let's start with the basics</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Trip Name</Text>
              <TextInput
                style={styles.input}
                value={draft.name}
                onChangeText={(t) => updateDraft({ name: t })}
                placeholder="e.g. Summer Vacation in Pondy"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Trip Type</Text>
              <View style={styles.chipContainer}>
                {['Solo', 'Friends', 'Family', 'Honeymoon', 'Business + Leisure'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.chip, draft.type === t && styles.chipActive]}
                    onPress={() => updateDraft({ type: t as TripType })}
                  >
                    <Text style={[styles.chipText, draft.type === t && styles.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Travelers: {draft.travelers}</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity style={styles.counterBtn} onPress={() => updateDraft({ travelers: Math.max(1, draft.travelers - 1) })}>
                  <Feather name="minus" size={24} color="#475569" />
                </TouchableOpacity>
                <Text style={styles.counterText}>{draft.travelers}</Text>
                <TouchableOpacity style={styles.counterBtn} onPress={() => updateDraft({ travelers: Math.min(20, draft.travelers + 1) })}>
                  <Feather name="plus" size={24} color="#475569" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        );

      case 1: // Dates
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <Text style={styles.stepTitle}>When are you going?</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}>
                <Feather name="calendar" size={20} color="#64748b" />
                <Text style={styles.dateText}>{new Date(draft.startDate).toDateString()}</Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={new Date(draft.startDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(e, date) => {
                    setShowStartDatePicker(false);
                    if (date) updateDraft({ startDate: date.toISOString() });
                  }}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndDatePicker(true)}>
                <Feather name="calendar" size={20} color="#64748b" />
                <Text style={styles.dateText}>{new Date(draft.endDate).toDateString()}</Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={new Date(draft.endDate)}
                  mode="date"
                  minimumDate={new Date(draft.startDate)}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(e, date) => {
                    setShowEndDatePicker(false);
                    if (date) updateDraft({ endDate: date.toISOString() });
                  }}
                />
              )}
            </View>
          </Animated.View>
        );

      case 2: // Preferences
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What do you like?</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Interests (Select multiple)</Text>
              <View style={styles.chipContainer}>
                {['Beaches', 'Heritage', 'Spiritual', 'Food & Cafes', 'Nature', 'Adventure', 'Shopping'].map((i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.chip, draft.interests.includes(i as TripInterest) && styles.chipActive]}
                    onPress={() => toggleInterest(i as TripInterest)}
                  >
                    <Text style={[styles.chipText, draft.interests.includes(i as TripInterest) && styles.chipTextActive]}>{i}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pace</Text>
              <View style={styles.chipContainer}>
                {['Relaxed', 'Balanced', 'Fast-paced'].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.chip, draft.pace === p && styles.chipActive]}
                    onPress={() => updateDraft({ pace: p as TravelPace })}
                  >
                    <Text style={[styles.chipText, draft.pace === p && styles.chipTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Budget (approx)</Text>
              <TextInput
                style={styles.input}
                value={draft.budgetAmount.toString()}
                onChangeText={(t) => updateDraft({ budgetAmount: parseInt(t) || 0 })}
                keyboardType="numeric"
                placeholder="Amount in INR"
              />
              <View style={[styles.chipContainer, { marginTop: 10 }]}>
                {['per person', 'total'].map((b) => (
                  <TouchableOpacity
                    key={b}
                    style={[styles.chip, draft.budgetType === b && styles.chipActive]}
                    onPress={() => updateDraft({ budgetType: b as BudgetType })}
                  >
                    <Text style={[styles.chipText, draft.budgetType === b && styles.chipTextActive]}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>
        );

      case 3: // Review
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Ready to plan?</Text>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewLabel}>Trip Name</Text>
              <Text style={styles.reviewValue}>{draft.name || 'Untitled Trip'}</Text>

              <Text style={styles.reviewLabel}>Dates</Text>
              <Text style={styles.reviewValue}>{new Date(draft.startDate).toDateString()} - {new Date(draft.endDate).toDateString()}</Text>

              <Text style={styles.reviewLabel}>Travelers</Text>
              <Text style={styles.reviewValue}>{draft.travelers} ({draft.type})</Text>

              <Text style={styles.reviewLabel}>Interests</Text>
              <Text style={styles.reviewValue}>{draft.interests.join(', ')}</Text>

              <Text style={styles.reviewLabel}>Budget</Text>
              <Text style={styles.reviewValue}>₹{draft.budgetAmount} ({draft.budgetType})</Text>
            </View>

            <TouchableOpacity style={styles.generateButton} onPress={handleGenerate} disabled={loading}>
              <LinearGradient
                colors={['#06b6d4', '#2563eb']}
                style={styles.generateGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.generateText}>{loading ? 'Generating Itinerary...' : 'Generate Trip ✨'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        );

      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          {step > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#1e293b" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
          <Text style={styles.headerTitle}>Trip Wizard</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              layout={Layout.springify()}
              style={[styles.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%` }]}
            />
          </View>
          <Text style={styles.stepIndicator}>Step {step + 1} of {STEPS.length}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {renderStepContent()}
        </ScrollView>

        {/* Bottom Navigation */}
        {step < 3 && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next Step</Text>
              <Feather name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

      </SafeAreaView>
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
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  progressContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#06b6d4',
    borderRadius: 3,
  },
  stepIndicator: {
    textAlign: 'right',
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipActive: {
    backgroundColor: '#06b6d4',
    borderColor: '#06b6d4',
  },
  chipText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#0f172a',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  nextButton: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  generateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  generateGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
