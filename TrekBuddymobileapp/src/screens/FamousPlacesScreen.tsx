import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    StatusBar,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowBackIcon, LocationPinIcon, StarIcon } from '../components/icons';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { PLACES_DATA } from '../data/places';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const generatePlace = (name: string, location: string, imageModule: any, category: string) => ({
    id: `famous_${name.replace(/\s+/g, '').toLowerCase()}`,
    name,
    location,
    category,
    image: imageModule,
    rating: 4.8,
    description: `A celebrated ${category} spot nestled in ${location}. Experience the history, culture, and beauty of ${name}, a must-visit destination in Puducherry.`,
    tags: ['Famous', 'Must Visit', category],
    timeSlot: 'Morning to Evening',
});

const FAMOUS_PLACES = {
    historical: [
        generatePlace('French War Memorial', 'Goubert Avenue', require('../../assets/web_assets/spot/french wa rmemorial.jfif'), 'Historical Sites'),
        generatePlace('Aayi Mandapam', 'White Town', require('../../assets/web_assets/spot/aayi mandapam.jfif'), 'Historical Sites'),
        generatePlace('Bharathi Park', 'White Town', require('../../assets/web_assets/spot/barathi park.jfif'), 'Historical Sites'),
        generatePlace('Arikamedu Archaeological Site', 'Arikamedu', require('../../assets/web_assets/spot/museum.jfif'), 'Historical Sites'),
        generatePlace('Kargil War Memorial', 'Shanmugha Vilasam', require('../../assets/web_assets/spot/french wa rmemorial 2.jfif'), 'Historical Sites'),
        generatePlace('Raj Niwas', 'White Town', require('../../assets/web_assets/spot/white town walks.jfif'), 'Historical Sites'),
    ],
    temples: [
        generatePlace('Manakula Vinayagar Temple', 'White Town', require('../../assets/web_assets/spot/aayi mandapam 2.jfif'), 'Temples'),
        generatePlace('Varadaraja Perumal Temple', 'Near French Consulate', require('../../assets/web_assets/spot/white town walks 2.jfif'), 'Temples'),
        generatePlace('Kamakshi Amman Temple', 'Near Beach', require('../../assets/web_assets/spot/aayi mandapam.jfif'), 'Temples'),
        generatePlace('Vedapureeswarar Temple', 'Near Serenity Beach', require('../../assets/web_assets/spot/white town walks 3.jfif'), 'Temples'),
        generatePlace('Arulmigu Kanniga Parameswari Temple', 'Kuruchikuppam', require('../../assets/web_assets/spot/museum 2.jfif'), 'Temples'),
    ],
    nature: [
        generatePlace('Paradise Beach', 'Chunnambar', require('../../assets/web_assets/beaches/paradise beach.jpeg'), 'Nature & Wildlife'),
        generatePlace('Auroville Beach', 'Auroville', require('../../assets/web_assets/beaches/auroville beach.jpg'), 'Nature & Wildlife'),
        generatePlace('Serenity Beach', 'Auroville Road', require('../../assets/web_assets/beaches/serenity beach.jpg'), 'Nature & Wildlife'),
        generatePlace('Ousteri Lake', 'Ossudu', require('../../assets/web_assets/activity/mangrove kayaking.jfif'), 'Nature & Wildlife'),
        generatePlace('Botanical Gardens', 'Near Railway Station', require('../../assets/web_assets/spot/botanical garden.jfif'), 'Nature & Wildlife'),
        generatePlace('Pichavaram Mangroves', 'Near Chidambaram', require('../../assets/web_assets/activity/mangrove kayaking 2.jfif'), 'Nature & Wildlife'),
        generatePlace('Bharathi Park', 'White Town', require('../../assets/web_assets/spot/barathi park.jfif'), 'Nature & Wildlife'),
    ],
    churches: [
        generatePlace('Sacred Heart Basilica', 'Subbaiah Salai', require('../../assets/web_assets/spot/museum.jfif'), 'Churches'),
        generatePlace('Immaculate Conception Cathedral', 'Mission Street', require('../../assets/web_assets/spot/white town walks 3.jfif'), 'Churches'),
        generatePlace('Our Lady of Angels Church', 'Rue Dumas', require('../../assets/web_assets/spot/aayi mandapam 2.jfif'), 'Churches'),
        generatePlace("St. Andrew's Church", 'Church Street', require('../../assets/web_assets/spot/french wa rmemorial 3.jfif'), 'Churches'),
    ],
    popular: [
        generatePlace('Promenade Beach', 'Beach Road', require('../../assets/web_assets/beaches/promenade beach.jpg'), 'Popular Places'),
        generatePlace('Sri Aurobindo Ashram', 'Marine Street', require('../../assets/web_assets/stay/villa shanti.webp'), 'Popular Places'),
        generatePlace('Matrimandir', 'Auroville', require('../../assets/web_assets/beaches/auroville beach.jpg'), 'Popular Places'),
        generatePlace('Puducherry Museum', 'Bharathi Park', require('../../assets/web_assets/spot/museum.jfif'), 'Popular Places'),
        generatePlace('White Town Walks', 'French Quarter', require('../../assets/web_assets/spot/white town walks.jfif'), 'Popular Places'),
        generatePlace('Chunnambar Backwater', 'Chunnambar', require('../../assets/web_assets/beaches/paradise beach.jpeg'), 'Popular Places'),
        generatePlace('Serenity Beach', 'Kottakuppam', require('../../assets/web_assets/beaches/serenity beach.jpg'), 'Popular Places'),
        generatePlace('Paradise Beach', 'Chunnambar', require('../../assets/web_assets/beaches/paradise beach.jpeg'), 'Popular Places'),
    ],
    food: [
        { name: 'Ratatouille', type: 'Vegetarian', restaurant: 'Various French Cafés', image: require('../../assets/web_assets/stay/villa shanti 2.webp') },
        { name: 'Crepes', type: 'Vegetarian', restaurant: 'Café des Arts', image: require('../../assets/web_assets/stay/villa shanti 3.webp') },
        { name: 'Masala Dosa', type: 'Vegetarian', restaurant: 'Surguru', image: require('../../assets/web_assets/stay/ocean spray 2.jfif') },
        { name: 'Kadugu Yerra', type: 'Vegetarian', restaurant: 'Local Eateries', image: require('../../assets/web_assets/stay/ocean spray 3.jfif') },
        { name: 'Idiyappam with Coconut Milk', type: 'Vegetarian', restaurant: 'Traditional Restaurants', image: require('../../assets/web_assets/stay/ocean spray.jfif') },
        { name: 'Prawn Risotto', type: 'Non-Vegetarian', restaurant: 'Villa Shanti', image: require('../../assets/web_assets/stay/le pondy 2.jfif') },
        { name: 'Fish Vindaloo', type: 'Non-Vegetarian', restaurant: 'Coromandel Café', image: require('../../assets/web_assets/stay/le pondy 3.jfif') },
        { name: 'Chicken Chettinad', type: 'Non-Vegetarian', restaurant: 'Le Dupleix', image: require('../../assets/web_assets/stay/accord 3.jfif') },
    ],
};

