// 使用 SQLite 替代 AsyncStorage
import { Budget, Category, Transaction } from '../types';
import {
  clearAllData as dbClearAllData,
  deleteBudget as dbDeleteBudget,
  deleteCategory as dbDeleteCategory,
  deleteTransaction as dbDeleteTransaction,
  exportData as dbExportData,
  importData as dbImportData,
  loadBudgets as dbLoadBudgets,
  loadCategories as dbLoadCategories,
  loadTransactions as dbLoadTransactions,
  loadUserPreferences as dbLoadUserPreferences,
  saveBudget as dbSaveBudget,
  saveCategory as dbSaveCategory,
  saveTransaction as dbSaveTransaction,
  updateTransaction as dbUpdateTransaction,
  initializeDatabase,
  saveUserPreference,
} from './database';

// 確保數據庫已初始化
let isInitialized = false;
const ensureInitialized = () => {
  if (!isInitialized) {
    initializeDatabase();
    isInitialized = true;
  }
};

// Transaction Storage - 新的 SQLite 實現
export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    ensureInitialized();
    // 批量保存交易
    for (const transaction of transactions) {
      await dbSaveTransaction(transaction);
    }
  } catch (error) {
    console.error('Error saving transactions:', error);
    throw new Error('無法儲存交易記錄');
  }
};

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    ensureInitialized();
    return dbLoadTransactions();
  } catch (error) {
    console.error('Error loading transactions:', error);
    throw new Error('無法載入交易記錄');
  }
};

// 新增的單個交易操作函數
export const saveTransaction = async (transaction: Transaction): Promise<void> => {
  try {
    ensureInitialized();
    await dbSaveTransaction(transaction);
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw new Error('無法儲存交易記錄');
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    ensureInitialized();
    await dbDeleteTransaction(id);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('無法刪除交易記錄');
  }
};

export const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<void> => {
  try {
    ensureInitialized();
    await dbUpdateTransaction(id, updates);
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error('無法更新交易記錄');
  }
};

// Category Storage - 新的 SQLite 實現
export const saveCategories = async (categories: Category[]): Promise<void> => {
  try {
    ensureInitialized();
    // 批量保存分類
    for (const category of categories) {
      await dbSaveCategory(category);
    }
  } catch (error) {
    console.error('Error saving categories:', error);
    throw new Error('無法儲存類別設定');
  }
};

export const loadCategories = async (): Promise<Category[]> => {
  try {
    ensureInitialized();
    return dbLoadCategories();
  } catch (error) {
    console.error('Error loading categories:', error);
    throw new Error('無法載入類別設定');
  }
};

// 新增的單個分類操作函數
export const saveCategory = async (category: Category): Promise<void> => {
  try {
    ensureInitialized();
    await dbSaveCategory(category);
  } catch (error) {
    console.error('Error saving category:', error);
    throw new Error('無法儲存類別');
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    ensureInitialized();
    await dbDeleteCategory(id);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('無法刪除類別');
  }
};

// Budget Storage - 新的 SQLite 實現
export const saveBudgets = async (budgets: Budget[]): Promise<void> => {
  try {
    ensureInitialized();
    // 批量保存預算
    for (const budget of budgets) {
      await dbSaveBudget(budget);
    }
  } catch (error) {
    console.error('Error saving budgets:', error);
    throw new Error('無法儲存預算設定');
  }
};

export const loadBudgets = async (): Promise<Budget[]> => {
  try {
    ensureInitialized();
    return dbLoadBudgets();
  } catch (error) {
    console.error('Error loading budgets:', error);
    throw new Error('無法載入預算設定');
  }
};

// 新增的單個預算操作函數
export const saveBudget = async (budget: Budget): Promise<void> => {
  try {
    ensureInitialized();
    await dbSaveBudget(budget);
  } catch (error) {
    console.error('Error saving budget:', error);
    throw new Error('無法儲存預算');
  }
};

export const deleteBudget = async (id: string): Promise<void> => {
  try {
    ensureInitialized();
    await dbDeleteBudget(id);
  } catch (error) {
    console.error('Error deleting budget:', error);
    throw new Error('無法刪除預算');
  }
};

// User Preferences Storage - 新的 SQLite 實現
export const saveUserPreferences = async (preferences: Record<string, any>): Promise<void> => {
  try {
    ensureInitialized();
    // 保存每個偏好設置
    for (const [key, value] of Object.entries(preferences)) {
      await saveUserPreference(key, value);
    }
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw new Error('無法儲存使用者設定');
  }
};

export const loadUserPreferences = async (): Promise<Record<string, any>> => {
  try {
    ensureInitialized();
    return dbLoadUserPreferences();
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return {};
  }
};

// Utility functions - 新的 SQLite 實現
export const clearAllData = async (): Promise<void> => {
  try {
    ensureInitialized();
    await dbClearAllData();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw new Error('無法清除所有資料');
  }
};

export const exportData = async (): Promise<string> => {
  try {
    ensureInitialized();
    return dbExportData();
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('無法匯出資料');
  }
};

export const importData = async (dataString: string): Promise<void> => {
  try {
    ensureInitialized();
    await dbImportData(dataString);
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('無法匯入資料，請檢查檔案格式');
  }
};

// 新增的高級查詢功能
export {
  getTransactionsByCategory, getTransactionsByDateRange, getTransactionStats
} from './database';

