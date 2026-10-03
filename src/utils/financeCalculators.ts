import { Transaction, FinancialMetrics } from '../types';

/**
 * Türk Lirası / Döviz formatlayıcı
 */
export function formatMoney(amount: number, currency: string = '₺'): string {
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formatted} ${currency}`;
}

/**
 * Tarihi Türkçe okunabilir formatta göster
 */
export function formatDateTR(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (dateString === todayStr) {
    return 'Bugün';
  } else if (dateString === yesterdayStr) {
    return 'Dün';
  }

  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'short',
  });
}

/**
 * Belirli bir ay ve yıla ait gün sayısı
 */
export function getDaysInMonth(year: number, monthZeroIndexed: number): number {
  return new Date(year, monthZeroIndexed + 1, 0).getDate();
}

/**
 * Finansal metrikleri hesapla
 */
export function calculateMetrics(
  transactions: Transaction[],
  referenceDate: Date = new Date()
): FinancialMetrics {
  let totalIncome = 0;
  let totalExpense = 0;

  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth(); // 0-indexed
  const currentDay = referenceDate.getDate();
  const totalDaysInMonth = getDaysInMonth(currentYear, currentMonth);

  const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  let thisMonthIncome = 0;
  let thisMonthExpense = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
      if (tx.date.startsWith(currentMonthPrefix)) {
        thisMonthIncome += tx.amount;
      }
    } else {
      totalExpense += tx.amount;
      if (tx.date.startsWith(currentMonthPrefix)) {
        thisMonthExpense += tx.amount;
      }
    }
  });

  const currentBalance = totalIncome - totalExpense;
  const thisMonthNet = thisMonthIncome - thisMonthExpense;

  // Ayın başından bugüne kadar geçen gün sayısı (en az 1)
  const daysPassedInMonth = Math.max(1, currentDay);
  const dailyAverageExpense = thisMonthExpense > 0 ? thisMonthExpense / daysPassedInMonth : 0;

  // Ay sonu tahmini harcama
  const projectedMonthEndExpense = dailyAverageExpense * totalDaysInMonth;

  // Paran kaç gün yeter (Runway)
  // Eğer bakiye > 0 ve günlük ortalama harcama > 0 ise:
  let runwayDays = 0;
  if (currentBalance > 0) {
    if (dailyAverageExpense > 0) {
      runwayDays = currentBalance / dailyAverageExpense;
    } else {
      runwayDays = 999; // Harcama yoksa sınırsız
    }
  }

  // Ay sonuna kalan gün sayısı
  const remainingDaysInMonth = Math.max(1, totalDaysInMonth - currentDay);
  const safeDailySpendingToMonthEnd = currentBalance > 0 ? currentBalance / remainingDaysInMonth : 0;

  return {
    totalIncome,
    totalExpense,
    currentBalance,
    thisMonthIncome,
    thisMonthExpense,
    thisMonthNet,
    dailyAverageExpense,
    projectedMonthEndExpense,
    runwayDays,
    safeDailySpendingToMonthEnd,
  };
}

/**
 * Günlük harcamaları tarihe göre grupla
 */
export function groupTransactionsByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  const sorted = [...transactions].sort((a, b) => {
    // Önce tarihe göre azalan, sonra oluşturulma zamanına göre azalan
    if (b.date !== a.date) {
      return b.date.localeCompare(a.date);
    }
    return b.createdAt - a.createdAt;
  });

  return sorted.reduce((acc, tx) => {
    if (!acc[tx.date]) {
      acc[tx.date] = [];
    }
    acc[tx.date].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);
}

/**
 * Belirli bir tarih için toplam harcama ve gelir
 */
export function getDayTotals(transactions: Transaction[]): { expense: number; income: number } {
  return transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'expense') acc.expense += tx.amount;
      if (tx.type === 'income') acc.income += tx.amount;
      return acc;
    },
    { expense: 0, income: 0 }
  );
}
