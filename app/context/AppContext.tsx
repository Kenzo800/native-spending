import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ALL_DEFAULT_CATEGORIES } from '../../constants/DefaultData';
import { Budget, Category, Transaction } from '../../types';
import {
  deleteBudget as deleteBudgetFromDB,
  deleteCategory as deleteCategoryFromDB,
  deleteTransaction as deleteTransactionFromDB,
  loadBudgets,
  loadCategories,
  loadTransactions,
  saveBudget,
  saveCategories,
  saveCategory,
  saveTransaction,
  updateTransaction as updateTransactionInDB
} from '../../utils/storage';

interface AppContextType {
  // Data
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  
  // Loading states
  isLoading: boolean;
  
  // Transaction operations
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Category operations
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Budget operations
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  
  // Utility
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadTransactionsData(),
        loadCategoriesData(),
        loadBudgetsData(),
      ]);
    } catch (error) {
      console.error('Error initializing data:', error);
      Alert.alert('錯誤', '無法載入應用資料');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactionsData = async () => {
    try {
      const data = await loadTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadCategoriesData = async () => {
    try {
      const data = await loadCategories();
      if (data.length === 0) {
        // Initialize with default categories
        await saveCategories(ALL_DEFAULT_CATEGORIES);
        setCategories(ALL_DEFAULT_CATEGORIES);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback: save default categories if there's an error
      try {
        await saveCategories(ALL_DEFAULT_CATEGORIES);
        setCategories(ALL_DEFAULT_CATEGORIES);
      } catch (saveError) {
        console.error('Error saving default categories:', saveError);
        setCategories(ALL_DEFAULT_CATEGORIES);
      }
    }
  };

  const loadBudgetsData = async () => {
    try {
      const data = await loadBudgets();
      setBudgets(data);
    } catch (error) {
      console.error('Error loading budgets:', error);
    }
  };

  // Transaction operations - 使用 SQLite
  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const now = new Date().toISOString();
      const newTransaction: Transaction = {
        ...transactionData,
        id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: now,
        updated_at: now,
      };

      await saveTransaction(newTransaction);
      setTransactions([...transactions, newTransaction]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('錯誤', '無法新增交易記錄');
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const updatedData = { ...updates, updated_at: new Date().toISOString() };
      await updateTransactionInDB(id, updatedData);
      
      const updatedTransactions = transactions.map(transaction =>
        transaction.id === id
          ? { ...transaction, ...updatedData }
          : transaction
      );
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert('錯誤', '無法更新交易記錄');
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteTransactionFromDB(id);
      const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('錯誤', '無法刪除交易記錄');
      throw error;
    }
  };

  // Category operations - 使用 SQLite
  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const newCategory: Category = {
        ...categoryData,
        id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      await saveCategory(newCategory);
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('錯誤', '無法新增類別');
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const updatedCategory = { ...categories.find(c => c.id === id), ...updates };
      await saveCategory(updatedCategory as Category);
      
      const updatedCategories = categories.map(category =>
        category.id === id ? { ...category, ...updates } : category
      );
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error updating category:', error);
      Alert.alert('錯誤', '無法更新類別');
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      // Check if category is being used
      const isUsed = transactions.some(transaction => transaction.category_id === id);
      if (isUsed) {
        Alert.alert('無法刪除', '此類別正在使用中，無法刪除');
        return;
      }

      await deleteCategoryFromDB(id);
      const updatedCategories = categories.filter(category => category.id !== id);
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.alert('錯誤', '無法刪除類別');
      throw error;
    }
  };

  // Budget operations - 使用 SQLite
  const addBudget = async (budgetData: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const now = new Date().toISOString();
      const newBudget: Budget = {
        ...budgetData,
        id: `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: now,
        updated_at: now,
      };

      await saveBudget(newBudget);
      setBudgets([...budgets, newBudget]);
    } catch (error) {
      console.error('Error adding budget:', error);
      Alert.alert('錯誤', '無法新增預算');
      throw error;
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const updatedBudget = { ...budgets.find(b => b.id === id), ...updates, updated_at: new Date().toISOString() };
      await saveBudget(updatedBudget as Budget);
      
      const updatedBudgets = budgets.map(budget =>
        budget.id === id ? { ...budget, ...updates, updated_at: new Date().toISOString() } : budget
      );
      setBudgets(updatedBudgets);
    } catch (error) {
      console.error('Error updating budget:', error);
      Alert.alert('錯誤', '無法更新預算');
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await deleteBudgetFromDB(id);
      const updatedBudgets = budgets.filter(budget => budget.id !== id);
      setBudgets(updatedBudgets);
    } catch (error) {
      console.error('Error deleting budget:', error);
      Alert.alert('錯誤', '無法刪除預算');
      throw error;
    }
  };

  const refreshData = async () => {
    await initializeData();
  };

  const value: AppContextType = {
    transactions,
    categories,
    budgets,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    refreshData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
