import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


import { TransactionsScreenSkeleton } from '../components/skeletons/TransactionsScreenSkeleton';
import { AddTransactionModal } from '../components/transaction/AddTransactionModal';
import { TransactionItem } from '../components/transaction/TransactionItem';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useApp } from './context/AppContext';
import { useTheme } from './context/ThemeContext';

import { Transaction } from '../types';
import { formatCurrency } from '../utils/calculations';

type FilterType = 'all' | 'income' | 'expense';
type SortType = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export default function TransactionsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { transactions, categories, deleteTransaction, refreshData, isLoading } = useApp();

  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date_desc');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }

    // Apply sort
    filtered = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, filter, sort]);

  const totalAmount = useMemo(() => {
    return filteredAndSortedTransactions.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);
  }, [filteredAndSortedTransactions]);

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

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const category = categories.find(cat => cat.id === item.category_id);
    return (
      <TransactionItem
        transaction={item}
        category={category}
        onPress={() => handleTransactionPress(item)}
        onLongPress={() => handleDeleteTransaction(item.id)}
      />
    );
  };

  const FilterButton = ({ type, label }: { type: FilterType; label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { borderColor: colors.border },
        filter === type && { backgroundColor: colors.primary, borderColor: colors.primary }
      ]}
      onPress={() => setFilter(type)}
    >
      <Text style={[
        styles.filterButtonText,
        { color: filter === type ? colors.surface : colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SortOption = ({ type, label }: { type: SortType; label: string }) => (
    <TouchableOpacity
      style={[
        styles.sortOption,
        sort === type && { backgroundColor: colors.primary + '20' }
      ]}
      onPress={() => setSort(type)}
    >
      <Text style={[
        styles.sortOptionText,
        { color: sort === type ? colors.primary : colors.text }
      ]}>
        {label}
      </Text>
      {sort === type && (
        <Ionicons name="checkmark" size={16} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  // 如果正在載入，顯示骨架屏
  if (isLoading) {
    return <TransactionsScreenSkeleton />;
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
          交易記錄
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryContent}>
          <View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              總計 ({filteredAndSortedTransactions.length} 筆)
            </Text>
            <Text style={[
              styles.summaryAmount,
              { color: totalAmount >= 0 ? colors.income : colors.expense }
            ]}>
              {totalAmount >= 0 ? '+' : ''}{formatCurrency(totalAmount)}
            </Text>
          </View>
          <TouchableOpacity style={styles.sortButton}>
            <Ionicons name="filter-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Filters */}
      <View style={styles.filters}>
        <FilterButton type="all" label="全部" />
        <FilterButton type="income" label="收入" />
        <FilterButton type="expense" label="支出" />
      </View>

      {/* Sort Options */}
      <View style={styles.sortSection}>
        <Text style={[styles.sortTitle, { color: colors.text }]}>排序方式</Text>
        <View style={styles.sortOptions}>
          <SortOption type="date_desc" label="日期 (新到舊)" />
          <SortOption type="date_asc" label="日期 (舊到新)" />
          <SortOption type="amount_desc" label="金額 (高到低)" />
          <SortOption type="amount_asc" label="金額 (低到高)" />
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredAndSortedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons 
              name="receipt-outline" 
              size={64} 
              color={colors.textSecondary} 
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {filter === 'all' ? '還沒有任何交易記錄' : 
               filter === 'income' ? '還沒有收入記錄' : '還沒有支出記錄'}
            </Text>
            <Button
              title="新增交易"
              onPress={() => setShowAddModal(true)}
              style={styles.emptyButton}
            />
          </View>
        }
      />

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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sortButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
  },
  sortOptionText: {
    fontSize: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    marginTop: 8,
  },
});
