import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius } from '../../theme/spacing';

interface QuickActionGridProps {
    isDark: boolean;
    onNavigate: (screenName: string) => void;
    onLogout: () => void;
    onToggleTheme: () => void;
}

export function QuickActionGrid({ isDark, onNavigate, onLogout, onToggleTheme }: QuickActionGridProps) {
    const actions = [
        { icon: 'settings-outline', label: 'Settings', action: () => onNavigate('Settings'), color: '#64748b' },
        { icon: 'time-outline', label: 'History', action: () => onNavigate('History'), color: '#3b82f6' },
        { icon: isDark ? 'sunny-outline' : 'moon-outline', label: isDark ? 'Light App' : 'Dark App', action: onToggleTheme, color: '#f59e0b' },
        { icon: 'language-outline', label: 'Language', action: () => onNavigate('Language'), color: '#0ea5e9' },
        { icon: 'log-out-outline', label: 'Logout', action: onLogout, color: '#ef4444' },
    ] as const;

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
                Preferences
            </Text>

            <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
                {actions.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.row, index < actions.length - 1 && (isDark ? styles.borderDark : styles.borderLight)]}
                        onPress={item.action}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                            <Ionicons name={item.icon} size={20} color={item.color} />
                        </View>
                        <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>
                            {item.label}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: spacing.md,
        marginLeft: 4,
    },
    card: {
        borderRadius: radius.xl,
        overflow: 'hidden',
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    borderLight: {
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    borderDark: {
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    label: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    textLight: {
        color: '#0f172a',
    },
    textDark: {
        color: '#f8fafc',
    },
});
