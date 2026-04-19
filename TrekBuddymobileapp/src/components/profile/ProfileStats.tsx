import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius } from '../../theme/spacing';

interface ProfileStatsProps {
    tripsCount: number;
    favoritesCount: number;
    visitedCount: number;
    isDark: boolean;
}

export function ProfileStats({ tripsCount, favoritesCount, visitedCount, isDark }: ProfileStatsProps) {
    const statCards = [
        { icon: 'map', label: 'Trips', value: tripsCount.toString(), color: '#8b5cf6' },
        { icon: 'heart', label: 'Saved', value: favoritesCount.toString(), color: '#ef4444' },
        { icon: 'location', label: 'Visited', value: visitedCount.toString(), color: '#10b981' },
    ] as const;

    return (
        <View style={styles.statsRow}>
            {statCards.map((stat, index) => (
                <View
                    key={index}
                    style={[
                        styles.statCard,
                        isDark ? styles.statCardDark : styles.statCardLight
                    ]}
                >
                    <View style={[styles.iconContainer, { backgroundColor: `${stat.color}15` }]}>
                        <Ionicons name={stat.icon} size={24} color={stat.color} />
                    </View>
                    <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>
                        {stat.value}
                    </Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        gap: spacing.md,
    },
    statCard: {
        flex: 1,
        borderRadius: radius.xl,
        padding: spacing.md,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statCardLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(241, 245, 249, 0.8)',
    },
    statCardDark: {
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.5)',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    textLight: {
        color: '#0f172a',
    },
    textDark: {
        color: '#f8fafc',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
});