const CATEGORIES = [
    { id: 'popular', label: 'Top Hits', emoji: '🌟', count: FAMOUS_PLACES.popular.length },
    { id: 'historical', label: 'History', emoji: '🏛️', count: FAMOUS_PLACES.historical.length },
    { id: 'temples', label: 'Temples', emoji: '🛕', count: FAMOUS_PLACES.temples.length },
    { id: 'nature', label: 'Nature', emoji: '🌿', count: FAMOUS_PLACES.nature.length },
    { id: 'churches', label: 'Churches', emoji: '⛪', count: FAMOUS_PLACES.churches.length },
    { id: 'food', label: 'Cuisine', emoji: '🍽️', count: FAMOUS_PLACES.food.length },
];

export default function FamousPlacesScreen({ navigation }: { navigation?: any }) {
    const [activeCategory, setActiveCategory] = useState<string>('popular');

    const activeData = FAMOUS_PLACES[activeCategory as keyof typeof FAMOUS_PLACES];
    const isFoodCategory = activeCategory === 'food';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Premium Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
                    <ArrowBackIcon size={20} color="#0F172A" />
                </TouchableOpacity>
                <View style={styles.headerTextGroup}>
                    <View style={styles.badgeWrap}>
                        <StarIcon size={12} color="#4F46E5" />
                        <Text style={styles.badgeText}>TOURIST GUIDE</Text>
                    </View>
                    <Text style={styles.title}>Famous in <Text style={styles.titleHighlight}>Pondy</Text></Text>
                </View>
            </View>

            {/* Sticky Tab Filters */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    {CATEGORIES.map(cat => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setActiveCategory(cat.id)}
                                activeOpacity={0.8}
                                style={[styles.tab, isActive && styles.tabActive]}
                            >
                                <Text style={styles.tabEmoji}>{cat.emoji}</Text>
                                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{cat.label}</Text>
                                <View style={[styles.tabCount, isActive && styles.tabCountActive]}>
                                    <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>{cat.count}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Main Content Grid */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>
                <View style={styles.grid}>
                    {activeData.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.9}
                            style={[
                                styles.card,
                                isFoodCategory ? styles.foodCard : styles.placeCard
                            ]}
                            onPress={() => {
                                if (!isFoodCategory) {
                                    // Try to find enriched data from places.ts by name match
                                    const realPlace = PLACES_DATA.find(
                                        p => p.name.toLowerCase().trim() === item.name.toLowerCase().trim()
                                    );

                                    // Always build a complete, valid Place object
                                    const placeData = realPlace
                                        ? { ...realPlace, image: realPlace.image || item.image }
                                        : {
                                            id: (item as any).id || `famous_${item.name.replace(/\s+/g, '').toLowerCase()}`,
                                            name: item.name,
                                            image: item.image,
                                            location: (item as any).location || 'Puducherry',
                                            rating: (item as any).rating || 4.5,
                                            description: (item as any).description || `${item.name} is one of Puducherry's most celebrated destinations. Known for its cultural significance, it draws visitors from across the country and abroad.`,
                                            category: (item as any).category || activeCategory,
                                            tags: (item as any).tags || ['Famous', 'Must Visit'],
                                            timeSlot: (item as any).timeSlot || 'Morning to Evening',
                                            bestTime: (item as any).bestTime || 'Any Time',
                                            openTime: (item as any).openTime || 'Open Daily',
                                            entryFee: (item as any).entryFee || 'Free',
                                        };
                                    navigation?.navigate('PlaceDetails', { place: placeData });
                                }
                            }}
                        >
                            <Image
                                source={typeof item.image === 'number' ? item.image : { uri: item.image || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800' }}
                                style={styles.cardImage}
                            />

                            <LinearGradient
                                colors={['transparent', 'rgba(15,23,42,0.6)', 'rgba(15,23,42,0.95)']}
                                style={styles.cardGradient}
                            >
                                {isFoodCategory ? (
                                    <View style={styles.cardContent}>
                                        <View style={styles.foodTypeBadge}>
                                            <Text style={styles.foodTypeText}>{(item as any).type}</Text>
                                        </View>
                                        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                                        <View style={styles.cardSubtitleWrap}>
                                            <LocationPinIcon size={12} color="#38BDF8" />
                                            <Text style={styles.cardSubtitle} numberOfLines={1}>{(item as any).restaurant}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                                        <View style={styles.cardSubtitleWrap}>
                                            <LocationPinIcon size={12} color="#CBD5E1" />
                                            <Text style={styles.cardSubtitle} numberOfLines={1}>{(item as any).location}</Text>
                                        </View>
                                    </View>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={{ height: spacing.xxl }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        paddingTop: STATUSBAR_HEIGHT,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: '#F8FAFC',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        marginBottom: spacing.sm,
    },
    headerTextGroup: {
        gap: 4,
    },
    badgeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
        color: '#4F46E5',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
    },
    titleHighlight: {
        color: '#4F46E5', // Indigo
    },
    tabsContainer: {
        marginBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
    tabsScroll: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
        gap: 8,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
    },
    tabActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        shadowOpacity: 0.1,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    tabEmoji: {
        fontSize: 14,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    tabCount: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    tabCountActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    tabCountText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94A3B8',
    },
    tabCountTextActive: {
        color: '#FFFFFF',
    },
    gridContainer: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        marginBottom: spacing.md,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    placeCard: {
        width: '48%',
        height: 220,
    },
    foodCard: {
        width: '100%',
        height: 200,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    cardGradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: spacing.md,
    },
    cardContent: {
        gap: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
        lineHeight: 20,
    },
    cardSubtitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#CBD5E1',
        flex: 1,
    },
    foodTypeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    foodTypeText: {
        fontSize: 10,
        color: '#FFF',
        fontWeight: '700',
    },
});
