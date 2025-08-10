import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


import { PieChart } from '../components/charts/PieChart';
import { HomeScreenSkeleton } from '../components/skeletons/HomeScreenSkeleton';
import { AddTransactionModal } from '../components/transaction/AddTransactionModal';
import { TransactionItem } from '../components/transaction/TransactionItem';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Transaction } from '../types';
import { useApp } from './context/AppContext';
import { useTheme } from './context/ThemeContext';

import { CHART_COLORS } from '../constants/DefaultData';
import {
  calculateBalance,
  calculateTotalExpense,
  calculateTotalIncome,
  formatCurrency,
  getExpensesByCategory
} from '../utils/calculations';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { 
    transactions, 
    categories, 
    isLoading, 
    refreshData, 
    deleteTransaction 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);

  // Calculate current month data
  const currentMonth = new Date();
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const monthPeriod = { start: startOfMonth, end: endOfMonth };

  const monthlyIncome = calculateTotalIncome(transactions, monthPeriod);
  const monthlyExpense = calculateTotalExpense(transactions, monthPeriod);
  const monthlyBalance = calculateBalance(transactions, monthPeriod);

  const totalBalance = calculateBalance(transactions);

  // Get recent transactions
  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  }, [transactions]);

  // Get expense chart data
  const expenseChartData = useMemo(() => {
    const expensesByCategory = getExpensesByCategory(transactions, monthPeriod);
    const total = expensesByCategory.reduce((sum, item) => sum + item.amount, 0);
    
    if (total === 0) return [];

    return expensesByCategory.map((item, index) => {
      const category = categories.find(cat => cat.id === item.category);
      return {
        name: category?.name || item.category,
        value: item.amount,
        color: category?.color || CHART_COLORS[index % CHART_COLORS.length],
        percentage: (item.amount / total) * 100,
      };
    }).slice(0, 6); // Show top 6 categories
  }, [transactions, categories, monthPeriod]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowAddModal(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    Alert.alert(
      '確認刪除',
      '確定要刪除這筆交易嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '刪除',
          style: 'destructive',
          onPress: () => deleteTransaction(transactionId),
        },
      ]
    );
  };

  const closeModal = () => {
    setShowAddModal(false);
    setSelectedTransaction(undefined);
  };

  // 如果正在載入，顯示骨架屏
  if (isLoading) {
    return <HomeScreenSkeleton />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
      <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              您好！
            </Text>
        <Text style={[styles.title, { color: colors.text }]}>
              財務概覽
        </Text>
          </View>
      </View>

        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
            總餘額
        </Text>
          <Text style={[
            styles.balanceAmount, 
            { color: totalBalance >= 0 ? colors.income : colors.expense }
          ]}>
            {formatCurrency(totalBalance)}
          </Text>
          
          <View style={styles.monthlyStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                本月收入
              </Text>
              <Text style={[styles.statAmount, { color: colors.income }]}>
                +{formatCurrency(monthlyIncome)}
              </Text>
              </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                本月支出
              </Text>
              <Text style={[styles.statAmount, { color: colors.expense }]}>
                -{formatCurrency(monthlyExpense)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            title="新增收入"
            onPress={() => setShowAddModal(true)}
            variant="outline"
            style={[styles.quickActionButton, { borderColor: colors.income }] as any}
            textStyle={{ color: colors.income }}
          />
          <Button
            title="新增支出"
            onPress={() => setShowAddModal(true)}
            style={[styles.quickActionButton, { backgroundColor: colors.expense }] as any}
          />
        </View>

        {/* Expense Chart */}
        {expenseChartData.length > 0 && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              本月支出分析
            </Text>
            <PieChart
              data={expenseChartData}
              centerText={formatCurrency(monthlyExpense)}
              centerSubtext="總支出"
            />
          </Card>
        )}

        {/* Recent Transactions */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              最近交易
            </Text>
            <TouchableOpacity onPress={() => router.push('/transactions')}>
              <Text style={[styles.seeAllButton, { color: colors.primary }]}>
                查看全部
              </Text>
        </TouchableOpacity>
      </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons 
                name="receipt-outline" 
                size={48} 
                color={colors.textSecondary} 
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                還沒有任何交易記錄
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                點擊上方按鈕新增您的第一筆交易
          </Text>
        </View>
          ) : (
            <View style={styles.transactionsList}>
              {recentTransactions.map((transaction) => {
                const category = categories.find(cat => cat.id === transaction.category_id);
                return (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
                    category={category}
                    onPress={() => handleTransactionPress(transaction)}
                    onLongPress={() => handleDeleteTransaction(transaction.id)}
                  />
                );
              })}
            </View>
          )}
        </Card>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color={colors.surface} />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        visible={showAddModal}
        onClose={closeModal}
        editTransaction={selectedTransaction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    margin: 16,
    alignItems: 'center',
    paddingVertical: 24,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  monthlyStats: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  quickActionButton: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  transactionsList: {
    gap: 1,
  },
  bottomSpacing: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});