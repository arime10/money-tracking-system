export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 'nakit' | 'kart' | 'havale' | 'diger';

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name or emoji
  color: string; // Hex color or Tailwind color class
  type: TransactionType;
  isCustom?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string; // YYYY-MM-DD
  description: string;
  paymentMethod: PaymentMethod;
  createdAt: number;
}

export interface AppSettings {
  currency: string;
  theme: 'light' | 'dark' | 'system';
  targetMonthlyExpenseLimit?: number;
}

export interface FinancialMetrics {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  thisMonthIncome: number;
  thisMonthExpense: number;
  thisMonthNet: number;
  dailyAverageExpense: number; // Based on active days in the current month
  projectedMonthEndExpense: number;
  runwayDays: number; // How many days balance lasts with current burn rate
  safeDailySpendingToMonthEnd: number; // Balance / remaining days in current month
}

export type BillingCycle = 'monthly' | 'yearly';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  billingDay: number; // 1 - 31
  color: string;
  icon: string;
  categoryId: string;
  paymentMethod: PaymentMethod;
  isActive: boolean;
  notes?: string;
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  icon: string;
  color: string;
  createdAt: number;
}

export interface CategoryBudget {
  categoryId: string;
  monthlyLimit: number;
}

export interface CreditCardSettings {
  cardName: string;
  cutOffDay: number; // 1 - 31 (Hesap kesim günü)
  dueDay: number; // 1 - 31 (Son ödeme günü)
  cardLimit: number;
}

