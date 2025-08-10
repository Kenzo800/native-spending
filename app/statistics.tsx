import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


import { PieChart } from '../components/charts/PieChart';
import { StatisticsScreenSkeleton } from '../components/skeletons/StatisticsScreenSkeleton';
import { Card } from '../components/ui/Card';
import { useApp } from './context/AppContext';
import { useTheme } from './context/ThemeContext';

import { CHART_COLORS } from '../constants/DefaultData';
import {
  calculateBalance,
  calculateTotalExpense,
  calculateTotalIncome,
  formatCurrency,
  getExpensesByCategory,
  getMonthlyTrends,
} from '../utils/calculations';

const { width } = Dimensions.get('window');

type Period = '7d' | '30d' | '90d' | '1y';

export default function StatisticsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { transactions, categories, isLoading } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('30d');

  const periods = [
    { label: '7天', value: '7d' as Period },
    { label: '30天', value: '30d' as Period },
    { label: '90天', value: '90d' as Period },
    { label: '1年', value: '1y' as Period },
  ];

  const getPeriodRange = (period: Period) => {
    const end = new Date();
    const start = new Date();
    
    switch (period) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      case '1y':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }
    
    return { start, end };
  };

  const periodRange = getPeriodRange(selectedPeriod);

  const periodIncome = calculateTotalIncome(transactions, periodRange);
  const periodExpense = calculateTotalExpense(transactions, periodRange);
  const periodBalance = calculateBalance(transactions, periodRange);

  // Get expense breakdown by category
  const expensesByCategory = useMemo(() => {
    const expenses = getExpensesByCategory(transactions, periodRange);
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    
    if (total === 0) return [];

    return expenses.map((item, index) => {
      const category = categories.find(cat => cat.id === item.category);
      return {
        name: category?.name || item.category,
        value: item.amount,
        color: category?.color || CHART_COLORS[index % CHART_COLORS.length],
        percentage: (item.amount / total) * 100,
      };
    }).slice(0, 8); // Show top 8 categories
  }, [transactions, categories, periodRange]);

  // Get monthly trends
  const monthlyTrends = useMemo(() => {
    const months = selectedPeriod === '1y' ? 12 : selectedPeriod === '90d' ? 3 : 1;
    return getMonthlyTrends(transactions, months);
  }, [transactions, selectedPeriod]);

  const averageIncome = monthlyTrends.length > 0 
    ? monthlyTrends.reduce((sum, m) => sum + m.income, 0) / monthlyTrends.length 
    : 0;
  
  const averageExpense = monthlyTrends.length > 0 
    ? monthlyTrends.reduce((sum, m) => sum + m.expense, 0) / monthlyTrends.length 
    : 0;

  const PeriodButton = ({ period }: { period: { label: string; value: Period } }) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        { borderColor: colors.border },
        selectedPeriod === period.value && {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        }
      ]}
      onPress={() => setSelectedPeriod(period.value)}
    >
      <Text style={[
        styles.periodButtonText,
        {
          color: selectedPeriod === period.value ? colors.surface : colors.text
        }
      ]}>
        {period.label}
      </Text>
    </TouchableOpacity>
  );

  // 如果正在載入，顯示骨架屏
  if (isLoading) {
    return <StatisticsScreenSkeleton />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          統計分析
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            時間範圍
          </Text>
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <PeriodButton key={period.value} period={period} />
            ))}
          </View>
        </Card>

        {/* Summary Stats */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            期間總覽
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                總收入
              </Text>
              <Text style={[styles.statValue, { color: colors.income }]}>
                {formatCurrency(periodIncome)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                總支出
              </Text>
              <Text style={[styles.statValue, { color: colors.expense }]}>
                {formatCurrency(periodExpense)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                淨收益
              </Text>
              <Text style={[
                styles.statValue,
                { color: periodBalance >= 0 ? colors.income : colors.expense }
              ]}>
                {formatCurrency(periodBalance)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                儲蓄率
              </Text>
              <Text style={[
                styles.statValue,
                { color: periodBalance >= 0 ? colors.income : colors.expense }
              ]}>
                {periodIncome > 0 
                  ? `${((periodBalance / periodIncome) * 100).toFixed(1)}%`
                  : '0%'
                }
              </Text>
            </View>
          </View>
        </Card>

        {/* Average Stats */}
        {monthlyTrends.length > 1 && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              平均數據
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  月平均收入
                </Text>
                <Text style={[styles.statValue, { color: colors.income }]}>
                  {formatCurrency(averageIncome)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  月平均支出
                </Text>
                <Text style={[styles.statValue, { color: colors.expense }]}>
                  {formatCurrency(averageExpense)}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Expense Breakdown */}
        {expensesByCategory.length > 0 && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              支出分析
            </Text>
            <PieChart
              data={expensesByCategory}
              size={width * 0.7}
              centerText={formatCurrency(periodExpense)}
              centerSubtext="總支出"
            />
          </Card>
        )}

        {/* Category Details */}
        {expensesByCategory.length > 0 && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              類別詳情
            </Text>
            <View style={styles.categoryList}>
              {expensesByCategory.map((item, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryLeft}>
                    <View
                      style={[
                        styles.categoryColor,
                        { backgroundColor: item.color }
                      ]}
                    />
                    <Text style={[styles.categoryName, { color: colors.text }]}>
                      {item.name}
                    </Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={[styles.categoryAmount, { color: colors.text }]}>
                      {formatCurrency(item.value)}
                    </Text>
                    <Text style={[styles.categoryPercentage, { color: colors.textSecondary }]}>
                      {item.percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Monthly Trends */}
        {monthlyTrends.length > 1 && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              月度趨勢
            </Text>
            <View style={styles.trendsList}>
              {monthlyTrends.map((trend, index) => (
                <View key={index} style={styles.trendItem}>
                  <Text style={[styles.trendMonth, { color: colors.text }]}>
                    {new Date(trend.month).toLocaleDateString('zh-TW', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                  <View style={styles.trendValues}>
                    <Text style={[styles.trendIncome, { color: colors.income }]}>
                      +{formatCurrency(trend.income)}
                    </Text>
                    <Text style={[styles.trendExpense, { color: colors.expense }]}>
                      -{formatCurrency(trend.expense)}
                    </Text>
                    <Text style={[
                      styles.trendBalance,
                      { color: trend.balance >= 0 ? colors.income : colors.expense }
                    ]}>
                      {trend.balance >= 0 ? '+' : ''}{formatCurrency(trend.balance)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}

        <View style={styles.bottomSpacing} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    flex: 1,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryPercentage: {
    fontSize: 12,
    marginTop: 2,
  },
  trendsList: {
    gap: 12,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendMonth: {
    fontSize: 14,
    fontWeight: '500',
    width: 80,
  },
  trendValues: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  trendIncome: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  trendExpense: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  trendBalance: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  bottomSpacing: {
    height: 20,
  },
});
