import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';
import { Skeleton, SkeletonCard, SkeletonChart } from '../ui/Skeleton';

export function StatisticsScreenSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton width={24} height={24} borderRadius={12} />
        <Skeleton width={80} height={24} />
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector Skeleton */}
        <SkeletonCard>
          <Skeleton width={80} height={18} style={styles.sectionTitle} />
          <View style={styles.periodSelector}>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} width={60} height={32} borderRadius={16} style={styles.periodButton} />
            ))}
          </View>
        </SkeletonCard>

        {/* Summary Stats Skeleton */}
        <SkeletonCard>
          <Skeleton width={100} height={18} style={styles.sectionTitle} />
          <View style={styles.statsGrid}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.statItem}>
                <Skeleton width={50} height={14} />
                <Skeleton width={80} height={20} style={styles.statValue} />
              </View>
            ))}
          </View>
        </SkeletonCard>

        {/* Expense Breakdown Chart Skeleton */}
        <SkeletonCard>
          <Skeleton width={120} height={18} style={styles.sectionTitle} />
          <SkeletonChart height={250} />
        </SkeletonCard>

        {/* Average Data Skeleton */}
        <SkeletonCard>
          <Skeleton width={100} height={18} style={styles.sectionTitle} />
          <View style={styles.averageRow}>
            <View style={styles.averageItem}>
              <Skeleton width={80} height={14} />
              <Skeleton width={100} height={20} style={styles.averageValue} />
            </View>
            <View style={styles.averageItem}>
              <Skeleton width={80} height={14} />
              <Skeleton width={100} height={20} style={styles.averageValue} />
            </View>
          </View>
        </SkeletonCard>

        {/* Monthly Trends Skeleton */}
        <SkeletonCard>
          <Skeleton width={100} height={18} style={styles.sectionTitle} />
          <View style={styles.trendsContainer}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.trendItem}>
                <Skeleton width={60} height={14} />
                <View style={styles.trendValues}>
                  <Skeleton width={80} height={16} />
                  <Skeleton width={80} height={16} />
                </View>
              </View>
            ))}
          </View>
        </SkeletonCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  periodButton: {
    marginHorizontal: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    marginTop: 4,
  },
  averageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  averageItem: {
    alignItems: 'center',
  },
  averageValue: {
    marginTop: 4,
  },
  trendsContainer: {
    gap: 12,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  trendValues: {
    alignItems: 'flex-end',
    gap: 4,
  },
});
