import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../../theme/spacing';

interface ProfileHeaderProps {
    name: string;
    email: string;
    photoUrl: string | null;
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    onEditPress: () => void;
}

export function ProfileHeader({
    name,
    email,
    photoUrl,
    fadeAnim,
    slideAnim,
    onEditPress,
}: ProfileHeaderProps) {
    // Basic handle derivation
    const handle = email && email.includes('@') ? email.split('@')[0] : 'trekker';

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={styles.photoContainer}>
                {photoUrl ? (
                    <Image source={{ uri: photoUrl }} style={styles.photo} />
                ) : (
                    <View style={styles.photoPlaceholder}>
                        <Ionicons name="person" size={40} color="#94a3b8" />
                    </View>
                )}
            </View>

            <View style={styles.infoRow}>
                <View style={styles.textContainer}>
                    <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
                    <Text style={styles.handleText} numberOfLines={1}>@{handle}</Text>
                </View>

                <TouchableOpacity style={styles.editBtn} onPress={onEditPress}>
                    <Ionicons name="pencil-outline" size={16} color="#0f766e" />
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 100, // Make room for top background/notch
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.xxl,
    },
    photoContainer: {
        marginBottom: spacing.lg,
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 30, // Squircle look
        borderWidth: 3,
        borderColor: '#ffffff',
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#ffffff',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        paddingRight: spacing.md,
    },
    nameText: {
        fontSize: 26,
        fontWeight: '800',
        color: '#0a4a4b', // Deep teal from reference
        marginBottom: 4,
    },
    handleText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#477677',
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(15, 118, 110, 0.2)', // Soft teal border
        marginTop: 4,
    },
    editText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f766e',
        marginLeft: 6,
    },
});
