import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../../components/ui';
import { BusIcon, ClockIcon, MoneyCoinIcon, MapIcon } from '../../components/icons';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { shadows } from '../../theme/shadows';

export interface UrbanRoute {
  id: string;
  routeName: string;
  start: string;
  end: string;
  via: string[];
  distance_km: number;
  fare_min: number;
  fare_max: number;
  frequency: string;
  operation_time: string;
  type: string;
}

interface BusRouteCardProps {
  route: UrbanRoute;
  onPress: () => void;
}

export const BusRouteCard: React.FC<BusRouteCardProps> = ({ route, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.cardContainer}>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.routeNameContainer}>
            <BusIcon size={24} color="#0E7C86" />
            <Text style={styles.routeName}>{route.routeName}</Text>
          </View>
          <View style={styles.routeIdBadge}>
            <Text style={styles.routeIdText}>{route.id}</Text>
          </View>
        </View>

        <View style={styles.routePath}>
          <View style={styles.locationPoint}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText} numberOfLines={1}>{route.start}</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
          <View style={styles.locationPoint}>
            <View style={[styles.locationDot, styles.locationDotEnd]} />
            <Text style={styles.locationText} numberOfLines={1}>{route.end}</Text>
          </View>
        </View>

        <View style={styles.routeInfo}>
          <View style={styles.infoItem}>
            <MoneyCoinIcon size={18} color="#F4C430" />
            <Text style={styles.infoText}>
              ₹{route.fare_min} - ₹{route.fare_max}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <ClockIcon size={18} color="#0E7C86" />
            <Text style={styles.infoText}>{route.frequency}</Text>
          </View>
        </View>

        <View style={styles.timingContainer}>
          <Text style={styles.timingText}>{route.operation_time}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

interface FareInfoCardProps {
  fareMin: number;
  fareMax: number;
  type: string;
}

export const FareInfoCard: React.FC<FareInfoCardProps> = ({ fareMin, fareMax, type }) => {
  return (
    <Card style={styles.fareCard}>
      <View style={styles.fareHeader}>
        <MoneyCoinIcon size={24} color="#F4C430" />
        <Text style={styles.fareTitle}>Fare Information</Text>
      </View>
      <View style={styles.fareContent}>
        <View style={styles.fareRange}>
          <Text style={styles.fareLabel}>Fare Range</Text>
          <Text style={styles.fareValue}>₹{fareMin} - ₹{fareMax}</Text>
        </View>
        <View style={styles.fareType}>
          <Text style={styles.fareLabel}>Type</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{type}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

interface StopChipProps {
  stop: string;
  index: number;
  isLast?: boolean;
}

export const StopChip: React.FC<StopChipProps> = ({ stop, index, isLast }) => {
  return (
    <View style={styles.stopChip}>
      <View style={styles.stopChipNumber}>
        <Text style={styles.stopChipNumberText}>{index + 1}</Text>
      </View>
      <Text style={styles.stopChipText} numberOfLines={1}>{stop}</Text>
    </View>
  );
};

interface InfoSectionCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const InfoSectionCard: React.FC<InfoSectionCardProps> = ({ title, children, icon }) => {
  return (
    <Card style={styles.infoSectionCard}>
      <View style={styles.infoSectionHeader}>
        {icon && <View style={styles.infoSectionIcon}>{icon}</View>}
        <Text style={styles.infoSectionTitle}>{title}</Text>
      </View>
      <View style={styles.infoSectionContent}>{children}</View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: spacing.md,
  },
  card: {
    padding: spacing.lg,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  routeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  routeName: {
    ...typography.h4,
    color: '#000000',
    fontWeight: '700',
    marginLeft: spacing.sm,
    flex: 1,
  },
  routeIdBadge: {
    backgroundColor: '#0E7C8620',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  routeIdText: {
    ...typography.labelMedium,
    color: '#0E7C86',
    fontWeight: '700',
  },
  routePath: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: '#F7FAFC',
    borderRadius: radius.md,
  },
  locationPoint: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0E7C86',
    marginRight: spacing.sm,
  },
  locationDotEnd: {
    backgroundColor: '#F4C430',
  },
  locationText: {
    ...typography.bodyMedium,
    color: '#000000',
    flex: 1,
    fontWeight: '600',
  },
  arrow: {
    ...typography.h3,
    color: '#0E7C86',
    marginHorizontal: spacing.sm,
    fontWeight: '700',
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    ...typography.bodyMedium,
    color: '#666666',
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  timingContainer: {
    paddingTop: spacing.sm,
  },
  timingText: {
    ...typography.bodySmall,
    color: '#666666',
  },
  fareCard: {
    padding: spacing.lg,
    borderRadius: 20,
    backgroundColor: '#FEF9E7',
    borderWidth: 1,
    borderColor: '#F4C43030',
  },
  fareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  fareTitle: {
    ...typography.h4,
    color: '#000000',
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  fareContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fareRange: {
    flex: 1,
  },
  fareLabel: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
  },
  fareValue: {
    ...typography.h3,
    color: '#F4C430',
    fontWeight: '700',
  },
  fareType: {
    flex: 1,
    alignItems: 'flex-end',
  },
  typeBadge: {
    backgroundColor: '#0E7C8620',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.xs,
  },
  typeText: {
    ...typography.labelSmall,
    color: '#0E7C86',
    fontWeight: '600',
  },
  stopChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stopChipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0E7C86',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  stopChipNumberText: {
    ...typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 10,
  },
  stopChipText: {
    ...typography.bodySmall,
    color: '#000000',
    fontWeight: '600',
    flex: 1,
  },
  infoSectionCard: {
    padding: spacing.lg,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  infoSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoSectionIcon: {
    marginRight: spacing.sm,
  },
  infoSectionTitle: {
    ...typography.h4,
    color: '#000000',
    fontWeight: '700',
  },
  infoSectionContent: {
    marginTop: spacing.xs,
  },
});

