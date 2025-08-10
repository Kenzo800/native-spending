export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category_id: string; // 更新為與數據庫一致
  type: 'income' | 'expense';
  date: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  location?: string;
  recurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  budget?: number;
  isDefault: boolean;
}

export interface Budget {
  id: string;
  category_id: string; // 更新為與數據庫一致
  amount: number;
  period: 'monthly' | 'weekly' | 'daily'; // 更新選項
  start_date: string; // 更新為與數據庫一致
  end_date: string; // 更新為與數據庫一致
  created_at: string; // 新增數據庫字段
  updated_at: string; // 新增數據庫字段
}

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  income: string;
  expense: string;
  shadow: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface StatsPeriod {
  label: string;
  value: '7d' | '30d' | '90d' | '1y';
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
  }[];
}
