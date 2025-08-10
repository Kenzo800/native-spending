import { Category } from '../types';

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: '餐飲',
    icon: '🍽️',
    color: '#FF6B6B',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'transport',
    name: '交通',
    icon: '🚗',
    color: '#4ECDC4',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'shopping',
    name: '購物',
    icon: '🛍️',
    color: '#45B7D1',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'entertainment',
    name: '娛樂',
    icon: '🎬',
    color: '#FFA726',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'health',
    name: '醫療',
    icon: '⚕️',
    color: '#66BB6A',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'education',
    name: '教育',
    icon: '📚',
    color: '#AB47BC',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'utilities',
    name: '水電費',
    icon: '⚡',
    color: '#FFCA28',
    type: 'expense',
    isDefault: true,
  },
  {
    id: 'other',
    name: '其他',
    icon: '📦',
    color: '#78909C',
    type: 'expense',
    isDefault: true,
  },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  {
    id: 'salary',
    name: '薪水',
    icon: '💼',
    color: '#4CAF50',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'bonus',
    name: '獎金',
    icon: '🎁',
    color: '#8BC34A',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'investment',
    name: '投資',
    icon: '📈',
    color: '#2196F3',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'freelance',
    name: '兼職',
    icon: '💻',
    color: '#FF9800',
    type: 'income',
    isDefault: true,
  },
  {
    id: 'other-income',
    name: '其他收入',
    icon: '💰',
    color: '#9C27B0',
    type: 'income',
    isDefault: true,
  },
];

export const ALL_DEFAULT_CATEGORIES = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];

export const CHART_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726', '#66BB6A',
  '#AB47BC', '#FFCA28', '#78909C', '#4CAF50', '#8BC34A',
  '#2196F3', '#FF9800', '#9C27B0', '#795548', '#607D8B'
];
