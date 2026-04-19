import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { ArrowBackIcon, CalendarIcon, PlaceIcon } from '../components/icons';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { Card } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { getHistory, subscribeToHistory, HistoryItem } from '../utils/firestore';
import { getVisitedCategories } from '../utils/storage';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface HistoryScreenProps {
  navigation?: any;
}

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHistoryItems([]);
      setLoading(false);
      return;
    }

    // Load history from Firestore
    const loadHistory = async () => {
      try {
        setLoading(true);
        const history = await getHistory(user.uid);
        setHistoryItems(history);
      } catch (error) {
        console.error('Error loading history:', error);
        // Fallback: try to load from local storage (visited categories)
        try {
          const categories = await getVisitedCategories();
          const localHistory: HistoryItem[] = categories.map((cat, index) => ({
            id: `category-${index}`,
            type: 'category' as const,
            title: cat,
            date: new Date().toISOString(),
            category: cat,
            createdAt: new Date().toISOString(),
          }));
          setHistoryItems(localHistory);
        } catch (localError) {
          console.error('Error loading local history:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToHistory(user.uid, (history) => {
      setHistoryItems(history);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <Card style={[styles.historyCard, shadows.sm]}>
      <View style={styles.historyItemContent}>
        <View style={styles.historyIconContainer}>
          {item.type === 'trip' ? (
            <CalendarIcon size={24} color="#0E7C86" />
          ) : (
            <PlaceIcon size={24} color="#2176FF" />
          )}
        </View>
        <View style={styles.historyTextContainer}>
          <Text style={styles.historyTitle}>{item.title}</Text>
          {item.details && (
            <Text style={styles.historyDetails}>{item.details}</Text>
          )}
          <Text style={styles.historyDate}>{item.date}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <ArrowBackIcon size={24} color="#000000" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>History</Text>
          <Text style={styles.headerSubtitle}>Your planned trips and visited places</Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#0E7C86" />
          <Text style={styles.emptyText}>Loading history...</Text>
        </View>
      ) : historyItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📜</Text>
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>
            Your planned trips and visited places will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={historyItems}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h3,
    color: '#000000',
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: '#666666',
  },
  listContainer: {
    padding: spacing.md,
  },
  historyCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0E7C8615',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyTitle: {
    ...typography.labelMedium,
    color: '#000000',
    marginBottom: spacing.xs,
  },
  historyDetails: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
  },
  historyDate: {
    ...typography.bodySmall,
    color: '#666666',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h4,
    color: '#000000',
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: '#666666',
    textAlign: 'center',
  },
});
