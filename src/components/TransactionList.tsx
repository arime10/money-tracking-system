import React, { useState, useMemo } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  Calendar,
  CreditCard,
  Banknote,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Inbox,
  Plus,
} from 'lucide-react';
import { Transaction, Category, TransactionType } from '../types';
import { formatDateTR, formatMoney, groupTransactionsByDate, getDayTotals } from '../utils/financeCalculators';
import { CategoryIcon } from './CategoryIcon';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  currency,
  onEdit,
  onDelete,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {} as Record<string, Category>);
  }, [categories]);

  // Mevcut tüm ayları bul (örn: 2026-09, 2026-08)
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach((tx) => {
      months.add(tx.date.substring(0, 7));
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  // Filtreleme
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Tip filtresi
      if (filterType !== 'all' && tx.type !== filterType) {
        return false;
      }
      // Ay filtresi
      if (selectedMonth !== 'all' && !tx.date.startsWith(selectedMonth)) {
        return false;
      }
      // Arama filtresi
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const catName = categoryMap[tx.categoryId]?.name.toLowerCase() || '';
        const desc = tx.description.toLowerCase();
        if (!catName.includes(query) && !desc.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, filterType, selectedMonth, searchQuery, categoryMap]);

  // Tarihe göre grupla
  const grouped = useMemo(() => {
    return groupTransactionsByDate(filteredTransactions);
  }, [filteredTransactions]);

  const dates = Object.keys(grouped);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'kart':
        return (
          <span title="Kredi/Banka Kartı">
            <CreditCard className="w-3.5 h-3.5" />
          </span>
        );
      case 'nakit':
        return (
          <span title="Nakit">
            <Banknote className="w-3.5 h-3.5" />
          </span>
        );
      case 'havale':
        return (
          <span title="Havale / EFT">
            <Building2 className="w-3.5 h-3.5" />
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* List Header & Filters */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Günlük İşlem Geçmişi
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {filteredTransactions.length} kayıt
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gün bazında harcama ve gelir akışınız
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="İşlem veya kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Tip Seçimi (Tümü / Gider / Gelir) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                filterType === 'expense'
                  ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 shadow-sm border border-rose-200 dark:border-rose-900'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
              }`}
            >
              Harcamalar
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                filterType === 'income'
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 shadow-sm border border-emerald-200 dark:border-emerald-900'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
              }`}
            >
              Gelirler
            </button>
          </div>

          {/* Ay Seçici */}
          {availableMonths.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Tüm Aylar</option>
                {availableMonths.map((m) => {
                  const [y, mon] = m.split('-');
                  const monthName = new Date(Number(y), Number(mon) - 1, 1).toLocaleDateString('tr-TR', {
                    month: 'long',
                    year: 'numeric',
                  });
                  return (
                    <option key={m} value={m}>
                      {monthName}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Transaction List Body */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[600px] overflow-y-auto">
        {dates.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Inbox className="w-7 h-7" />
            </div>
            <div className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Henüz işlem bulunmuyor
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Yukarıdaki "Demo Veri" butonuna tıklayarak örnek veriler yükleyebilir veya ilk harcamanızı ekleyebilirsiniz.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Yeni İşlem Ekle
            </button>
          </div>
        ) : (
          dates.map((dateStr) => {
            const dayTxs = grouped[dateStr];
            const dayTotals = getDayTotals(dayTxs);

            return (
              <div key={dateStr} className="p-4 sm:p-5">
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {formatDateTR(dateStr)}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      ({dayTxs.length} işlem)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    {dayTotals.income > 0 && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                        +{formatMoney(dayTotals.income, currency)}
                      </span>
                    )}
                    {dayTotals.expense > 0 && (
                      <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center">
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                        -{formatMoney(dayTotals.expense, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Day Items */}
                <div className="space-y-1.5">
                  {dayTxs.map((tx) => {
                    const cat = categoryMap[tx.categoryId] || {
                      name: 'Diğer',
                      icon: 'CircleDot',
                      color: '#64748b',
                    };
                    const isIncome = tx.type === 'income';

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: cat.color }}
                          >
                            <CategoryIcon name={cat.icon} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {tx.description}
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                {getPaymentMethodIcon(tx.paymentMethod)}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {cat.name}
                            </div>
                          </div>
                        </div>

                        {/* Amount & Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                          <div
                            className={`text-sm font-bold tracking-tight ${
                              isIncome
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {isIncome ? '+' : '-'}
                            {formatMoney(tx.amount, currency)}
                          </div>

                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEdit(tx)}
                              className="p-1 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Düzenle"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(tx.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
