import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../app/context/AppContext';
import { useTheme } from '../../app/context/ThemeContext';
import { Transaction } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  editTransaction?: Transaction;
}

export function AddTransactionModal({ visible, onClose, editTransaction }: AddTransactionModalProps) {
  const { colors } = useTheme();
  const { categories, addTransaction, updateTransaction } = useApp();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredCategories = categories.filter(cat => cat.type === type);

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setDescription(editTransaction.description);
      setSelectedCategory(editTransaction.category_id);
      setDate(new Date(editTransaction.date));
      setTags(editTransaction.tags?.join(', ') || '');
      setLocation(editTransaction.location || '');
    } else {
      resetForm();
    }
  }, [editTransaction, visible]);

  useEffect(() => {
    if (type && filteredCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(filteredCategories[0].id);
    }
  }, [type, filteredCategories]);

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setDate(new Date());
    setTags('');
    setLocation('');
  };

  const handleSubmit = async () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('錯誤', '請填寫所有必填欄位');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('錯誤', '請輸入有效金額');
      return;
    }

    setIsLoading(true);

    try {
      const transactionData = {
        type,
        amount: numericAmount,
        description: description.trim(),
        category_id: selectedCategory,
        date: date.toISOString(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        location: location.trim() || undefined,
      };

      if (editTransaction) {
        await updateTransaction(editTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleClose = () => {
    onClose();
    if (!editTransaction) {
      resetForm();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.cancelButton, { color: colors.textSecondary }]}>
              取消
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            {editTransaction ? '編輯交易' : '新增交易'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Transaction Type */}
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              交易類型
            </Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { borderColor: colors.border },
                  type === 'expense' && { backgroundColor: colors.expense + '20', borderColor: colors.expense }
                ]}
                onPress={() => setType('expense')}
              >
                <Text style={[
                  styles.typeButtonText,
                  { color: type === 'expense' ? colors.expense : colors.textSecondary }
                ]}>
                  支出
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { borderColor: colors.border },
                  type === 'income' && { backgroundColor: colors.income + '20', borderColor: colors.income }
                ]}
                onPress={() => setType('income')}
              >
                <Text style={[
                  styles.typeButtonText,
                  { color: type === 'income' ? colors.income : colors.textSecondary }
                ]}>
                  收入
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Amount */}
          <Card>
            <Input
              label="金額 *"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
            />
          </Card>

          {/* Description */}
          <Card>
            <Input
              label="描述 *"
              value={description}
              onChangeText={setDescription}
              placeholder="輸入交易描述"
            />
          </Card>

          {/* Category */}
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              類別 *
            </Text>
            <View style={styles.categoryGrid}>
              {filteredCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    { borderColor: colors.border },
                    selectedCategory === category.id && {
                      backgroundColor: category.color + '20',
                      borderColor: category.color,
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryName,
                    { color: selectedCategory === category.id ? category.color : colors.text }
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Date */}
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              日期
            </Text>
            <TouchableOpacity
              style={[styles.dateButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateText, { color: colors.text }]}>
                {date.toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Optional Fields */}
          <Card>
            <Input
              label="標籤"
              value={tags}
              onChangeText={setTags}
              placeholder="標籤1, 標籤2"
            />
            <Input
              label="地點"
              value={location}
              onChangeText={setLocation}
              placeholder="輸入地點"
            />
          </Card>

          <View style={styles.submitSection}>
            <Button
              title={editTransaction ? '更新' : '新增'}
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              size="large"
            />
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
  },
  submitSection: {
    marginTop: 24,
    marginBottom: 32,
  },
});
