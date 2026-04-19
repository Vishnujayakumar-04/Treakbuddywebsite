import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  Easing,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from '../components/SearchBar';
import { CategoryCard } from '../components/CategoryCard';
import { getCategoryKey } from '../utils/api';
import { ALL_CATEGORIES, Category } from '../data/categories';
import { ArrowBackIcon } from '../components/icons';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH * 0.7;

const MARQUEE_IMAGES = [
  require('../../assets/web_assets/beaches/promenade beach.jpg'),
  require('../../assets/web_assets/stay/villa shanti.webp'),
  require('../../assets/web_assets/spot/aayi mandapam.jfif'),
  require('../../assets/web_assets/spot/museum.jfif'),
  require('../../assets/web_assets/beaches/paradise beach.jpeg'),
  require('../../assets/web_assets/activity/mangrove kayaking.jfif'),
];

interface ExploreScreenProps {
  navigation?: any;
}

export default function ExploreScreen({ navigation }: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const scrollX = useRef(new Animated.Value(0)).current;

  // Infinite Marquee Animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -(IMAGE_WIDTH * MARQUEE_IMAGES.length), // Scroll exactly one set of images
        duration: 40000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [scrollX]);

  const handleCategoryPress = (categoryId: string, label: string) => {
    if (categoryId === 'temples' || categoryId === 'religious' || label.toLowerCase().includes('temples')) {
      navigation?.navigate('ReligiousPlaces'); return;
    }
    if (categoryId === 'beaches' || label.toLowerCase().includes('beaches')) {
      navigation?.navigate('Beaches'); return;
    }
    if (categoryId === 'parks' || label.toLowerCase().includes('parks')) {
      navigation?.navigate('Parks'); return;
    }
    if (categoryId === 'nature' || label.toLowerCase().includes('nature')) {
      navigation?.navigate('Nature'); return;
    }
    if (categoryId === 'nightlife' || label.toLowerCase().includes('nightlife') || label.toLowerCase().includes('evening')) {
      navigation?.navigate('Nightlife'); return;
    }
    if (categoryId === 'adventure' || label.toLowerCase().includes('adventure') || label.toLowerCase().includes('outdoor')) {
      navigation?.navigate('Adventure'); return;
    }
    if (categoryId === 'theatres' || categoryId === 'cinemas' || label.toLowerCase().includes('theatres') || label.toLowerCase().includes('cinemas')) {
      navigation?.navigate('Theatres'); return;
    }
    if (categoryId === 'photoshoot' || label.toLowerCase().includes('photoshoot') || label.toLowerCase().includes('photo')) {
      navigation?.navigate('Photoshoot'); return;
    }
    if (categoryId === 'shopping' || label.toLowerCase().includes('shopping')) {
      navigation?.navigate('Shopping'); return;
    }
    if (categoryId === 'pubs' || categoryId === 'bars' || label.toLowerCase().includes('pubs') || label.toLowerCase().includes('bars')) {
      navigation?.navigate('Pubs'); return;
    }
    if (categoryId === 'accommodation' || label.toLowerCase().includes('accommodation') || label.toLowerCase().includes('hotel') || label.toLowerCase().includes('resort')) {
      navigation?.navigate('Accommodation'); return;
    }
    if (categoryId === 'restaurants' || categoryId === 'dining' || label.toLowerCase().includes('restaurant') || label.toLowerCase().includes('dining')) {
      navigation?.navigate('Restaurants'); return;
    }
    const categoryKey = categoryId || getCategoryKey(label);
    navigation?.navigate('Category', { category: categoryKey, label });
  };

  const filteredCategories = searchQuery
    ? ALL_CATEGORIES.filter(cat => cat.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : ALL_CATEGORIES;

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButtonWrap}>
          <View style={styles.backButton}>
            <ArrowBackIcon size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>

        {/* Animated Immersive Hero */}
        <View style={styles.heroContainer}>
          <View style={styles.heroBackground}>
            <Animated.View style={[styles.marqueeWrapper, { transform: [{ translateX: scrollX }] }]}>
              {/* Duplicate array for seamless infinite looping */}
              {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((img, idx) => (
                <View key={idx} style={styles.marqueeImageContainer}>
                  <Image source={img as any} style={styles.marqueeImage} />
                </View>
              ))}
            </Animated.View>
          </View>

          {/* Premium Gradients */}
          <LinearGradient colors={['rgba(15,23,42,0.6)', 'rgba(15,23,42,0.2)', '#F8FAFC']} style={styles.heroGradient} />

          <View style={styles.heroContent}>
            <View style={styles.badgeWrapper}>
              <Text style={styles.heroBadge}>✨ PUDUCHERRY TRAVEL GUIDE</Text>
            </View>
            <Text style={styles.heroTitle}>Discover{'\n'}<Text style={styles.heroTitleHighlight}>Puducherry</Text></Text>
            <Text style={styles.heroSubtitle}>Curated experiences across beaches, heritage, cuisine & more.</Text>
          </View>
        </View>

        {/* Floating Glassmorphism Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchGlass}>
            <SearchBar
              placeholder="Search experiences..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.sectionHeaderLine}>
            <View style={styles.line} />
            <Text style={styles.sectionTitle}>BROWSE BY EXPERIENCE</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.grid}>
            {filteredCategories.map((item, index) => (
              <View key={item.id} style={styles.gridItem}>
                <CategoryCard
                  image={item.image}
                  label={item.label}
                  emoji={item.emoji}
                  count={item.count}
                  onPress={() => handleCategoryPress(item.id, item.label)}
                  index={index}
                  animated={true}
                />
              </View>
            ))}
          </View>

          {filteredCategories.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>We couldn't find any categories matching "{searchQuery}"</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  floatingHeader: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + spacing.sm,
    left: spacing.sm,
    zIndex: 100,
  },
  backButtonWrap: {
    padding: spacing.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroContainer: {
    height: 450,
    width: '100%',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  marqueeWrapper: {
    flexDirection: 'row',
    height: '100%',
  },
  marqueeImageContainer: {
    width: IMAGE_WIDTH,
    height: '100%',
    paddingRight: 2,
  },
  marqueeImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing.xxl + 20,
    left: spacing.lg,
    right: spacing.lg,
  },
  badgeWrapper: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroBadge: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: 46,
    paddingBottom: spacing.xs,
  },
  heroTitleHighlight: {
    color: '#67E8F9', // Cyan-300
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    maxWidth: '85%',
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    marginTop: -30,
    zIndex: 10,
  },
  searchGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: radius.full,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    padding: 2,
  },
  gridContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  sectionHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 2,
    marginHorizontal: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: spacing.sm,
  },
  emptyState: {
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});
