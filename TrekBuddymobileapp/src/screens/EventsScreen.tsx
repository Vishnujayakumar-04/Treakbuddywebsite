import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowBackIcon } from '../components/icons';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import eventsData from '../data/events.json';

// Get unique categories for filtering
const CATEGORIES = ['All', ...new Set(eventsData.map(item => item.category))];

interface EventsScreenProps {
    navigation: any;
}

export default function EventsScreen({ navigation }: EventsScreenProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const filteredEvents = selectedCategory === 'All'
        ? eventsData
        : eventsData.filter(event => event.category === selectedCategory);

    const renderCategoryPill = ({ item }: { item: string }) => {
        const isSelected = item === selectedCategory;
        return (
            <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                style={[
                    styles.categoryPill,
                    isSelected ? styles.categoryPillSelected : styles.categoryPillUnselected
                ]}
                activeOpacity={0.8}
            >
                <Text style={[
                    styles.categoryText,
                    isSelected ? styles.categoryTextSelected : styles.categoryTextUnselected
                ]}>
                    {item}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderEventCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => {
                // Here you could mock navigate to PlaceDetails if mapped, 
                // for now just simple mock.
            }}
        >
            <Image source={typeof item.image === 'number' ? item.image : { uri: item.image }} style={styles.cardImage} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.cardGradient}
            />
            <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{item.category}</Text>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDetails}>{item.date} • {item.location}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation?.goBack()}
                >
                    <ArrowBackIcon size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Events in Puducherry</Text>
            </View>

            {/* Categories Filter */}
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={CATEGORIES}
                    keyExtractor={(item) => item}
                    renderItem={renderCategoryPill}
                    contentContainerStyle={styles.filterList}
                />
            </View>

            {/* Events List */}
            <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item.id}
                renderItem={renderEventCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.sm,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
        flex: 1,
    },
    filterContainer: {
        paddingVertical: spacing.md,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    filterList: {
        paddingHorizontal: spacing.xl,
        gap: spacing.sm,
    },
    categoryPill: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        borderWidth: 1,
    },
    categoryPillSelected: {
        backgroundColor: '#0891B2', // cyan-600
        borderColor: '#0891B2',
    },
    categoryPillUnselected: {
        backgroundColor: '#fff',
        borderColor: '#E2E8F0',
    },
    categoryText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
    },
    categoryTextSelected: {
        color: '#fff',
    },
    categoryTextUnselected: {
        color: '#64748B',
    },
    listContainer: {
        padding: spacing.xl,
        gap: spacing.lg,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: radius.xl,
        overflow: 'hidden',
        height: 250,
        ...shadows.md,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '60%',
    },
    cardBadge: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.sm,
    },
    cardBadgeText: {
        fontFamily: 'Inter-Bold',
        fontSize: 10,
        color: '#0F172A',
        textTransform: 'uppercase',
    },
    cardContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.lg,
    },
    cardTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: '#fff',
        marginBottom: 4,
    },
    cardDetails: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: '#CBD5E1',
        marginBottom: 8,
    },
    cardDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 13,
        color: '#F1F5F9',
        lineHeight: 18,
    },
});
