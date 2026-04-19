import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius } from '../../theme/spacing';

interface ProfileMenuModalProps {
    visible: boolean;
    onClose: () => void;
    isDark: boolean;
    onNavigate: (screenName: string) => void;
    onToggleTheme: () => void;
    onLogout: () => void;
}

export function ProfileMenuModal({
    visible,
    onClose,
    isDark,
    onNavigate,
    onToggleTheme,
    onLogout,
}: ProfileMenuModalProps) {
    const actions = [
        { icon: 'settings-outline', label: 'Settings', action: () => { onClose(); onNavigate('Settings'); }, color: '#64748b' },
        { icon: 'time-outline', label: 'History', action: () => { onClose(); onNavigate('History'); }, color: '#3b82f6' },
        { icon: isDark ? 'sunny-outline' : 'moon-outline', label: isDark ? 'Light App' : 'Dark App', action: () => { onClose(); onToggleTheme(); }, color: '#f59e0b' },
        { icon: 'language-outline', label: 'Language', action: () => { onClose(); onNavigate('Language'); }, color: '#0ea5e9' },
        { icon: 'log-out-outline', label: 'Logout', action: () => { onClose(); onLogout(); }, color: '#ef4444' },
    ] as const;

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.menuContainer, isDark ? styles.menuDark : styles.menuLight]}>
                            <View style={styles.dragHandle} />
                            <Text style={[styles.menuTitle, isDark ? styles.textDark : styles.textLight]}>Menu</Text>

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
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    menuContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
        paddingTop: spacing.md,
    },
    menuLight: {
        backgroundColor: '#FFFFFF',
    },
    menuDark: {
        backgroundColor: '#1e293b',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#cbd5e1',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: spacing.lg,
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: '800',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    borderLight: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e2e8f0',
    },
    borderDark: {
        borderBottomWidth: StyleSheet.hairlineWidth,
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
