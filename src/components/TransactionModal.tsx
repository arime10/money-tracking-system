import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Check,
  CreditCard,
  Banknote,
  Building2,
} from 'lucide-react';
import { Transaction, Category, TransactionType, PaymentMethod } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'createdAt'>, id?: string) => void;
  categories: Category[];
  editingTransaction?: Transaction | null;
  defaultType?: TransactionType;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  editingTransaction,
  defaultType = 'expense',
}) => {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kart');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategoryId(editingTransaction.categoryId);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description);
      setPaymentMethod(editingTransaction.paymentMethod);
    } else {
      setType(defaultType);
      setAmount('');
      const todayStr = new Date().toISOString().split('T')[0];
      setDate(todayStr);
      setDescription('');
      setPaymentMethod('kart');

      // İlk geçerli kategoriyi seç
      const filtered = categories.filter((c) => c.type === defaultType);
      if (filtered.length > 0) {
        setCategoryId(filtered[0].id);
      }
    }
  }, [editingTransaction, defaultType, isOpen, categories]);

  // Tip değiştiğinde kategoriyi de güncelle
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const filtered = categories.filter((c) => c.type === newType);
    if (filtered.length > 0 && !filtered.some((c) => c.id === categoryId)) {
      setCategoryId(filtered[0].id);
    }
  };

  const handleQuickAddAmount = (addValue: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + addValue).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      alert('Lütfen geçerli bir tutar girin.');
      return;
    }
    if (!categoryId) {
      alert('Lütfen bir kategori seçin.');
      return;
    }
    if (!date) {
      alert('Lütfen bir tarih seçin.');
      return;
    }

    onSave(
      {
        type,
        amount: parsedAmount,
        categoryId,
        date,
        description: description.trim() || (type === 'expense' ? 'Harcama' : 'Gelir'),
        paymentMethod,
      },
      editingTransaction?.id
    );

    onClose();
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {editingTransaction ? 'İşlemi Düzenle' : 'Yeni İşlem Kaydı'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Tür Seçimi (Gelir / Gider) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-white dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 shadow-sm border border-rose-200 dark:border-rose-900'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Harcama (Gider)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-white dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 shadow-sm border border-emerald-200 dark:border-emerald-900'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Gelen Para (Gelir)
            </button>
          </div>

          {/* Tutar Girişi */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Tutar (₺)
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.01"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-4 pr-12 py-3 text-2xl font-bold bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ₺
              </span>
            </div>

            {/* Hızlı Tutar Ekleme Butonları */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
              {[50, 100, 250, 500, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                  {val} ₺
                </button>
              ))}
            </div>
          </div>

          {/* Kategori Seçimi */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Kategori
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
              {filteredCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tarih ve Ödeme Yöntemi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Tarih
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Ödeme Türü
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
                {[
                  { id: 'kart' as const, label: 'Kart', icon: CreditCard },
                  { id: 'nakit' as const, label: 'Nakit', icon: Banknote },
                  { id: 'havale' as const, label: 'EFT', icon: Building2 },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id)}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        paymentMethod === item.id
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Açıklama / Not
            </label>
            <input
              type="text"
              placeholder="Örn: Market alışverişi, akşam kahvesi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {editingTransaction ? 'Değişiklikleri Kaydet' : 'İşlemi Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
