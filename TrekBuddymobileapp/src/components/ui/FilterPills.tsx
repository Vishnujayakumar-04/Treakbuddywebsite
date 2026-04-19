import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { shadows } from '../../theme/shadows';

interface FilterPillsProps {
    options: string[];
    selectedOption: string;
    onSelectOption: (option: string) => void;
    style?: ViewStyle;
}

export function FilterPills({
    options,
    selectedOption,
    onSelectOption,
    style
}: FilterPillsProps) {
    if (!options || options.length === 0) return null;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.container, style]}
            contentContainerStyle={styles.contentContainer}
        >
            {options.map((option) => {
                const isActive = selectedOption === option;

                return (
                    <TouchableOpacity
                        key={option}
                        onPress={() => onSelectOption(option)}
                        style={[
                            styles.pill,
                            isActive ? styles.pillActive : styles.pillInactive
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.pillText,
                                isActive ? styles.pillTextActive : styles.pillTextInactive
                            ]}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 0,
        marginBottom: spacing.md,
    },
    contentContainer: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        gap: spacing.sm,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: radius.full,
        borderWidth: 1,
        ...shadows.sm,
        elevation: 2,
        marginRight: spacing.sm,
    },
    pillActive: {
        backgroundColor: '#0F172A',
        borderColor: '#0F172A',
    },
    pillInactive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
    },
    pillText: {
        ...typography.labelMedium,
        fontWeight: '600',
    },
    pillTextActive: {
        color: '#FFFFFF',
    },
    pillTextInactive: {
        color: '#64748B',
    },
});
