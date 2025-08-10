import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';
import { Skeleton, SkeletonCard, SkeletonListItem } from '../ui/Skeleton';

export function TransactionsScreenSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton width={24} height={24} borderRadius={12} />
        <Skeleton width={100} height={24} />
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>

      {/* Summary Skeleton */}
      <SkeletonCard style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Skeleton width={50} height={14} />
            <Skeleton width={80} height={20} style={styles.summaryValue} />
          </View>
          <View style={styles.summaryItem}>
            <Skeleton width={50} height={14} />
            <Skeleton width={80} height={20} style={styles.summaryValue} />
          </View>
        </View>
      </SkeletonCard>

      {/* Filter Buttons Skeleton */}
      <View style={styles.filterContainer}>
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} width={70} height={36} borderRadius={18} style={styles.filterButton} />
        ))}
        <Skeleton width={24} height={24} borderRadius={12} style={styles.sortButton} />
      </View>

      {/* Transactions List Skeleton */}
      <View style={styles.listContainer}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <SkeletonCard key={item} style={styles.transactionCard}>
            <SkeletonListItem showAvatar showSubtitle showAction />
          </SkeletonCard>
        ))}
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  summaryCard: {
    margin: 16,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterButton: {
    marginRight: 8,
  },
  sortButton: {
    marginLeft: 'auto',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transactionCard: {
    marginBottom: 8,
  },
});
