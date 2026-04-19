import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Platform, StatusBar, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TransitItem } from '../../services/transitService';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const QUOTAS = ['General', 'Senior Citizen', 'Ladies'] as const;

const CLASS_PRICES: Record<string, number> = {
    '1A': 2800, '2A': 1600, '3A': 1100, '3E': 1100,
    'CC': 850, 'SL': 450, '2S': 250,
};

export default function TrainDetailScreen({ route, navigation }: any) {
    const item: TransitItem = route.params.item;
    const [selectedClass, setSelectedClass] = useState(item.classes?.[0] ?? 'SL');
    const [selectedQuota, setSelectedQuota] = useState<typeof QUOTAS[number]>('General');

    const availabilityDates = useMemo(() => {
        const today = new Date();
        const quotaMultiplier = selectedQuota === 'General' ? 1 : selectedQuota === 'Senior Citizen' ? 0.3 : 0.2;
        return Array.from({ length: 5 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + (i + 1) * 7);
            const rand = Math.random();
            const notAvail = selectedQuota === 'Ladies' && rand > 0.2;
            let status = 'AVL';
            let seats = Math.floor(Math.random() * 100 * quotaMultiplier) + (i * 20);
            let color = '#16a34a';
            if (!notAvail && i < 2) {
                if (rand > 0.7) { status = 'WL'; seats = Math.floor(Math.random() * 50) + 1; color = '#d97706'; }
                else if (rand > 0.4) { status = 'RAC'; seats = Math.floor(Math.random() * 30) + 1; color = '#ea580c'; }
            }
            const basePrice = CLASS_PRICES[selectedClass] ?? 450;
            const price = Math.floor(basePrice + Math.random() * 50);
            return {
                dateTop: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                dateBottom: d.toLocaleDateString('en-GB', { weekday: 'short' }),
                status, seats, color, price, notAvail,
            };
        });
    }, [selectedClass, selectedQuota, item]);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Hero Header */}
            <LinearGradient
                colors={['#1e1b4b', '#4f46e5', '#7c3aed']}
                style={styles.hero}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={{ paddingTop: STATUSBAR_HEIGHT + 12 }}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
                        <Text style={styles.backBtnText}>← Back</Text>
                    </TouchableOpacity>
                    <View style={styles.trainNumberRow}>
                        <View style={styles.trainNumberBadge}>
                            <Text style={styles.trainNumberText}>#{item.number}</Text>
                        </View>
                        {item.availability && (
                            <View style={styles.availBadge}>
                                <Text style={styles.availText}>{item.availability}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.trainName}>{item.name}</Text>

                    {/* Route Row */}
                    <View style={styles.routeRow}>
                        <View>
                            <Text style={styles.routeTime}>{item.departure}</Text>
                            <Text style={styles.routeStation}>{item.from}</Text>
                        </View>
                        <View style={styles.routeMiddle}>
                            <View style={styles.routeLine} />
                            <Text style={styles.routeDuration}>{item.duration}</Text>
                            <View style={styles.routeLine} />
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.routeTime}>{item.arrival}</Text>
                            <Text style={styles.routeStation}>{item.to}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

                {/* Class Selector */}
                <View style={styles.classCard}>
                    <Text style={styles.sectionLabel}>SELECT CLASS</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                        {(item.classes ?? []).map((cls) => {
                            const isActive = selectedClass === cls;
                            const basePrice = CLASS_PRICES[cls] ?? 450;
                            return (
                                <TouchableOpacity
                                    key={cls}
                                    onPress={() => setSelectedClass(cls)}
                                    style={[styles.classChip, isActive && styles.classChipActive]}
                                >
                                    <Text style={[styles.classCode, isActive && styles.classCodeActive]}>{cls}</Text>
                                    <Text style={[styles.classPrice, isActive && styles.classPriceActive]}>₹{basePrice}</Text>
                                    <Text style={[styles.classStatus, { color: isActive ? '#fff' : '#16a34a' }]}>AVL</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Quota Tabs */}
                <View style={styles.quotaTabs}>
                    {QUOTAS.map((q) => (
                        <TouchableOpacity
                            key={q}
                            style={[styles.quotaTab, selectedQuota === q && styles.quotaTabActive]}
                            onPress={() => setSelectedQuota(q)}
                        >
                            <Text style={[styles.quotaTabText, selectedQuota === q && styles.quotaTabTextActive]}>{q}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Availability Calendar */}
                <View style={styles.calendarCard}>
                    <Text style={styles.sectionLabel}>AVAILABILITY</Text>
                    {availabilityDates.map((d, i) => (
                        <View key={i} style={[styles.calRow, i < availabilityDates.length - 1 && styles.calRowBorder]}>
                            <View style={{ minWidth: 70 }}>
                                <Text style={styles.calDateTop}>{d.dateTop}</Text>
                                <Text style={styles.calDateBottom}>{d.dateBottom}</Text>
                            </View>
                            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                                {d.notAvail ? (
                                    <Text style={styles.calNotAvail}>Not Available</Text>
                                ) : (
                                    <>
                                        <Text style={[styles.calStatus, { color: d.color }]}>{d.status} {d.seats}</Text>
                                        <Text style={[styles.calStatusLabel, { color: d.color }]}>
                                            {d.status === 'AVL' ? 'Available' : d.status === 'WL' ? 'Waitlist' : 'RAC'}
                                        </Text>
                                    </>
                                )}
                            </View>
                            <TouchableOpacity
                                disabled={d.notAvail}
                                onPress={() => Linking.openURL('https://www.irctc.co.in')}
                                style={[styles.bookBtn, d.notAvail && styles.bookBtnDisabled]}
                            >
                                <Text style={[styles.bookBtnLabel, d.notAvail && styles.bookBtnLabelDisabled]}>Book Now</Text>
                                <Text style={[styles.bookBtnPrice, d.notAvail && styles.bookBtnLabelDisabled]}>₹{d.price}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Quick Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionLabel}>QUICK INFO</Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoItemIcon}>📅</Text>
                            <Text style={styles.infoItemLabel}>Frequency</Text>
                            <Text style={styles.infoItemValue}>{item.frequency}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoItemIcon}>⏱️</Text>
                            <Text style={styles.infoItemLabel}>Duration</Text>
                            <Text style={styles.infoItemValue}>{item.duration}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoItemIcon}>💰</Text>
                            <Text style={styles.infoItemLabel}>Fare Range</Text>
                            <Text style={styles.infoItemValue}>{item.price}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoItemIcon}>🎫</Text>
                            <Text style={styles.infoItemLabel}>Classes</Text>
                            <Text style={styles.infoItemValue}>{item.classes?.join(', ')}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },

    hero: { paddingHorizontal: 20, paddingBottom: 24 },
    backBtn: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 7,
        marginBottom: 12,
    },
    backBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    trainNumberRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    trainNumberBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    trainNumberText: { fontSize: 12, color: '#e0e7ff', fontWeight: '700' },
    availBadge: {
        backgroundColor: '#16a34a',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    availText: { fontSize: 12, color: '#fff', fontWeight: '700' },
    trainName: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 16, lineHeight: 26 },

    routeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    routeTime: { fontSize: 20, fontWeight: '800', color: '#fff' },
    routeStation: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500', maxWidth: 120 },
    routeMiddle: { flex: 1, alignItems: 'center', paddingHorizontal: 8, gap: 4 },
    routeLine: { flex: 1, height: 1.5, backgroundColor: 'rgba(255,255,255,0.3)', width: '100%' },
    routeDuration: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600', textAlign: 'center' },

    body: { flex: 1 },

    sectionLabel: { fontSize: 10, fontWeight: '900', color: '#94a3b8', letterSpacing: 2, marginBottom: 4 },

    classCard: {
        backgroundColor: '#fff',
        margin: 16,
        marginBottom: 0,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    classChip: {
        minWidth: 110,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        padding: 12,
        marginRight: 10,
        alignItems: 'flex-start',
    },
    classChipActive: {
        backgroundColor: '#4f46e5',
        borderColor: '#4f46e5',
    },
    classCode: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 2 },
    classCodeActive: { color: '#fff' },
    classPrice: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 4 },
    classPriceActive: { color: '#c7d2fe' },
    classStatus: { fontSize: 13, fontWeight: '800' },

    quotaTabs: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    quotaTab: {
        flex: 1,
        paddingVertical: 13,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    quotaTabActive: {
        borderBottomColor: '#4f46e5',
        backgroundColor: '#f5f3ff',
    },
    quotaTabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
    quotaTabTextActive: { color: '#4f46e5', fontWeight: '800' },

    calendarCard: {
        backgroundColor: '#fff',
        margin: 16,
        marginTop: 10,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    calRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    calRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    calDateTop: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
    calDateBottom: { fontSize: 12, color: '#64748b' },
    calStatus: { fontSize: 16, fontWeight: '800' },
    calStatusLabel: { fontSize: 12, fontWeight: '600' },
    calNotAvail: { fontSize: 14, fontWeight: '700', color: '#ef4444' },

    bookBtn: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#4f46e5',
        paddingHorizontal: 14,
        paddingVertical: 8,
        alignItems: 'center',
    },
    bookBtnDisabled: { borderColor: '#e2e8f0' },
    bookBtnLabel: { fontSize: 12, fontWeight: '800', color: '#4f46e5' },
    bookBtnPrice: { fontSize: 11, fontWeight: '600', color: '#4f46e5' },
    bookBtnLabelDisabled: { color: '#94a3b8' },

    infoCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
    infoItem: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    infoItemIcon: { fontSize: 22, marginBottom: 4 },
    infoItemLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginBottom: 2 },
    infoItemValue: { fontSize: 13, fontWeight: '700', color: '#1e293b', textAlign: 'center' },
});
