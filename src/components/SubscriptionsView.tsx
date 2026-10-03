import React, { useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { Subscription, Category } from '../types';
import { formatMoney } from '../utils/financeCalculators';
import { CategoryIcon } from './CategoryIcon';

interface SubscriptionsViewProps {
  subscriptions: Subscription[];
  categories: Category[];
  currency: string;
  onOpenAddModal: () => void;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onLogAsExpense: (sub: Subscription) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  subscriptions,
  currency,
  onOpenAddModal,
  onEdit,
  onDelete,
  onToggleActive,
  onLogAsExpense,
}) => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  // Hesaplamalar
  const { totalMonthly, totalYearly, activeCount, upcomingSubs } = useMemo(() => {
    let monthlySum = 0;
    let yearlySum = 0;
    let active = 0;

    const upcoming: {
      sub: Subscription;
      daysRemaining: number;
      targetDateStr: string;
    }[] = [];

    subscriptions.forEach((sub) => {
      if (!sub.isActive) return;
      active++;

      const monthlyAmount = sub.billingCycle === 'yearly' ? sub.amount / 12 : sub.amount;
      const yearlyAmount = sub.billingCycle === 'yearly' ? sub.amount : sub.amount * 12;

      monthlySum += monthlyAmount;
      yearlySum += yearlyAmount;

      // Yaklaşan ödeme tarihi hesabı:
      let targetMonth = currentMonth;
      let targetYear = currentYear;

      if (sub.billingDay < currentDay) {
        // Bu ayki gün geçti, gelecek ay
        targetMonth = (currentMonth + 1) % 12;
        if (targetMonth === 0) targetYear++;
      }

      // Ayın kaç gün çektiğini kontrol et
      const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      const actualBillingDay = Math.min(sub.billingDay, daysInTargetMonth);

      const targetDate = new Date(targetYear, targetMonth, actualBillingDay);
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 7) {
        upcoming.push({
          sub,
          daysRemaining: diffDays,
          targetDateStr: targetDate.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
          }),
        });
      }
    });

    upcoming.sort((a, b) => a.daysRemaining - b.daysRemaining);

    return {
      totalMonthly: monthlySum,
      totalYearly: yearlySum,
      activeCount: active,
      upcomingSubs: upcoming,
    };
  }, [subscriptions, currentDay, currentMonth, currentYear, today]);

  return (
    <div className="space-y-6">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Aylık Toplam */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Aylık Abonelik Yükü
            </span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatMoney(totalMonthly, currency)}
              <span className="text-xs font-normal text-slate-400 ml-1">/ ay</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Günde yaklaşık {formatMoney(totalMonthly / 30, currency)}
            </div>
          </div>
        </div>

        {/* Yıllık Toplam */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Yıllık Toplam Maliyet
            </span>
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatMoney(totalYearly, currency)}
              <span className="text-xs font-normal text-slate-400 ml-1">/ yıl</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              12 aylık kümülatif bütçe
            </div>
          </div>
        </div>

        {/* Aktif Abonelik Sayısı */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Aktif Servisler
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeCount} / {subscriptions.length}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Düzenli çekilen dijital servis
            </div>
          </div>
        </div>

        {/* Yaklaşan Ödemeler */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Yaklaşan Ödemeler
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {upcomingSubs.length} Ödeme
            </div>
            <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
              Önümüzdeki 7 gün içinde
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Payments Alert Banner (if any in next 7 days) */}
      {upcomingSubs.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 dark:border-amber-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Yaklaşan Abonelik Faturalarınız Var!
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex flex-wrap gap-2">
                {upcomingSubs.map(({ sub, daysRemaining, targetDateStr }) => (
                  <span
                    key={sub.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 font-medium"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: sub.color }}
                    />
                    <strong>{sub.name}</strong> ({formatMoney(sub.amount, currency)}) •{' '}
                    <span className="text-amber-600 dark:text-amber-400">
                      {daysRemaining === 0 ? 'Bugün!' : `${daysRemaining} gün sonra (${targetDateStr})`}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions Grid & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Kayıtlı Abonelikleriniz
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {subscriptions.length} servis
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Düzenli yinelenen Apple, Netflix, Spotify, YouTube vb. servisleriniz
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Abonelik Ekle</span>
          </button>
        </div>

        {/* Subscriptions Cards */}
        {subscriptions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              Henüz abonelik eklemediniz
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Netflix, Spotify, YouTube, iCloud gibi servislerinizi ekleyerek aylık toplam yükünüzü görün.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-colors"
            >
              İlk Aboneliği Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub) => {
              // Gelecek ödemeye kalan gün
              let targetMonth = currentMonth;
              let targetYear = currentYear;
              if (sub.billingDay < currentDay) {
                targetMonth = (currentMonth + 1) % 12;
                if (targetMonth === 0) targetYear++;
              }
              const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
              const actualBillingDay = Math.min(sub.billingDay, daysInTargetMonth);
              const targetDate = new Date(targetYear, targetMonth, actualBillingDay);
              const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={sub.id}
                  className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                    sub.isActive
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                      : 'bg-slate-100/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  {/* Top Bar: Icon, Name, Amount */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                          style={{ backgroundColor: sub.color }}
                        >
                          <CategoryIcon name={sub.icon} className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            {sub.name}
                            {!sub.isActive && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                                Duraklatıldı
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {sub.billingCycle === 'yearly' ? 'Yıllık Fatura' : 'Aylık Fatura'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-extrabold text-slate-900 dark:text-white">
                          {formatMoney(sub.amount, currency)}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {sub.billingCycle === 'yearly' ? '/ yıl' : '/ ay'}
                        </span>
                      </div>
                    </div>

                    {/* Metadata: Ödeme Günü ve Kalan Süre */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Her ayın {sub.billingDay}. günü</span>
                      </div>

                      <div className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                        {diffDays === 0 ? 'Bugün çekilecek' : `${diffDays} gün sonra`}
                      </div>
                    </div>

                    {sub.notes && (
                      <div className="mt-2 text-[11px] text-slate-400 italic">
                        "{sub.notes}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    {/* Log as expense right now */}
                    <button
                      onClick={() => onLogAsExpense(sub)}
                      title="Bu faturayı bugünün harcamalarına ekle"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Harcamaya Ekle</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleActive(sub.id)}
                        className={`text-[11px] px-2 py-1 rounded-lg transition-colors font-medium ${
                          sub.isActive
                            ? 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                      >
                        {sub.isActive ? 'Dondur' : 'Aktif Et'}
                      </button>

                      <button
                        onClick={() => onEdit(sub)}
                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDelete(sub.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
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
        )}
      </div>
    </div>
  );
};
