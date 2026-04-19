import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HistoryItem } from '../../utils/firestore';
import { spacing, radius } from '../../theme/spacing';

interface ActivitySectionProps {
    history: HistoryItem[];
    isDark: boolean;
    onNavigateItem: (item: HistoryItem) => void;
}

export function ActivitySection({ history, isDark, onNavigateItem }: ActivitySectionProps) {
    if (history.length === 0) {
        return null;
    }

    const recentHistory = history.slice(0, 5); // Show top 5

    const getIcon = (type: string) => {
        switch (type) {
            case 'trip': return { name: 'map', color: '#8b5cf6' };
            case 'place': return { name: 'location', color: '#10b981' };
            default: return { name: 'compass', color: '#0ea5e9' };
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
                Recent Activity
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {recentHistory.map((item) => {
                    const iconRef = getIcon(item.type);

                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.activityCard, isDark ? styles.cardDark : styles.cardLight]}
                            onPress={() => onNavigateItem(item)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconBox, { backgroundColor: `${iconRef.color}15` }]}>
                                <Ionicons name={iconRef.name as any} size={20} color={iconRef.color} />
                            </View>
                            <View style={styles.textContent}>
                                <Text
                                    style={[styles.activityTitle, isDark ? styles.textDark : styles.textLight]}
                                    numberOfLines={2}
                                >
                                    {item.title}
                                </Text>
                                <Text style={styles.activityMeta}>
                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {new Date(item.createdAt as string).toLocaleDateString()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: spacing.xs,
        paddingBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: spacing.md,
        paddingHorizontal: spacing.lg,
        marginLeft: 4,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    activityCard: {
        width: 200,
        borderRadius: radius.md,
        padding: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardLight: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardDark: {
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    textContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    activityMeta: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '500',
    },
    textLight: {
        color: '#0f172a',
    },
    textDark: {
        color: '#f8fafc',
    },
});
