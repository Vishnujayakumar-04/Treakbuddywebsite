import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Animated,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius } from '../theme/spacing';
import { useTheme } from '../context/ThemeContext';
import { getAllPlaces, Place } from '../data/places';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface RouteResult {
    transportType: string;
    fare: string;
    distance: string;
    duration: string;
    route: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    colors: string[];
}

const ALL_PLACES = getAllPlaces();

export default function RoutePlannerScreen({ navigation }: any) {
    const { isDark } = useTheme();

    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<RouteResult[]>([]);

    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true })
        ]).start();
    }, []);

    const filterPlaces = (query: string) => {
        if (!query || query.length < 2) return [];

        const lowerQuery = query.toLowerCase();

        // Search in ALL_PLACES first
        const matchedPlaces = ALL_PLACES.filter(place =>
            place.name.toLowerCase().includes(lowerQuery) ||
            place.location.toLowerCase().includes(lowerQuery)
        ).slice(0, 8);

        return matchedPlaces;
    };

    const fromSuggestions = filterPlaces(fromLocation);
    const toSuggestions = filterPlaces(toLocation);

    const handleDetectLocation = () => {
        setDetectingLocation(true);
        setTimeout(() => {
            setFromLocation('Current Location (White Town)');
            setDetectingLocation(false);
        }, 1500);
    };

    const swapLocations = () => {
        const temp = fromLocation;
        setFromLocation(toLocation);
        setToLocation(temp);
    };

    const handleAnalyze = () => {
        if (!fromLocation || !toLocation) return;

        setAnalyzing(true);
        setResults([]);
        setShowFromSuggestions(false);
        setShowToSuggestions(false);

        // Simulate AI routing analysis matching website logic
        setTimeout(() => {
            const distance = Math.floor(Math.random() * 15) + 3; // 3-18 km
            const baseTime = Math.floor(distance * 4); // ~4 min per km average

            const transportOptions: RouteResult[] = [
                {
                    transportType: 'Auto Rickshaw',
                    fare: `₹${30 + (distance * 15)}`,
                    distance: `${distance} km`,
                    duration: `${baseTime - 5} mins`,
                    route: `${fromLocation} → ${toLocation}`,
                    icon: 'rickshaw',
                    colors: ['#f59e0b', '#d97706']
                },
                {
                    transportType: 'Bike Taxi',
                    fare: `₹${20 + (distance * 10)}`,
                    distance: `${distance} km`,
                    duration: `${baseTime - 10} mins`,
                    route: `${fromLocation} → ${toLocation}`,
                    icon: 'motorbike',
                    colors: ['#3b82f6', '#0ea5e9']
                },
                {
                    transportType: 'City Taxi',
                    fare: `₹${100 + (distance * 18)}`,
                    distance: `${distance} km`,
                    duration: `${baseTime} mins`,
                    route: `${fromLocation} → ${toLocation}`,
                    icon: 'taxi',
                    colors: ['#10b981', '#059669']
                },
                {
                    transportType: 'Town Bus',
                    fare: `₹${distance < 5 ? '8' : distance < 10 ? '12' : '20'}`,
                    distance: `${distance} km`,
                    duration: `${baseTime + 15} mins`,
                    route: `${fromLocation} → ${toLocation}`,
                    icon: 'bus',
                    colors: ['#8b5cf6', '#ec4899']
                }
            ];

            // Sort by fare
            const sorted = transportOptions.sort((a, b) =>
                parseInt(a.fare.replace('₹', '')) - parseInt(b.fare.replace('₹', ''))
            );

            setResults(sorted);
            setAnalyzing(false);
        }, 2000);
    };

    const renderSuggestionList = (suggestions: Place[], onSelect: (val: string) => void) => {
        return (
            <View style={[styles.suggestionsContainer, isDark ? styles.bgDarkHighlight : styles.bgLightHighlight]}>
                {suggestions.map((place, index) => (
                    <TouchableOpacity
                        key={place.id || index}
                        style={[styles.suggestionItem, index < suggestions.length - 1 && styles.suggestionBorder]}
                        onPress={() => onSelect(place.name)}
                    >
                        <View style={styles.suggestionIconWrapper}>
                            <Feather name="map-pin" size={16} color={isDark ? '#94a3b8' : '#64748b'} />
                        </View>
                        <View style={styles.suggestionTextWrapper}>
                            <Text style={[styles.suggestionText, isDark ? styles.textDark : styles.textLight]}>{place.name}</Text>
                            <Text style={styles.suggestionSubText}>{place.category.toUpperCase()} • {place.location}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
            <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

            {/* Header */}
            <View style={[styles.header, isDark ? styles.borderDark : styles.borderLight]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color={isDark ? '#f8fafc' : '#0f172a'} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>Route Planner</Text>
                    <Text style={styles.headerSubtitle}>Smart transport recommendations</Text>
                </View>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex1}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                        {/* Input Card */}
                        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
                            <View style={styles.inputSection}>
                                <View style={styles.inputWrapper}>
                                    <Feather name="circle" size={16} color="#10b981" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, isDark ? styles.textDark : styles.textLight]}
                                        placeholder="Where from?"
                                        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                        value={fromLocation}
                                        onChangeText={(v) => { setFromLocation(v); setShowFromSuggestions(true); }}
                                        onFocus={() => setShowFromSuggestions(true)}
                                    />
                                    {fromLocation === '' && (
                                        <TouchableOpacity style={styles.detectBtn} onPress={handleDetectLocation}>
                                            {detectingLocation ? <ActivityIndicator size="small" color="#0ea5e9" /> : <Feather name="navigation" size={16} color="#0ea5e9" />}
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {showFromSuggestions && fromSuggestions.length > 0 && renderSuggestionList(fromSuggestions, (v) => { setFromLocation(v); setShowFromSuggestions(false); })}

                                <View style={styles.dividerWrapper}>
                                    <View style={[styles.dividerLine, isDark ? styles.borderDark : styles.borderLight]} />
                                    <TouchableOpacity style={[styles.swapBtn, isDark ? styles.bgDarkHighlight : styles.bgLightHighlight]} onPress={swapLocations}>
                                        <Feather name="repeat" size={16} color={isDark ? '#cbd5e1' : '#64748b'} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Feather name="map-pin" size={16} color="#f59e0b" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, isDark ? styles.textDark : styles.textLight]}
                                        placeholder="Where to?"
                                        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                        value={toLocation}
                                        onChangeText={(v) => { setToLocation(v); setShowToSuggestions(true); }}
                                        onFocus={() => setShowToSuggestions(true)}
                                    />
                                </View>
                                {showToSuggestions && toSuggestions.length > 0 && renderSuggestionList(toSuggestions, (v) => { setToLocation(v); setShowToSuggestions(false); })}
                            </View>

                            <TouchableOpacity
                                style={[styles.analyzeBtn, (!fromLocation || !toLocation || analyzing) && styles.analyzeBtnDisabled]}
                                onPress={handleAnalyze}
                                disabled={!fromLocation || !toLocation || analyzing}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#0ea5e9', '#3b82f6']}
                                    style={styles.analyzeGradient}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                >
                                    {analyzing ? (
                                        <View style={styles.row}>
                                            <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                                            <Text style={styles.analyzeBtnText}>Analyzing Best Routes...</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.row}>
                                            <Feather name="trending-up" size={20} color="#fff" style={{ marginRight: 8 }} />
                                            <Text style={styles.analyzeBtnText}>Find Options</Text>
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Results */}
                        {results.length > 0 && (
                            <View style={styles.resultsContainer}>
                                <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
                                    {results.length} Options Found
                                </Text>

                                {results.map((result, idx) => (
                                    <View key={idx} style={[styles.resultCard, isDark ? styles.cardDark : styles.cardLight]}>
                                        <View style={styles.resultHeader}>
                                            <View style={styles.row}>
                                                <LinearGradient colors={[result.colors[0], result.colors[1]]} style={styles.iconBox}>
                                                    <MaterialCommunityIcons name={result.icon} size={24} color="#FFF" />
                                                </LinearGradient>
                                                <View style={{ marginLeft: 12 }}>
                                                    <Text style={[styles.transportType, isDark ? styles.textDark : styles.textLight]}>{result.transportType}</Text>
                                                    {idx === 0 && <Text style={styles.cheapestBadge}>💰 Cheapest</Text>}
                                                </View>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text style={[styles.fareText, { color: result.colors[0] }]}>{result.fare}</Text>
                                                <Text style={styles.estimatedText}>Est. Fare</Text>
                                            </View>
                                        </View>

                                        <View style={[styles.statsRow, isDark ? styles.borderDarkTop : styles.borderLightTop]}>
                                            <View style={styles.statCol}>
                                                <Text style={styles.statLabel}>Distance</Text>
                                                <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>{result.distance}</Text>
                                            </View>
                                            <View style={[styles.statDivider, isDark ? styles.borderDarkLeft : styles.borderLightLeft]} />
                                            <View style={styles.statCol}>
                                                <Text style={styles.statLabel}>Duration</Text>
                                                <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>{result.duration}</Text>
                                            </View>
                                            <View style={[styles.statDivider, isDark ? styles.borderDarkLeft : styles.borderLightLeft]} />
                                            <View style={styles.statCol}>
                                                <Text style={styles.statLabel}>Per Km</Text>
                                                <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>
                                                    ₹{(parseInt(result.fare.replace('₹', '')) / parseInt(result.distance)).toFixed(0)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex1: { flex: 1 },
    row: { flexDirection: 'row', alignItems: 'center' },
    container: {
        flex: 1,
        paddingTop: STATUSBAR_HEIGHT,
    },
    bgLight: { backgroundColor: '#f8fafc' },
    bgDark: { backgroundColor: '#0f172a' },
    textLight: { color: '#0f172a' },
    textDark: { color: '#f8fafc' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    borderLight: { borderBottomColor: '#e2e8f0' },
    borderDark: { borderBottomColor: '#1e293b' },
    borderLightTop: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#e2e8f0' },
    borderDarkTop: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#1e293b' },
    borderLightLeft: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: '#e2e8f0' },
    borderDarkLeft: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: '#1e293b' },
    bgLightHighlight: { backgroundColor: '#f1f5f9' },
    bgDarkHighlight: { backgroundColor: '#1e293b' },
    backBtn: { padding: spacing.xs, marginRight: spacing.sm },
    headerTitleContainer: { flex: 1 },
    headerTitle: { fontSize: 20, fontWeight: '800' },
    headerSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
    scrollContent: { padding: spacing.lg, paddingBottom: 100 },
    card: {
        borderRadius: radius.xl,
        padding: spacing.md,
        marginBottom: spacing.xl,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    cardLight: { backgroundColor: '#FFFFFF', shadowColor: '#000' },
    cardDark: { backgroundColor: '#1e293b', shadowColor: '#000' },
    inputSection: { marginBottom: spacing.md },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
    },
    inputIcon: { width: 24, textAlign: 'center', marginRight: spacing.sm },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        height: '100%',
    },
    detectBtn: {
        padding: spacing.sm,
        backgroundColor: '#e0f2fe',
        borderRadius: radius.md,
    },
    dividerWrapper: {
        height: 30,
        justifyContent: 'center',
        position: 'relative',
        marginLeft: 11,
    },
    dividerLine: {
        position: 'absolute',
        top: 0, bottom: 0,
        borderLeftWidth: 2,
        borderStyle: 'dashed',
    },
    swapBtn: {
        position: 'absolute',
        left: -14,
        width: 30, height: 30,
        borderRadius: 15,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    analyzeBtn: {
        borderRadius: radius.lg,
        overflow: 'hidden',
        marginTop: spacing.md,
    },
    analyzeBtnDisabled: { opacity: 0.7 },
    analyzeGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    analyzeBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    suggestionsContainer: {
        borderRadius: radius.lg,
        marginTop: 4,
        marginBottom: spacing.sm,
        overflow: 'hidden',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    suggestionBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cbd5e1',
    },
    suggestionText: {
        fontSize: 14,
        fontWeight: '700',
    },
    suggestionIconWrapper: {
        width: 32,
        alignItems: 'center',
    },
    suggestionTextWrapper: {
        flex: 1,
        marginLeft: spacing.sm,
    },
    suggestionSubText: {
        fontSize: 11,
        color: '#64748b',
        marginTop: 2,
    },
    resultsContainer: {
        marginTop: spacing.sm,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: spacing.md,
    },
    resultCard: {
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginBottom: spacing.md,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    iconBox: {
        width: 48, height: 48,
        borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
    },
    transportType: {
        fontSize: 16,
        fontWeight: '700',
    },
    cheapestBadge: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
        backgroundColor: '#d1fae5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    fareText: {
        fontSize: 22,
        fontWeight: '900',
    },
    estimatedText: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        paddingTop: spacing.md,
    },
    statCol: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        height: '100%',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
    },
});
