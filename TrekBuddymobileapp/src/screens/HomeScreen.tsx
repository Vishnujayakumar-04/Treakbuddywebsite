import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar, Image, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SectionTitle } from '../components/ui';
import { CategoryCard } from '../components/CategoryCard';
import { AutoAwesomeIcon, ChevronRightIcon } from '../components/icons';
import { getCategoryKey } from '../utils/api';
import { getPlaceById } from '../data/places';
import { QUICK_CATEGORIES } from '../data/categories';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface HomeScreenProps {
  navigation?: any;
}

// Famous places images
const HERO_IMAGES = [
  require('../../assets/Famousplacesimg/arulmigu-manakula-vinayar-puducherry-1-attr-hero.jpg'),
  require('../../assets/Famousplacesimg/download.jpg'),
  require('../../assets/Famousplacesimg/image_2022-07-26_124514583.jpg'),
];

const GALLERY_PLACES = () => [
  { ...(getPlaceById('b1') || { id: 'b1', name: 'Promenade Beach', category: 'beaches', description: '', location: '', rating: 4.5, image: '', tags: [], timeSlot: '' }), imageSource: require('../../assets/assets/beaches/promenade beach.jpg') },
  { ...(getPlaceById('h1') || { id: 'h1', name: 'White Town Walks', category: 'heritage', description: '', location: '', rating: 4.5, image: '', tags: [], timeSlot: '' }), imageSource: require('../../assets/Famousplacesimg/unnamed (1).jpg') },
  { ...(getPlaceById('h2') || { id: 'h2', name: 'Puducherry Museum', category: 'heritage', description: '', location: '', rating: 4.5, image: '', tags: [], timeSlot: '' }), imageSource: require('../../assets/Famousplacesimg/unnamed.jpg') },
  { ...(getPlaceById('t1') || { id: 't1', name: 'Arulmigu Manakula Vinayagar', category: 'temples', description: '', location: '', rating: 4.5, image: '', tags: [], timeSlot: '' }), imageSource: require('../../assets/assets/temple/Arulmigu-Manakula-Vinayagar-Temple-Pondicherry-A-Divine-Blend-of-History-Culture-Devotion.jpg') },
];

