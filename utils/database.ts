import * as SQLite from 'expo-sqlite';
import { Budget, Category, Transaction } from '../types';

// 打開數據庫
const db = SQLite.openDatabaseSync('spending.db');

// 數據庫初始化
export const initializeDatabase = () => {
  try {
    console.log('Initializing database...');

    // 創建 transactions 表
    db.execSync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        category_id TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT,
        tags TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // 創建 categories 表
    db.execSync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        is_default INTEGER NOT NULL DEFAULT 0
      );
    `);

    // 創建 budgets 表
    db.execSync(`
      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL,
        amount REAL NOT NULL,
        period TEXT NOT NULL CHECK (period IN ('monthly', 'weekly', 'daily')),
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // 創建 user_preferences 表
    db.execSync(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // 創建索引以提高查詢性能
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
      CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category_id);
      CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(start_date, end_date);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw new Error('數據庫初始化失敗');
  }
};

// 交易相關操作
export const saveTransaction = async (transaction: Transaction): Promise<void> => {
  try {
    const statement = db.prepareSync(`
      INSERT OR REPLACE INTO transactions 
      (id, type, amount, description, category_id, date, location, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    statement.executeSync([
      transaction.id,
      transaction.type,
      transaction.amount,
      transaction.description,
      transaction.category_id,
      transaction.date,
      transaction.location || null,
      transaction.tags ? JSON.stringify(transaction.tags) : null,
      transaction.created_at,
      transaction.updated_at
    ]);
    
    statement.finalizeSync();
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw new Error('無法儲存交易記錄');
  }
};

export const loadTransactions = (): Transaction[] => {
  try {
    const result = db.getAllSync(`
      SELECT * FROM transactions 
      ORDER BY date DESC, created_at DESC
    `);
    
    return result.map((row: any) => ({
      id: row.id,
      type: row.type,
      amount: row.amount,
      description: row.description,
      category_id: row.category_id,
      date: row.date,
      location: row.location,
      tags: row.tags ? JSON.parse(row.tags) : undefined,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  } catch (error) {
    console.error('Error loading transactions:', error);
    throw new Error('無法載入交易記錄');
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const statement = db.prepareSync('DELETE FROM transactions WHERE id = ?');
    statement.executeSync([id]);
    statement.finalizeSync();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('無法刪除交易記錄');
  }
};

export const updateTransaction = async (id: string, transaction: Partial<Transaction>): Promise<void> => {
  try {
    const fields = [];
    const values = [];
    
    if (transaction.type !== undefined) {
      fields.push('type = ?');
      values.push(transaction.type);
    }
    if (transaction.amount !== undefined) {
      fields.push('amount = ?');
      values.push(transaction.amount);
    }
    if (transaction.description !== undefined) {
      fields.push('description = ?');
      values.push(transaction.description);
    }
    if (transaction.category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(transaction.category_id);
    }
    if (transaction.date !== undefined) {
      fields.push('date = ?');
      values.push(transaction.date);
    }
    if (transaction.location !== undefined) {
      fields.push('location = ?');
      values.push(transaction.location);
    }
    if (transaction.tags !== undefined) {
      fields.push('tags = ?');
      values.push(transaction.tags ? JSON.stringify(transaction.tags) : null);
    }
    
    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    
    const statement = db.prepareSync(`
      UPDATE transactions 
      SET ${fields.join(', ')} 
      WHERE id = ?
    `);
    
    statement.executeSync(values);
    statement.finalizeSync();
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error('無法更新交易記錄');
  }
};

// 分類相關操作
export const saveCategory = async (category: Category): Promise<void> => {
  try {
    const statement = db.prepareSync(`
      INSERT OR REPLACE INTO categories 
      (id, name, icon, color, type, is_default)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    statement.executeSync([
      category.id,
      category.name,
      category.icon,
      category.color,
      category.type,
      category.isDefault ? 1 : 0
    ]);
    
    statement.finalizeSync();
  } catch (error) {
    console.error('Error saving category:', error);
    throw new Error('無法儲存類別');
  }
};

export const loadCategories = (): Category[] => {
  try {
    const result = db.getAllSync('SELECT * FROM categories ORDER BY name');
    
    return result.map((row: any) => ({
      id: row.id,
      name: row.name,
      icon: row.icon,
      color: row.color,
      type: row.type,
      isDefault: Boolean(row.is_default)
    }));
  } catch (error) {
    console.error('Error loading categories:', error);
    throw new Error('無法載入類別');
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const statement = db.prepareSync('DELETE FROM categories WHERE id = ?');
    statement.executeSync([id]);
    statement.finalizeSync();
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('無法刪除類別');
  }
};

// 預算相關操作
export const saveBudget = async (budget: Budget): Promise<void> => {
  try {
    const statement = db.prepareSync(`
      INSERT OR REPLACE INTO budgets 
      (id, category_id, amount, period, start_date, end_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    statement.executeSync([
      budget.id,
      budget.category_id,
      budget.amount,
      budget.period,
      budget.start_date,
      budget.end_date,
      budget.created_at,
      budget.updated_at
    ]);
    
    statement.finalizeSync();
  } catch (error) {
    console.error('Error saving budget:', error);
    throw new Error('無法儲存預算');
  }
};

export const loadBudgets = (): Budget[] => {
  try {
    const result = db.getAllSync('SELECT * FROM budgets ORDER BY start_date DESC');
    
    return result.map((row: any) => ({
      id: row.id,
      category_id: row.category_id,
      amount: row.amount,
      period: row.period,
      start_date: row.start_date,
      end_date: row.end_date,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  } catch (error) {
    console.error('Error loading budgets:', error);
    throw new Error('無法載入預算');
  }
};

export const deleteBudget = async (id: string): Promise<void> => {
  try {
    const statement = db.prepareSync('DELETE FROM budgets WHERE id = ?');
    statement.executeSync([id]);
    statement.finalizeSync();
  } catch (error) {
    console.error('Error deleting budget:', error);
    throw new Error('無法刪除預算');
  }
};

// 用戶偏好設置
export const saveUserPreference = async (key: string, value: any): Promise<void> => {
  try {
    const statement = db.prepareSync(`
      INSERT OR REPLACE INTO user_preferences 
      (key, value, updated_at)
      VALUES (?, ?, ?)
    `);
    
    statement.executeSync([
      key,
      JSON.stringify(value),
      new Date().toISOString()
    ]);
    
    statement.finalizeSync();
  } catch (error) {
    console.error('Error saving user preference:', error);
    throw new Error('無法儲存用戶設定');
  }
};

export const loadUserPreferences = (): Record<string, any> => {
  try {
    const result = db.getAllSync('SELECT * FROM user_preferences');
    const preferences: Record<string, any> = {};
    
    result.forEach((row: any) => {
      try {
        preferences[row.key] = JSON.parse(row.value);
      } catch {
        preferences[row.key] = row.value;
      }
    });
    
    return preferences;
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return {};
  }
};

// 工具函數
export const clearAllData = async (): Promise<void> => {
  try {
    db.execSync('DELETE FROM transactions');
    db.execSync('DELETE FROM categories WHERE is_default = 0'); // 保留默認分類
    db.execSync('DELETE FROM budgets');
    db.execSync('DELETE FROM user_preferences');
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw new Error('無法清除所有資料');
  }
};

export const exportData = (): string => {
  try {
    const transactions = loadTransactions();
    const categories = loadCategories();
    const budgets = loadBudgets();
    const preferences = loadUserPreferences();

    const exportData = {
      transactions,
      categories,
      budgets,
      preferences,
      exportDate: new Date().toISOString(),
      version: '2.0', // SQLite version
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('無法匯出資料');
  }
};

export const importData = async (dataString: string): Promise<void> => {
  try {
    const data = JSON.parse(dataString);
    
    // 導入交易
    if (data.transactions && Array.isArray(data.transactions)) {
      for (const transaction of data.transactions) {
        await saveTransaction(transaction);
      }
    }
    
    // 導入分類（跳過默認分類）
    if (data.categories && Array.isArray(data.categories)) {
      for (const category of data.categories) {
        if (!category.isDefault) {
          await saveCategory(category);
        }
      }
    }
    
    // 導入預算
    if (data.budgets && Array.isArray(data.budgets)) {
      for (const budget of data.budgets) {
        await saveBudget(budget);
      }
    }
    
    // 導入用戶偏好
    if (data.preferences && typeof data.preferences === 'object') {
      for (const [key, value] of Object.entries(data.preferences)) {
        await saveUserPreference(key, value);
      }
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('無法匯入資料，請檢查檔案格式');
  }
};

// 高級查詢功能
export const getTransactionsByDateRange = (startDate: string, endDate: string): Transaction[] => {
  try {
    const result = db.getAllSync(`
      SELECT * FROM transactions 
      WHERE date >= ? AND date <= ?
      ORDER BY date DESC, created_at DESC
    `, [startDate, endDate]);
    
    return result.map((row: any) => ({
      id: row.id,
      type: row.type,
      amount: row.amount,
      description: row.description,
      category_id: row.category_id,
      date: row.date,
      location: row.location,
      tags: row.tags ? JSON.parse(row.tags) : undefined,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  } catch (error) {
    console.error('Error getting transactions by date range:', error);
    return [];
  }
};

export const getTransactionsByCategory = (categoryId: string): Transaction[] => {
  try {
    const result = db.getAllSync(`
      SELECT * FROM transactions 
      WHERE category_id = ?
      ORDER BY date DESC, created_at DESC
    `, [categoryId]);
    
    return result.map((row: any) => ({
      id: row.id,
      type: row.type,
      amount: row.amount,
      description: row.description,
      category_id: row.category_id,
      date: row.date,
      location: row.location,
      tags: row.tags ? JSON.parse(row.tags) : undefined,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  } catch (error) {
    console.error('Error getting transactions by category:', error);
    return [];
  }
};

export const getTransactionStats = (): { totalIncome: number; totalExpense: number; transactionCount: number } => {
  try {
    const result = db.getFirstSync(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense,
        COUNT(*) as transactionCount
      FROM transactions
    `) as any;
    
    return {
      totalIncome: result?.totalIncome || 0,
      totalExpense: result?.totalExpense || 0,
      transactionCount: result?.transactionCount || 0
    };
  } catch (error) {
    console.error('Error getting transaction stats:', error);
    return { totalIncome: 0, totalExpense: 0, transactionCount: 0 };
  }
};
