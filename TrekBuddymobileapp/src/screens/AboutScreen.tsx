import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export default function AboutScreen({ navigation }: any) {
    const { isDark } = useTheme();

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.header, isDark && styles.headerDark]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, isDark && { color: '#fff' }]}>About TrekBuddy</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.text, isDark && { color: '#cbd5e1' }]}>
                    TrekBuddy v1.0.0{'\n\n'}
                    Your Ultimate Puducherry Travel Companion.{'\n'}
                    Designed to make your travel experience smooth, informative, and unforgettable.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    containerDark: { backgroundColor: '#0f172a' },
    header: {
        paddingTop: STATUSBAR_HEIGHT + spacing.md,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerDark: { backgroundColor: '#1e293b', borderBottomColor: '#334155' },
    backButton: { marginRight: spacing.md },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
    content: { padding: spacing.xl },
    text: { fontSize: 16, color: '#475569', lineHeight: 28 },
});
