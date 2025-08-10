import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';
import { Skeleton, SkeletonCard, SkeletonChart, SkeletonListItem } from '../ui/Skeleton';

export function HomeScreenSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <View>
            <Skeleton width={60} height={16} style={styles.greeting} />
            <Skeleton width={120} height={24} style={styles.title} />
          </View>
        </View>

        {/* Balance Card Skeleton */}
        <SkeletonCard style={styles.balanceCard}>
          <Skeleton width={80} height={16} style={styles.balanceLabel} />
          <Skeleton width={150} height={32} style={styles.balanceAmount} />
        </SkeletonCard>

        {/* Quick Actions Skeleton */}
        <View style={styles.quickActions}>
          <Skeleton width="48%" height={50} borderRadius={8} />
          <Skeleton width="48%" height={50} borderRadius={8} />
        </View>

        {/* Monthly Summary Skeleton */}
        <SkeletonCard>
          <Skeleton width={120} height={18} style={styles.sectionTitle} />
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Skeleton width={50} height={14} />
              <Skeleton width={80} height={20} style={styles.summaryValue} />
            </View>
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

        {/* Chart Skeleton */}
        <SkeletonCard>
          <Skeleton width={100} height={18} style={styles.sectionTitle} />
          <SkeletonChart height={200} />
        </SkeletonCard>

        {/* Recent Transactions Skeleton */}
        <SkeletonCard>
          <View style={styles.transactionHeader}>
            <Skeleton width={100} height={18} />
            <Skeleton width={60} height={16} />
          </View>
          {[1, 2, 3].map((item) => (
            <SkeletonListItem key={item} showAvatar showSubtitle showAction />
          ))}
        </SkeletonCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    marginBottom: 4,
  },
  title: {
    marginBottom: 0,
  },
  balanceCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    marginBottom: 8,
  },
  balanceAmount: {
    marginBottom: 0,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
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
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});
