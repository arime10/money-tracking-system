import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  CreditCard,
  Banknote,
  Building2,
  Calendar,
  Check,
} from 'lucide-react';
import { Category, Transaction } from '../types';
import { parseQuickInput } from '../utils/quickInputParser';
import { formatMoney } from '../utils/financeCalculators';

interface QuickInputBarProps {
  categories: Category[];
  currency: string;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export const QuickInputBar: React.FC<QuickInputBarProps> = ({
  categories,
  currency,
  onAddTransaction,
}) => {
  const [inputText, setInputText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const parsed = useMemo(() => {
    return parseQuickInput(inputText, categories);
  }, [inputText, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsed) return;

    onAddTransaction({
      type: parsed.type,
      amount: parsed.amount,
      categoryId: parsed.categoryId,
      date: parsed.date,
      description: parsed.description,
      paymentMethod: parsed.paymentMethod,
    });

    setInputText('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'kart': return <CreditCard className="w-3 h-3" />;
      case 'nakit': return <Banknote className="w-3 h-3" />;
      case 'havale': return <Building2 className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border transition-all shadow-sm ${
          parsed
            ? 'border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-md'
            : 'border-slate-200 dark:border-slate-800 focus-within:border-emerald-500'
        }`}
      >
        <div className="pl-4 text-emerald-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tek cümleyle hızlı yaz: 'dün akşam yemek 350 kart' veya 'benzin 900'..."
          className="w-full px-3 py-3 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
        />

        <div className="pr-2 flex items-center gap-1.5 flex-shrink-0">
          {parsed && (
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
            >
              <span>Ekle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Real-time Parsed Preview Badge */}
      {parsed && (
        <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {parsed.description}
            </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              {parsed.type === 'income' ? '+' : '-'}{formatMoney(parsed.amount, currency)}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-[11px]">
              📁 {parsed.matchedCategoryName}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-[11px]">
              {getMethodIcon(parsed.paymentMethod)}
              <span className="capitalize">{parsed.paymentMethod}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
              <Calendar className="w-3 h-3" />
              {parsed.date === new Date().toISOString().split('T')[0] ? 'Bugün' : 'Dün'}
            </span>
          </div>

          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold hidden sm:inline">
            Enter'a basarak hemen kaydedin ↵
          </span>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="mt-2 p-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>İşlem başarıyla kaydedildi!</span>
        </div>
      )}
    </div>
  );
};