const TESTIMONIALS = [
  { id: 1, name: 'Siddharth Rao', review: 'The smart route planner saved us so much time and money! Highly recommend.', rating: 5, avatar: 'https://i.pravatar.cc/150?u=sid' },
  { id: 2, name: 'Anita Patel', review: 'Discovered hidden cafes and pristine beaches thanks to this app.', rating: 5, avatar: 'https://i.pravatar.cc/150?u=anita' },
  { id: 3, name: 'John Doe', review: 'The AI recommendations were spot on. A must-have for Puducherry.', rating: 4, avatar: 'https://i.pravatar.cc/150?u=john' }
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const galleryScrollRef = useRef<ScrollView>(null);

  // Auto-change hero images with fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Marquee auto-scroll effect for the Gallery
  useEffect(() => {
    let scrollPosition = 0;
    const itemWidth = 148; // image width 140 + gap 8
    const maxItems = 4;

    const sliderInterval = setInterval(() => {
      scrollPosition += itemWidth;
      const maxScroll = (maxItems * itemWidth) - SCREEN_WIDTH + 60;
      if (scrollPosition > maxScroll) {
        scrollPosition = 0;
      }
      galleryScrollRef.current?.scrollTo({ x: scrollPosition, y: 0, animated: true });
    }, 2800);

    return () => clearInterval(sliderInterval);
  }, []);

  // Entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCategoryPress = (categoryId: string, label: string) => {
    if (categoryId === 'temples' || categoryId === 'religious' || label.toLowerCase().includes('temples')) {
      navigation?.navigate('ReligiousPlaces');
      return;
    }
    if (categoryId === 'beaches' || label.toLowerCase().includes('beaches')) {
      navigation?.navigate('Beaches');
      return;
    }
    if (categoryId === 'parks' || label.toLowerCase().includes('parks')) {
      navigation?.navigate('Parks');
      return;
    }
    if (categoryId === 'nature' || label.toLowerCase().includes('nature')) {
      navigation?.navigate('Nature');
      return;
    }
    if (categoryId === 'nightlife' || label.toLowerCase().includes('nightlife') || label.toLowerCase().includes('evening')) {
      navigation?.navigate('Nightlife');
      return;
    }
    if (categoryId === 'adventure' || label.toLowerCase().includes('adventure') || label.toLowerCase().includes('outdoor')) {
      navigation?.navigate('Adventure');
      return;
    }
    if (categoryId === 'theatres' || categoryId === 'cinemas' || label.toLowerCase().includes('theatres') || label.toLowerCase().includes('cinemas')) {
      navigation?.navigate('Theatres');
      return;
    }
    if (categoryId === 'photoshoot' || label.toLowerCase().includes('photoshoot') || label.toLowerCase().includes('photo')) {
      navigation?.navigate('Photoshoot');
      return;
    }
    if (categoryId === 'shopping' || label.toLowerCase().includes('shopping')) {
      navigation?.navigate('Shopping');
      return;
    }
    if (categoryId === 'pubs' || categoryId === 'bars' || label.toLowerCase().includes('pubs') || label.toLowerCase().includes('bars')) {
      navigation?.navigate('Pubs');
      return;
    }
    if (categoryId === 'accommodation' || label.toLowerCase().includes('accommodation') || label.toLowerCase().includes('hotel') || label.toLowerCase().includes('resort')) {
      navigation?.navigate('Accommodation');
      return;
    }
    if (categoryId === 'restaurants' || categoryId === 'dining' || label.toLowerCase().includes('restaurant') || label.toLowerCase().includes('dining')) {
      navigation?.navigate('Restaurants');
      return;
    }
    if (categoryId === 'events' || label.toLowerCase().includes('event') || label.toLowerCase().includes('festival')) {
      navigation?.navigate('Events');
      return;
    }

    const categoryKey = getCategoryKey(categoryId);
    if (categoryKey) {
      navigation?.navigate('Category', {
        category: categoryKey,
        label: label,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Modern Header with Gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <Animated.View style={{ opacity: slideAnim }}>
            <Text style={styles.headerTitle}>TrekBuddy</Text>
            <Text style={styles.headerSubtitle}>Your Puducherry Travel Companion</Text>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Cinematic Hero Section */}
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
          <Image
            source={HERO_IMAGES[currentImageIndex]}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(15, 23, 42, 0.3)', 'rgba(15, 23, 42, 0.9)']}
            style={styles.heroOverlay}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <View style={styles.heroBadge}>
                <AutoAwesomeIcon size={14} color="#22d3ee" />
                <Text style={styles.heroBadgeText}>AI-Powered Travel</Text>
              </View>
              <Text style={styles.heroTitle}>
                Discover{'\n'}
                <Text style={styles.heroTitleAccent}>Puducherry's</Text>{'\n'}
                Hidden Gems
              </Text>
              <Text style={styles.heroDescription}>
                Experience French heritage, spiritual serenity, and pristine beaches
              </Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>



        {/* Best Time to Visit Section — shown prominently after hero */}
        <View style={styles.bestTimeContainer}>
          <LinearGradient
            colors={['#1e293b', '#334155', '#475569']}
            style={styles.bestTimeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.sectionTitle}>Best Time to Visit</Text>
            <View style={styles.seasonRow}>
              <View style={styles.seasonBadge}>
                <Text style={styles.seasonIcon}>🌧️</Text>
                <Text style={styles.seasonName}>Monsoon</Text>
                <Text style={styles.seasonDesc}>Jul - Sep</Text>
              </View>
              <View style={[styles.seasonBadge, styles.bestSeasonBadge]}>
                <View style={styles.bestTag}><Text style={styles.bestTagText}>BEST</Text></View>
                <Text style={styles.seasonIcon}>❄️</Text>
                <Text style={styles.seasonName}>Winter</Text>
                <Text style={styles.seasonDesc}>Oct - Mar</Text>
              </View>
              <View style={styles.seasonBadge}>
                <Text style={styles.seasonIcon}>☀️</Text>
                <Text style={styles.seasonName}>Summer</Text>
                <Text style={styles.seasonDesc}>Apr - Jun</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Famous Places Premium Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation?.navigate('FamousPlaces')}
          style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md, marginBottom: spacing.lg }}
        >
          <LinearGradient
            colors={['#4F46E5', '#6366F1', '#818CF8']}
            style={{ borderRadius: radius.xl, padding: spacing.lg, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, paddingRight: spacing.md }}>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 8 }}>
                  <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }}>👑 PREMIUM GUIDE</Text>
                </View>
                <Text style={{ color: '#FFF', fontSize: 24, fontWeight: '900', marginBottom: 4 }}>Famous Places</Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '500', lineHeight: 18 }}>Curated top spots & authentic local cuisine mapped to matching restaurants.</Text>
              </View>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRightIcon size={24} color="#FFF" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <Text style={styles.sectionSubtitle}>Find your perfect adventure</Text>

          <View style={styles.categoriesGrid}>
            {(QUICK_CATEGORIES || []).map((category, index) => (
              category && (
                <Animated.View
                  key={category.id || index}
                  style={[
                    styles.categoryItem,
                    {
                      opacity: slideAnim,
                      transform: [{
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30 * (index + 1), 0]
                        })
                      }]
                    }
                  ]}
                >
                  <CategoryCard
                    image={category.image || ''}
                    label={category.label || 'Category'}
                    onPress={() => handleCategoryPress(category.id || '', category.label || '')}
                    index={index}
                    animated={true}
                  />
                </Animated.View>
              )
            ))}
          </View>
        </View>

        {/* Gallery Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Moments from Puducherry</Text>
          <Text style={styles.sectionSubtitle}>A glimpse into the French Riviera of the East</Text>
        </View>
        <ScrollView
          ref={galleryScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryContainer}
        >
          {GALLERY_PLACES().map((placeObj, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.9}
              onPress={() => navigation?.navigate('PlaceDetails', { place: placeObj })}
              style={{ position: 'relative', overflow: 'hidden', borderRadius: radius.lg }}
            >
              <Animated.Image
                source={placeObj.imageSource}
                style={[styles.galleryImage, { opacity: slideAnim }]}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, paddingTop: 20 }}
              >
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }} numberOfLines={1}>{placeObj.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation?.navigate('Explore')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#06b6d4', '#0891b2', '#0e7490']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>View All Destinations</Text>
            <ChevronRightIcon size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Padding to allow scrolling completely above bottom tab bar */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating AI Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation?.navigate('AIChatbot')}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#8b5cf6', '#7c3aed']}
          style={styles.floatingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <AutoAwesomeIcon size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: STATUSBAR_HEIGHT + spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: SCREEN_HEIGHT * 0.38,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
    marginBottom: spacing.md,
    gap: 6,
  },
  heroBadgeText: {
    color: '#22d3ee',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 38,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  heroTitleAccent: {
    color: '#22d3ee',
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
    maxWidth: '80%',
  },
  statsContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  statGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginTop: 4,
  },
  categoriesSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryItem: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  galleryContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  galleryImage: {
    width: 140,
    height: 180,
    borderRadius: radius.lg,
  },
  bestTimeContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  bestTimeGradient: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.md,
  },
  seasonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  seasonBadge: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bestSeasonBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    position: 'relative',
  },
  bestTag: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#38bdf8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bestTagText: {
    color: '#0f172a',
    fontSize: 9,
    fontWeight: '800',
  },
  seasonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  seasonName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  seasonDesc: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  testimonialsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  testimonialCard: {
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: '#1e293b',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#334155',
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  testimonialRating: {
    fontSize: 10,
    marginTop: 2,
  },
  testimonialText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  ctaButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: spacing.xl,
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadows.lg,
    shadowColor: '#7c3aed',
  },
  floatingGradient: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
