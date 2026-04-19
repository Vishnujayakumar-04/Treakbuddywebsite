import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, Animated } from 'react-native';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    style,
    onFocus,
    onBlur,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <View style={styles.container}>
            {/* Label on top */}
            <Text style={[styles.label, error ? styles.labelError : undefined]}>
                {label}
            </Text>

            {/* Rounded Input Wrapper */}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                    error ? styles.inputError : undefined,
                ]}
            >
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={[styles.input, style]}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholderTextColor="#94A3B8"
                    {...props}
                />
            </View>

            {/* Error below */}
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg, // Standard 16 margin bottom
    },
    label: {
        ...typography.small,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: spacing.xs, // 4 gap
    },
    labelError: {
        color: '#EF4444', // Red fallback, error color
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48, // Brand strict height 
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: radius.button, // 12
        paddingHorizontal: spacing.md, // 12
    },
    inputFocused: {
        borderColor: '#0F766E',
        backgroundColor: '#FFFFFF',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    iconContainer: {
        marginRight: spacing.sm, // 8
    },
    input: {
        flex: 1,
        height: '100%',
        ...typography.body,
        color: '#0F172A',
    },
    errorText: {
        ...typography.caption,
        color: '#EF4444',
        marginTop: spacing.xs, // 4 gap
    },
});
