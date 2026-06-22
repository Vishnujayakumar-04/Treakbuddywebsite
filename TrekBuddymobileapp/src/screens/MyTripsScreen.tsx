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
    ActivityIndicator,
    Alert,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeOut, FadeIn, Easing, withRepeat, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { subscribeToUserTrips, deleteTrip } from '../utils/firestore';
import { StoredTrip } from '../utils/storage';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const { width } = Dimensions.get('window');

// Dynamic mesh spots for floating background effect
const GlowSpot = ({ delay, color, top, right, left, size }: any) => {
    const opacity = useSharedValue(0.4);
    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.8, { duration: 3000 + delay, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: opacity.value * 1.5 }]
    }));
    return (
        <Animated.View style={[styles.glowSpot, animatedStyle, { backgroundColor: color, top, right, left, width: size, height: size }]} />
    );
};

export default function MyTripsScreen({ navigation }: { navigation?: any }) {
    const { user } = useAuth();
    const [trips, setTrips] = useState<StoredTrip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToUserTrips(user.uid, (fetchedTrips) => {
            setTrips(fetchedTrips);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDeleteTrip = (tripId: string) => {
        Alert.alert(
            "Delete Trip",
            "Are you sure you want to delete this trip?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (user) {
                            try {
                                await deleteTrip(user.uid, tripId);
                            } catch (e) {
                                Alert.alert("Error", "Could not delete trip");
                            }
                        }
                    }
                }
            ]
        );
    };

    const renderTripCard = (trip: StoredTrip, index: number) => {
        // High-end vivid gradients per trip
        const gradients = [
            ['#06b6d4', '#3b82f6'],
            ['#8b5cf6', '#d946ef'],
            ['#f59e0b', '#ef4444'],
            ['#10b981', '#0ea5e9'],
            ['#f43f5e', '#fbbf24'],
        ];
        const selectedGradient = gradients[index % gradients.length] as [string, string];

        return (
            <Animated.View
                key={trip.id}
                entering={FadeInDown.delay(index * 150).springify().damping(14)}
                exiting={FadeOut}
                style={styles.cardContainer}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation?.navigate('TripPlannerOutput', { tripData: trip, itinerary: trip.itinerary })}
                >
                    {/* Glassmorphic Base */}
                    <LinearGradient
                        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.tripCard}
                    >
                        {/* Glowing Edge Border Simulation */}
                        <View style={styles.glassBorder} />

                        {/* Top Utility Row */}
                        <View style={styles.cardHeader}>
                            <LinearGradient colors={selectedGradient} style={styles.badge} start={{x:0,y:0}} end={{x:1,y:1}}>
                                <Feather name="zap" size={10} color="#fff" style={{marginRight: 4}} />
                                <Text style={styles.badgeText}>AI Planned</Text>
                            </LinearGradient>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteTrip(trip.id)}
                            >
                                <Feather name="trash-2" size={16} color="rgba(255,255,255,0.5)" />
                            </TouchableOpacity>
                        </View>

                        {/* Card Graphic Mesh */}
                        <View style={[styles.cardMesh, { backgroundColor: selectedGradient[0] }]} />

                        <View style={styles.cardContent}>
                            <Text style={styles.tripTitle} numberOfLines={2}>{(trip as any).name || 'Puducherry Adventure'}</Text>

                            <View style={styles.tripMetaRow}>
                                <View style={styles.metaItem}>
                                    <View style={[styles.metaIconBg, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                                        <Ionicons name="calendar" size={14} color={selectedGradient[0]} />
                                    </View>
                                    <Text style={styles.metaText}>{(trip as any).type || 'Holiday'}</Text>
                                </View>
                                {trip.itinerary && (
                                    <View style={styles.metaItem}>
                                        <View style={[styles.metaIconBg, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                                            <Ionicons name="map" size={14} color={selectedGradient[0]} />
                                        </View>
                                        <Text style={styles.metaText}>{Object.keys(trip.itinerary).length} Days</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.cardFooter}>
                                <Text style={styles.viewDetailsText}>View Details</Text>
                                <View style={[styles.arrowCircle, { backgroundColor: selectedGradient[1] }]}>
                                    <Feather name="arrow-right" size={18} color="#fff" />
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            
            {/* Ambient Background Engine */}
            <GlowSpot delay={0} color="rgba(6, 182, 212, 0.15)" top={-50} left={-100} size={width * 0.8} />
            <GlowSpot delay={1000} color="rgba(139, 92, 246, 0.15)" top={200} right={-100} size={width * 0.9} />
            
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View>
                        <View style={styles.badgeOutline}>
                            <MaterialIcons name="auto-awesome" size={14} color="#22d3ee" style={{ marginRight: 6 }} />
                            <Text style={styles.badgeOutlineText}>Smart Dashboard</Text>
                        </View>
                        <Text style={styles.headerTitle}>My <Text style={styles.headerTitleAccent}>Journeys</Text></Text>
                        <Text style={styles.headerSubtitle}>Manage your AI-crafted adventures</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.newTripButton}
                        onPress={() => navigation?.navigate('TripPlannerMain')}
                    >
                        <LinearGradient colors={['#06b6d4', '#3b82f6']} style={styles.newTripGradient}>
                            <Feather name="plus" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#22d3ee" />
                        </View>
                    ) : !user ? (
                        <Animated.View entering={FadeIn.delay(300)} style={styles.centerContainer}>
                            <View style={styles.emptyIconContainer}>
                                <LinearGradient colors={['rgba(34,211,238,0.2)', 'rgba(34,211,238,0.05)']} style={styles.emptyIconGradient}>
                                    <Feather name="lock" size={48} color="#22d3ee" />
                                </LinearGradient>
                            </View>
                            <Text style={styles.emptyTitle}>Sign In Required</Text>
                            <Text style={styles.emptyText}>Please connect your traveler account to seamlessly view and save your custom itineraries.</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.signInBtnWrapper}
                                onPress={() => navigation?.navigate('Login')}
                            >
                                <LinearGradient colors={['#06b6d4', '#2563eb']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.signInBtn}>
                                    <Text style={styles.signInBtnText}>Connect Account</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    ) : trips.length === 0 ? (
                        <Animated.View entering={FadeInDown.delay(200)} style={styles.centerContainer}>
                            <View style={styles.emptyIconContainer}>
                                <LinearGradient colors={['rgba(34,211,238,0.2)', 'rgba(34,211,238,0.05)']} style={styles.emptyIconGradient}>
                                    <MaterialIcons name="auto-awesome" size={48} color="#22d3ee" />
                                </LinearGradient>
                            </View>
                            <Text style={styles.emptyTitle}>The Canvas is Blank</Text>
                            <Text style={styles.emptyText}>You haven't requested the AI to craft any adventures for you yet. Tap below to begin.</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.signInBtnWrapper}
                                onPress={() => navigation?.navigate('TripPlannerMain')}
                            >
                                <LinearGradient colors={['#06b6d4', '#2563eb']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.startPlanningBtn}>
                                    <MaterialIcons name="auto-awesome" size={18} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.startPlanningText}>Manifest Trip</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    ) : (
                        <View style={styles.listContainer}>
                            {trips.map((trip, idx) => (
                                <React.Fragment key={trip.id || `trip-${idx}`}>
                                    {renderTripCard(trip, idx)}
                                </React.Fragment>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617', // High-end deep sea slate
    },
    glowSpot: {
        position: 'absolute',
        borderRadius: 9999,
        filter: 'blur(40px)', // Web/New RN prop simulation, but raw opacity also works natively
    },
    safeArea: {
        flex: 1,
        paddingTop: STATUSBAR_HEIGHT + 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.lg,
        zIndex: 10,
    },
    badgeOutline: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(34,211,238,0.1)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(34,211,238,0.3)',
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    badgeOutlineText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#22d3ee',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '900',
        color: '#f8fafc',
        letterSpacing: -0.5,
    },
    headerTitleAccent: {
        color: '#22d3ee',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 4,
    },
    newTripButton: {
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#22d3ee',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    newTripGradient: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    listContainer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        gap: spacing.xl,
    },
    cardContainer: {
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    tripCard: {
        minHeight: 220,
        borderRadius: 30,
        padding: spacing.xl,
        position: 'relative',
        overflow: 'hidden',
    },
    glassBorder: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        borderRadius: 30,
    },
    cardMesh: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 150,
        height: 150,
        borderRadius: 75,
        opacity: 0.15,
        filter: 'blur(30px)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardContent: {
        flex: 1,
    },
    tripTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 16,
        lineHeight: 32,
    },
    tripMetaRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaIconBg: {
        width: 28,
        height: 28,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    metaText: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.8)',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 16,
    },
    viewDetailsText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    arrowCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    centerContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    emptyIconContainer: {
        marginBottom: 24,
    },
    emptyIconGradient: {
        width: 120,
        height: 120,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(34,211,238,0.2)',
        transform: [{ rotate: '10deg' }],
    },
    emptyTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#f8fafc',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    signInBtnWrapper: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#22d3ee',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    signInBtn: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    signInBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    startPlanningBtn: {
        flexDirection: 'row',
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startPlanningText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});
