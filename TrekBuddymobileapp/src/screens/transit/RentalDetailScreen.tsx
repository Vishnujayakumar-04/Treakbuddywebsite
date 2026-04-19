import React, { useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, Linking, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TransitItem } from '../../services/transitService';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export default function RentalDetailScreen({ route, navigation }: any) {
    const item: TransitItem = route.params.item;

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Hero Image */}
            <View style={styles.heroContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.heroImage} resizeMode="cover" />
                ) : (
                    <LinearGradient colors={['#1e3a5f', '#1e40af']} style={styles.heroImage}>
                        <Text style={styles.heroPlaceholderEmoji}>
                            {item.subCategory === 'Car' ? '🚗' : '🏍️'}
                        </Text>
                    </LinearGradient>
                )}
                {/* Overlay gradient */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.heroOverlay}
                />
                {/* Back button */}
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
                    <Text style={styles.backBtnText}>← Back</Text>
                </TouchableOpacity>
                {/* Rating */}
                {item.rating && (
                    <View style={styles.heroRating}>
                        <Text style={styles.heroRatingText}>⭐ {item.rating}</Text>
                    </View>
                )}
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                {/* Name & Location */}
                <View style={styles.section}>
                    <View style={styles.categoryPill}>
                        <Text style={styles.categoryPillText}>{item.subCategory}</Text>
                    </View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.location && (
                        <View style={styles.locationRow}>
                            <Text style={styles.locationIcon}>📍</Text>
                            <Text style={styles.locationText}>{item.location}</Text>
                        </View>
                    )}
                    {item.openHours && (
                        <View style={styles.locationRow}>
                            <Text style={styles.locationIcon}>🕐</Text>
                            <Text style={styles.locationText}>{item.openHours}</Text>
                        </View>
                    )}
                </View>

                {/* Price & Call */}
                <View style={styles.priceRow}>
                    <View>
                        <Text style={styles.priceLabel}>STARTS AT</Text>
                        <Text style={styles.price}>{item.price}</Text>
                    </View>
                    <View style={styles.actionButtons}>
                        {item.contact && (
                            <TouchableOpacity
                                style={styles.callBtn}
                                onPress={() => Linking.openURL(`tel:${item.contact}`)}
                            >
                                <Text style={styles.callBtnText}>📞 Call</Text>
                            </TouchableOpacity>
                        )}
                        {item.mapUrl && (
                            <TouchableOpacity
                                style={styles.mapBtn}
                                onPress={() => Linking.openURL(item.mapUrl!)}
                            >
                                <Text style={styles.mapBtnText}>🗺️ Map</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* About */}
                {item.about && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.aboutText}>{item.about}</Text>
                    </View>
                )}

                {/* Vehicles */}
                {item.vehicles && item.vehicles.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🚗 Available Vehicles</Text>
                        {item.vehicles.map((v, i) => (
                            <View key={i} style={styles.vehicleRow}>
                                <Text style={styles.vehicleCategory}>{v.category}</Text>
                                <Text style={styles.vehicleModels}>{v.models}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Documents */}
                {item.documents && item.documents.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📄 Required Documents</Text>
                        {item.documents.map((d, i) => (
                            <View key={i} style={styles.docCard}>
                                <Text style={styles.docName}>{d.name}</Text>
                                <Text style={styles.docDesc}>{d.desc}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Security Deposit */}
                {item.securityDeposit && (
                    <View style={styles.depositCard}>
                        <Text style={styles.depositIcon}>🔒</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.depositLabel}>Security Deposit</Text>
                            <Text style={styles.depositValue}>{item.securityDeposit}</Text>
                        </View>
                    </View>
                )}

                {/* Terms */}
                {item.terms && item.terms.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 Terms & Conditions</Text>
                        {item.terms.map((t, i) => (
                            <View key={i} style={styles.termRow}>
                                <Text style={styles.termTitle}>• {t.title}</Text>
                                <Text style={styles.termDesc}>{t.desc}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },

    heroContainer: { position: 'relative', height: 280 },
    heroImage: { width: '100%', height: 280, alignItems: 'center', justifyContent: 'center' },
    heroPlaceholderEmoji: { fontSize: 60 },
    heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
    backBtn: {
        position: 'absolute',
        top: STATUSBAR_HEIGHT + 14,
        left: 16,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    backBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    heroRating: {
        position: 'absolute',
        top: STATUSBAR_HEIGHT + 14,
        right: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    heroRatingText: { fontSize: 13, fontWeight: '700', color: '#1e293b' },

    body: { flex: 1 },

    section: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    categoryPill: {
        alignSelf: 'flex-start',
        backgroundColor: '#ecfdf5',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#bbf7d0',
        marginBottom: 8,
    },
    categoryPillText: { fontSize: 11, color: '#16a34a', fontWeight: '700' },
    itemName: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    locationIcon: { fontSize: 14, marginRight: 6 },
    locationText: { fontSize: 13, color: '#64748b', flex: 1 },

    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    priceLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginBottom: 2 },
    price: { fontSize: 22, fontWeight: '800', color: '#16a34a' },
    actionButtons: { flexDirection: 'row', gap: 8 },
    callBtn: {
        backgroundColor: '#16a34a',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    callBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    mapBtn: {
        backgroundColor: '#eff6ff',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    mapBtnText: { color: '#2563eb', fontWeight: '700', fontSize: 14 },

    sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
    aboutText: { fontSize: 14, color: '#475569', lineHeight: 22 },

    vehicleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    vehicleCategory: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
    vehicleModels: { fontSize: 13, color: '#64748b', flex: 1, textAlign: 'right' },

    docCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    docName: { fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
    docDesc: { fontSize: 12, color: '#64748b', lineHeight: 18 },

    depositCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff9f0',
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#fed7aa',
        gap: 12,
    },
    depositIcon: { fontSize: 24 },
    depositLabel: { fontSize: 11, fontWeight: '800', color: '#c2410c', letterSpacing: 1, marginBottom: 2 },
    depositValue: { fontSize: 14, fontWeight: '600', color: '#7c2d12' },

    termRow: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    termTitle: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 2 },
    termDesc: { fontSize: 12, color: '#64748b', lineHeight: 18 },
});
