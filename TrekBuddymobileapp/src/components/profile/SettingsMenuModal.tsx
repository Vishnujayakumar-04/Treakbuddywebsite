import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Switch,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { spacing, radius } from '../../theme/spacing';

interface SettingsMenuModalProps {
    visible: boolean;
    onClose: () => void;
    userName: string;
    userEmail: string;
    isDark: boolean;
    onToggleTheme: (value: boolean) => void;
    onLogout: () => void;
    navigation: any;
}

export const SettingsMenuModal: React.FC<SettingsMenuModalProps> = ({
    visible,
    onClose,
    userName,
    userEmail,
    isDark,
    onToggleTheme,
    onLogout,
    navigation,
}) => {
    const slideAnim = useSharedValue(400); // Start off-screen right
    const fadeAnim = useSharedValue(0); // Start invisible

    useEffect(() => {
        if (visible) {
            slideAnim.value = withSpring(0, { damping: 20, stiffness: 90 });
            fadeAnim.value = withTiming(1, { duration: 300 });
        } else {
            slideAnim.value = withTiming(400, { duration: 250 });
            fadeAnim.value = withTiming(0, { duration: 250 });
        }
    }, [visible]);

    const handleClose = () => {
        slideAnim.value = withTiming(400, { duration: 250 }, () => {
            runOnJS(onClose)();
        });
        fadeAnim.value = withTiming(0, { duration: 250 });
    };

    const animatedDrawerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: slideAnim.value }],
    }));

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
    }));

    if (!visible && slideAnim.value === 400) return null;

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <Animated.View style={[styles.backdrop, animatedOverlayStyle]} />
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.drawerContainer, isDark && styles.drawerContainerDark, animatedDrawerStyle]}>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTextContainer}>
                            <Text style={[styles.userName, isDark && { color: '#fff' }]}>{userName}</Text>
                            <Text style={styles.userEmail}>{userEmail}</Text>
                        </View>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Feather name="x" size={24} color={isDark ? '#94a3b8' : '#64748b'} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.divider, isDark && styles.dividerDark]} />

                    {/* MENU Section */}
                    <Text style={styles.sectionTitle}>MENU</Text>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => { handleClose(); navigation.navigate('History'); }}
                    >
                        <Ionicons name="calendar-outline" size={22} color={isDark ? '#cbd5e1' : '#475569'} style={styles.menuIcon} />
                        <Text style={[styles.menuText, isDark && { color: '#f8fafc' }]}>History</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => { handleClose(); navigation.navigate('FAQ'); }}
                    >
                        <Ionicons name="help-circle-outline" size={22} color={isDark ? '#cbd5e1' : '#475569'} style={styles.menuIcon} />
                        <Text style={[styles.menuText, isDark && { color: '#f8fafc' }]}>FAQ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => { handleClose(); navigation.navigate('Settings'); }}
                    >
                        <Ionicons name="settings-outline" size={22} color={isDark ? '#cbd5e1' : '#475569'} style={styles.menuIcon} />
                        <Text style={[styles.menuText, isDark && { color: '#f8fafc' }]}>Settings</Text>
                    </TouchableOpacity>

                    {/* LEGAL & INFO Section */}
                    <View style={{ marginTop: 16 }}>
                        <Text style={styles.sectionTitle}>LEGAL & INFO</Text>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => { handleClose(); navigation.navigate('PrivacyPolicy'); }}
                        >
                            <Ionicons name="lock-closed-outline" size={22} color={isDark ? '#cbd5e1' : '#475569'} style={styles.menuIcon} />
                            <Text style={[styles.menuText, isDark && { color: '#f8fafc' }]}>Privacy Policy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => { handleClose(); navigation.navigate('About'); }}
                        >
                            <Ionicons name="information-circle-outline" size={22} color={isDark ? '#cbd5e1' : '#475569'} style={styles.menuIcon} />
                            <Text style={[styles.menuText, isDark && { color: '#f8fafc' }]}>About</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer Bottom Actions */}
                    <View style={styles.footer}>
                        <View style={[styles.divider, isDark && styles.dividerDark]} />

                        <View style={styles.darkModeRow}>
                            <Ionicons name="moon-outline" size={22} color={isDark ? '#cbd5e1' : '#475569'} style={styles.menuIcon} />
                            <Text style={[styles.menuText, isDark && { color: '#f8fafc' }, { flex: 1 }]}>Dark Mode</Text>
                            <Switch
                                value={isDark}
                                onValueChange={onToggleTheme}
                                trackColor={{ false: '#e2e8f0', true: '#0891b2' }}
                                thumbColor="#fff"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={() => { handleClose(); onLogout(); }}
                        >
                            <View style={styles.logoutContent}>
                                <Ionicons name="log-out-outline" size={20} color="#000" style={styles.logoutIcon} />
                                <Text style={styles.logoutText}>Log Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    drawerContainer: {
        width: '80%',
        maxWidth: 350,
        height: '100%',
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        shadowColor: '#000',
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    drawerContainerDark: {
        backgroundColor: '#0f172a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.md,
    },
    headerTextContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#64748b',
    },
    closeButton: {
        padding: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
        marginHorizontal: spacing.lg,
    },
    dividerDark: {
        backgroundColor: '#1e293b',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
        letterSpacing: 1,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        marginTop: spacing.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: spacing.xl,
    },
    menuIcon: {
        marginRight: 16,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    footer: {
        marginTop: 'auto',
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    darkModeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.md,
    },
    logoutButton: {
        backgroundColor: '#f1f5f9',
        marginHorizontal: spacing.xl,
        borderRadius: radius.lg,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutIcon: {
        marginRight: 8,
        transform: [{ scaleX: -1 }], // To flip the logout icon arrow to face left like in user's image
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    }
});
