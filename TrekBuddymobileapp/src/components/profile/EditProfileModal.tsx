import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { spacing, radius } from '../../theme/spacing';
import { updateUserProfile } from '../../utils/firestore';

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    userId: string;
    currentName: string;
    currentEmail: string;
    currentPhotoUrl: string | null;
    isDark: boolean;
    onProfileUpdated: () => void;
}

export function EditProfileModal({
    visible,
    onClose,
    userId,
    currentName,
    currentEmail,
    currentPhotoUrl,
    isDark,
    onProfileUpdated
}: EditProfileModalProps) {
    const [name, setName] = useState(currentName);
    const [photoUri, setPhotoUri] = useState<string | null>(currentPhotoUrl);
    const [isUploading, setIsUploading] = useState(false);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to update your profile photo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Validation Error', 'Name cannot be empty.');
            return;
        }

        setIsUploading(true);
        let finalPhotoUrl = currentPhotoUrl;

        try {
            // 1. If photo changed, bypass Firebase Storage and save strictly to Local Storage
            if (photoUri && photoUri !== currentPhotoUrl) {
                await AsyncStorage.setItem(`profilePhoto_${userId}`, photoUri);
                finalPhotoUrl = photoUri;
            }

            const updates: any = { name: name.trim() };
            if (finalPhotoUrl !== undefined && finalPhotoUrl !== null) {
                updates.profilePhotoUrl = finalPhotoUrl;
            }

            // 2. Update Firestore User Profile
            await updateUserProfile(userId, updates);

            // 3. Callback to refresh AuthContext
            onProfileUpdated();
            onClose();
        } catch (error: any) {
            Alert.alert('Update Failed', error.message || 'Could not update profile.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={[styles.modalContent, isDark ? styles.modalDark : styles.modalLight]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose} disabled={isUploading}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={[styles.modalTitle, isDark ? styles.textDark : styles.textLight]}>Edit Profile</Text>
                        <TouchableOpacity onPress={handleSave} disabled={isUploading}>
                            {isUploading ? (
                                <Text style={[styles.saveText, { opacity: 0.6 }]}>Saving...</Text>
                            ) : (
                                <Text style={styles.saveText}>Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.avatarSection}>
                        <TouchableOpacity onPress={handlePickImage} disabled={isUploading} style={styles.avatarWrapper}>
                            {photoUri ? (
                                <Image source={{ uri: photoUri }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatarPlaceholder, isDark ? styles.placeholderDark : styles.placeholderLight]}>
                                    <Ionicons name="person" size={40} color={isDark ? '#64748b' : '#cbd5e1'} />
                                </View>
                            )}
                            <View style={styles.cameraIcon}>
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.changePhotoText}>Save Photo</Text>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your Name"
                            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                            editable={!isUploading}
                        />

                        <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Email (Immutable)</Text>
                        <TextInput
                            style={[
                                styles.input,
                                styles.disabledInput,
                                isDark ? styles.inputDark : styles.inputLight
                            ]}
                            value={currentEmail}
                            editable={false}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: spacing.lg,
        paddingBottom: 40,
        minHeight: '60%',
    },
    modalLight: {
        backgroundColor: '#FFFFFF',
    },
    modalDark: {
        backgroundColor: '#0f172a',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(150,150,150,0.2)',
    },
    cancelText: {
        fontSize: 16,
        color: '#64748b',
    },
    saveText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0ea5e9',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    textLight: {
        color: '#0f172a',
    },
    textDark: {
        color: '#f8fafc',
    },
    avatarSection: {
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: spacing.xs,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderLight: {
        backgroundColor: '#f1f5f9',
    },
    placeholderDark: {
        backgroundColor: '#1e293b',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#0ea5e9',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    changePhotoText: {
        fontSize: 14,
        color: '#0ea5e9',
        fontWeight: '600',
    },
    formSection: {
        paddingHorizontal: spacing.lg,
    },
    inputLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 4,
        marginLeft: 4,
    },
    input: {
        height: 50,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        fontSize: 16,
    },
    inputLight: {
        backgroundColor: '#f1f5f9',
        color: '#0f172a',
    },
    inputDark: {
        backgroundColor: '#1e293b',
        color: '#f8fafc',
    },
    disabledInput: {
        opacity: 0.6,
    },
});
