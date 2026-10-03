import React from 'react';
import {
  Target,
  Plus,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { SavingsGoal, FinancialMetrics } from '../types';
import { formatMoney } from '../utils/financeCalculators';
import { CategoryIcon } from './CategoryIcon';

interface SavingsGoalsViewProps {
  goals: SavingsGoal[];
  metrics: FinancialMetrics;
  currency: string;
  onOpenAddModal: () => void;
  onEditGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateAmount: (goalId: string, delta: number) => void;
}

export const SavingsGoalsView: React.FC<SavingsGoalsViewProps> = ({
  goals,
  metrics,
  currency,
  onOpenAddModal,
  onEditGoal,
  onDeleteGoal,
  onUpdateAmount,
}) => {
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const overallPercent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  // Günlük ortalama tasarruf kapasitesi (Bu ayki gelir - tahmini harcama hızı)
  const monthlySavingsPace = Math.max(0, metrics.thisMonthNet);
  const dailySavingsPace = monthlySavingsPace > 0 ? monthlySavingsPace / 30 : 250;

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Toplam Biriktirilen */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Kumbara Toplamı
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatMoney(totalSaved, currency)}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Hedeflenen toplamın %{overallPercent.toFixed(1)}'i tamamlandı
            </div>
          </div>
        </div>

        {/* Toplam Hedef */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Toplam Hedef Büyüklüğü
            </span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatMoney(totalTarget, currency)}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Kalan ihtiyaç: {formatMoney(Math.max(0, totalTarget - totalSaved), currency)}
            </div>
          </div>
        </div>

        {/* Aktif Hedef Sayısı */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Kumbara Hedefleri
            </span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {goals.length} Aktif Hedef
            </div>
            <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
              Hayallerini biriktir
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Birikim Hedefleriniz
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {goals.length} hedef
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Yeni telefon, tatil veya acil durum için ayırdığınız paralar
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Hedef Ekle</span>
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 mb-3">
              <Target className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              Henüz birikim hedefi eklemediniz
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Hayalini kurduğunuz bir telefon, tatil veya araba için ilk hedefinizi oluşturun.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-colors"
            >
              İlk Hedefi Oluştur
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {goals.map((goal) => {
              const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
              const isFinished = goal.currentAmount >= goal.targetAmount;

              // Tahmini kalan gün
              const daysRemaining = dailySavingsPace > 0 ? Math.ceil(remaining / dailySavingsPace) : 90;
              const finishDate = new Date();
              finishDate.setDate(finishDate.getDate() + daysRemaining);
              const finishDateStr = finishDate.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });

              return (
                <div
                  key={goal.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                          style={{ backgroundColor: goal.color }}
                        >
                          <CategoryIcon name={goal.icon} className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            {goal.name}
                            {isFinished && (
                              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                Tamamlandı!
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">
                            Hedef: <strong>{formatMoney(goal.targetAmount, currency)}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditGoal(goal)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteGoal(goal.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatMoney(goal.currentAmount, currency)}
                        </span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-300">
                          %{percent}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: goal.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Projection text */}
                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      {isFinished ? (
                        <span className="text-emerald-600 font-bold">
                          Tebrikler! Bu hedef için gereken tutara ulaştın! 🥳
                        </span>
                      ) : (
                        <>
                          <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>
                            Kalan: <strong>{formatMoney(remaining, currency)}</strong> • Tahminen{' '}
                            <strong className="text-emerald-600 dark:text-emerald-400">{finishDateStr}</strong> ({daysRemaining} gün) tarihinde tamamlanır.
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick deposit buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-400">Kumbaraya Ekle:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateAmount(goal.id, 250)}
                        className="px-2 py-1 text-xs font-semibold bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-200 dark:border-slate-600 rounded-lg transition-colors"
                      >
                        +250 ₺
                      </button>
                      <button
                        onClick={() => onUpdateAmount(goal.id, 500)}
                        className="px-2 py-1 text-xs font-semibold bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-200 dark:border-slate-600 rounded-lg transition-colors"
                      >
                        +500 ₺
                      </button>
                      <button
                        onClick={() => onUpdateAmount(goal.id, 1000)}
                        className="px-2 py-1 text-xs font-semibold bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-200 dark:border-slate-600 rounded-lg transition-colors"
                      >
                        +1.000 ₺
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
