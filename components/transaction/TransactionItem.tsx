import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';
import { Category, Transaction } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function TransactionItem({ 
  transaction, 
  category, 
  onPress, 
  onLongPress 
}: TransactionItemProps) {
  const { colors } = useTheme();

  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const sign = isIncome ? '+' : '-';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        {category && (
          <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
            <Text style={styles.categoryEmoji}>{category.icon}</Text>
          </View>
        )}
        <View style={styles.details}>
          <Text style={[styles.description, { color: colors.text }]} numberOfLines={1}>
            {transaction.description}
          </Text>
          <View style={styles.metadata}>
            <Text style={[styles.category, { color: colors.textSecondary }]}>
              {category?.name || transaction.category_id}
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {new Date(transaction.date).toLocaleDateString('zh-TW', {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {sign}{formatCurrency(transaction.amount)}
        </Text>
        {transaction.tags && transaction.tags.length > 0 && (
          <View style={styles.tags}>
            {transaction.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 12,
    flex: 1,
  },
  date: {
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tags: {
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
  },
});
