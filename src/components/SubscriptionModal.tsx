import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  CreditCard,
  Banknote,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Subscription, Category, PaymentMethod, BillingCycle } from '../types';
import { POPULAR_SUBSCRIPTIONS, SubscriptionPreset } from '../data/popularSubscriptions';
import { CategoryIcon } from './CategoryIcon';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sub: Omit<Subscription, 'id' | 'createdAt'>, id?: string) => void;
  categories: Category[];
  editingSubscription?: Subscription | null;
}

const AVAILABLE_COLORS = [
  '#e50914', '#1db954', '#ff0000', '#000000', '#00a8e1',
  '#113ccf', '#10a37f', '#fab818', '#00adef', '#8b5cf6',
  '#ec4899', '#f97316', '#3b82f6', '#10b981', '#64748b'
];

const AVAILABLE_ICONS = [
  'Tv', 'Music', 'PlaySquare', 'Smartphone', 'ShoppingBag',
  'Film', 'Bot', 'Dumbbell', 'Gamepad2', 'Wifi', 'Cloud',
  'BookOpen', 'ShieldCheck', 'Radio', 'Sparkles'
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  editingSubscription,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [billingDay, setBillingDay] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<string>('cat-eglence');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kart');
  const [color, setColor] = useState<string>('#e50914');
  const [icon, setIcon] = useState<string>('Tv');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name);
      setAmount(editingSubscription.amount.toString());
      setBillingCycle(editingSubscription.billingCycle);
      setBillingDay(editingSubscription.billingDay);
      setCategoryId(editingSubscription.categoryId);
      setPaymentMethod(editingSubscription.paymentMethod);
      setColor(editingSubscription.color);
      setIcon(editingSubscription.icon);
      setNotes(editingSubscription.notes || '');
    } else {
      setName('');
      setAmount('');
      setBillingCycle('monthly');
      const todayDay = new Date().getDate();
      setBillingDay(todayDay);
      setCategoryId('cat-eglence');
      setPaymentMethod('kart');
      setColor('#e50914');
      setIcon('Tv');
      setNotes('');
    }
  }, [editingSubscription, isOpen]);

  const handleSelectPreset = (preset: SubscriptionPreset) => {
    setName(preset.name);
    setAmount(preset.defaultAmount.toString());
    setColor(preset.color);
    setIcon(preset.icon);
    if (categories.some((c) => c.id === preset.categoryId)) {
      setCategoryId(preset.categoryId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!name.trim()) {
      alert('Lütfen abonelik adını girin.');
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      alert('Lütfen geçerli bir tutar girin.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        amount: parsedAmount,
        billingCycle,
        billingDay: Math.min(31, Math.max(1, billingDay)),
        categoryId,
        paymentMethod,
        color,
        icon,
        isActive: true,
        notes: notes.trim() || undefined,
      },
      editingSubscription?.id
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              <CategoryIcon name={icon} className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingSubscription ? 'Aboneliği Düzenle' : 'Yeni Abonelik Ekle'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Quick Preset Selector (Only for new) */}
          {!editingSubscription && (
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Popüler Aboneliklerden Hızlı Seç:</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {POPULAR_SUBSCRIPTIONS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-emerald-500 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all shadow-xs"
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Abonelik Adı & Tutar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Abonelik Adı
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Netflix, Spotify..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

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
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 text-sm font-bold bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ₺
                </span>
              </div>
            </div>
          </div>

          {/* Fatura Dönemi & Ödeme Günü */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Ödeme Sıklığı
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Aylık
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    billingCycle === 'yearly'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Yıllık
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Ödeme Günü</span>
                <span className="text-slate-400 lowercase font-normal">her ayın {billingDay}. günü</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={31}
                  required
                  value={billingDay}
                  onChange={(e) => setBillingDay(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Kategori & Ödeme Yöntemi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Kategori
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              >
                {categories
                  .filter((c) => c.type === 'expense')
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Ödeme Yolu
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

          {/* Renk ve İkon Seçimi */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Marka / Renk Seç:</span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-lg transition-transform ${
                      color === c ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">İkon Seç:</span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1">
                {AVAILABLE_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`p-1.5 rounded-lg border text-slate-700 dark:text-slate-300 transition-all ${
                      icon === ic
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <CategoryIcon name={ic} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Not / Açıklama */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Not (Opsiyonel)
            </label>
            <input
              type="text"
              placeholder="Örn: Ortak aile hesabı, 4K paket vb."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {editingSubscription ? 'Aboneliği Güncelle' : 'Aboneliği Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
