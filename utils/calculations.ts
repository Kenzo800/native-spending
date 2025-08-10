import { Category, Transaction } from '../types';

export const calculateTotalIncome = (transactions: Transaction[], period?: { start: Date; end: Date }): number => {
  return transactions
    .filter(t => {
      const isIncome = t.type === 'income';
      if (!period) return isIncome;
      
      const transactionDate = new Date(t.date);
      return isIncome && transactionDate >= period.start && transactionDate <= period.end;
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalExpense = (transactions: Transaction[], period?: { start: Date; end: Date }): number => {
  return transactions
    .filter(t => {
      const isExpense = t.type === 'expense';
      if (!period) return isExpense;
      
      const transactionDate = new Date(t.date);
      return isExpense && transactionDate >= period.start && transactionDate <= period.end;
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateBalance = (transactions: Transaction[], period?: { start: Date; end: Date }): number => {
  const income = calculateTotalIncome(transactions, period);
  const expense = calculateTotalExpense(transactions, period);
  return income - expense;
};

export const getCategoryExpenses = (transactions: Transaction[], categories: Category[], period?: { start: Date; end: Date }) => {
  const categoryMap = categories.reduce((map, cat) => {
    map[cat.id] = { ...cat, amount: 0 };
    return map;
  }, {} as Record<string, Category & { amount: number }>);

  transactions
    .filter(t => {
      const isExpense = t.type === 'expense';
      if (!period) return isExpense;
      
      const transactionDate = new Date(t.date);
      return isExpense && transactionDate >= period.start && transactionDate <= period.end;
    })
    .forEach(t => {
      if (categoryMap[t.category_id]) {
        categoryMap[t.category_id].amount += t.amount;
      }
    });

  return Object.values(categoryMap).filter(cat => cat.amount > 0);
};

export const getExpensesByCategory = (transactions: Transaction[], period?: { start: Date; end: Date }) => {
  const expenses = transactions.filter(t => {
    const isExpense = t.type === 'expense';
    if (!period) return isExpense;
    
    const transactionDate = new Date(t.date);
    return isExpense && transactionDate >= period.start && transactionDate <= period.end;
  });

  const categoryTotals = expenses.reduce((acc, transaction) => {
    const category = transaction.category_id;
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const getMonthlyTrends = (transactions: Transaction[], months: number = 12) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - months);

  const monthlyData: Record<string, { income: number; expense: number }> = {};

  transactions
    .filter(t => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    })
    .forEach(t => {
      const monthKey = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM format
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }
      
      if (t.type === 'income') {
        monthlyData[monthKey].income += t.amount;
      } else {
        monthlyData[monthKey].expense += t.amount;
      }
    });

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const getDailySpending = (transactions: Transaction[], days: number = 30) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const dailyData: Record<string, number> = {};

  transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && date >= startDate && date <= endDate;
    })
    .forEach(t => {
      const dayKey = new Date(t.date).toISOString().slice(0, 10); // YYYY-MM-DD format
      dailyData[dayKey] = (dailyData[dayKey] || 0) + t.amount;
    });

  return Object.entries(dailyData)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getSpendingPrediction = (transactions: Transaction[], period: 'weekly' | 'monthly' = 'monthly') => {
  const now = new Date();
  const periodStart = new Date();
  
  if (period === 'weekly') {
    periodStart.setDate(now.getDate() - now.getDay()); // Start of current week
  } else {
    periodStart.setDate(1); // Start of current month
  }
  
  const currentSpending = calculateTotalExpense(transactions, { start: periodStart, end: now });
  
  // Calculate days passed and total days in period
  const daysPassed = Math.floor((now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  let totalDays: number;
  if (period === 'weekly') {
    totalDays = 7;
  } else {
    totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }
  
  // Predict total spending based on current rate
  const averageDaily = currentSpending / daysPassed;
  const predictedTotal = averageDaily * totalDays;
  
  return {
    currentSpending,
    predictedTotal,
    averageDaily,
    daysRemaining: totalDays - daysPassed,
    progressPercentage: (daysPassed / totalDays) * 100,
  };
};

export const formatCurrency = (amount: number, currency: string = 'HKD'): string => {
  return new Intl.NumberFormat('zh-HK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('zh-HK').format(amount);
};
