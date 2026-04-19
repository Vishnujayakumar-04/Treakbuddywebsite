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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { subscribeToUserTrips, deleteTrip } from '../utils/firestore';
import { StoredTrip } from '../utils/storage';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

const TRIP_COLORS = [
    ['#06b6d4', '#2563eb'], // Cyan to Blue
    ['#8b5cf6', '#9333ea'], // Violet to Purple
    ['#f59e0b', '#ea580c'], // Amber to Orange
    ['#10b981', '#0d9488'], // Emerald to Teal
    ['#f43f5e', '#e11d48'], // Rose to Pink
];

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
        const bgColors = TRIP_COLORS[index % TRIP_COLORS.length] as [string, string];

        return (
            <Animated.View
                key={trip.id}
                entering={FadeInDown.delay(index * 100)}
                exiting={FadeOut}
                style={styles.cardContainer}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation?.navigate('TripPlannerOutput', { tripData: trip, itinerary: trip.itinerary })}
                >
                    <LinearGradient
                        colors={bgColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.tripCard}
                    >
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteTrip(trip.id)}
                        >
                            <Feather name="trash-2" size={16} color="rgba(255,255,255,0.8)" />
                        </TouchableOpacity>

                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Planned</Text>
                        </View>

                        <View style={styles.cardContent}>
                            <Text style={styles.tripTitle}>{(trip as any).name || 'Puducherry Adventure'}</Text>

                            <View style={styles.tripMetaRow}>
                                <View style={styles.metaItem}>
                                    <Feather name="calendar" size={12} color="#fff" />
                                    <Text style={styles.metaText}>{(trip as any).type || 'Holiday'}</Text>
                                </View>
                                {trip.itinerary && (
                                    <View style={styles.metaItem}>
                                        <Feather name="map-pin" size={12} color="#fff" />
                                        <Text style={styles.metaText}>{Object.keys(trip.itinerary).length} Days</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.cardFooter}>
                                <View style={styles.arrowCircle}>
                                    <Feather name="arrow-right" size={16} color="#fff" />
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
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View>
                        <View style={styles.badgeOutline}>
                            <Feather name="map" size={12} color="#0891b2" style={{ marginRight: 4 }} />
                            <Text style={styles.badgeOutlineText}>AI-Powered Planning</Text>
                        </View>
                        <Text style={styles.headerTitle}>Plan Your{"\n"}<Text style={styles.headerTitleAccent}>Perfect Trip</Text></Text>
                        <Text style={styles.headerSubtitle}>Design your Puducherry getaway with AI.</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.newTripButton}
                        onPress={() => navigation?.navigate('TripPlannerMain')}
                    >
                        <Feather name="plus" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#0891b2" />
                        </View>
                    ) : !user ? (
                        <View style={styles.centerContainer}>
                            <View style={styles.emptyIconContainer}>
                                <MaterialIcons name="account-circle" size={48} color="#0891b2" />
                            </View>
                            <Text style={styles.emptyTitle}>Sign In Required</Text>
                            <Text style={styles.emptyText}>Please sign in to view and save your perfect trips.</Text>
                            <TouchableOpacity
                                style={styles.signInBtn}
                                onPress={() => navigation?.navigate('Login')}
                            >
                                <Text style={styles.signInBtnText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    ) : trips.length === 0 ? (
                        <View style={styles.centerContainer}>
                            <View style={styles.emptyIconContainer}>
                                <MaterialIcons name="auto-awesome" size={48} color="#0891b2" />
                            </View>
                            <Text style={styles.emptyTitle}>No trips yet</Text>
                            <Text style={styles.emptyText}>Your adventure dashboard is empty. Let AI craft your perfect itinerary.</Text>
                            <TouchableOpacity
                                style={styles.startPlanningBtn}
                                onPress={() => navigation?.navigate('TripPlannerMain')}
                            >
                                <MaterialIcons name="auto-awesome" size={16} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.startPlanningText}>Start Planning</Text>
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: '#f8fafc',
    },
    safeArea: {
        flex: 1,
        paddingTop: STATUSBAR_HEIGHT,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    badgeOutline: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: '#cffafe',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#a5f3fc',
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    badgeOutlineText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#0e7490',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0f172a',
        lineHeight: 34,
    },
    headerTitleAccent: {
        color: '#0284c7',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 8,
    },
    newTripButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#0ea5e9',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    listContainer: {
        padding: spacing.xl,
        gap: spacing.lg,
    },
    cardContainer: {
        width: '100%',
    },
    tripCard: {
        height: 180,
        borderRadius: 24,
        padding: spacing.lg,
        position: 'relative',
        ...shadows.lg,
    },
    deleteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 'auto',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardContent: {
        marginTop: 'auto',
    },
    tripTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
    },
    tripMetaRow: {
        flexDirection: 'row',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
    },
    cardFooter: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    arrowCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: '#cffafe',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        transform: [{ rotate: '5deg' }],
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    startPlanningBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0ea5e9',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 20,
        ...shadows.md,
    },
    startPlanningText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    signInBtn: {
        backgroundColor: '#0f172a',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 16,
        ...shadows.sm,
    },
    signInBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
