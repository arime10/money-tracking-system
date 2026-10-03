import React from 'react';
import {
  Wallet,
  TrendingDown,
  Activity,
  Hourglass,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { FinancialMetrics } from '../types';
import { formatMoney } from '../utils/financeCalculators';

interface StatCardsProps {
  metrics: FinancialMetrics;
  currency: string;
}

export const StatCards: React.FC<StatCardsProps> = ({ metrics, currency }) => {
  const isPositiveBalance = metrics.currentBalance >= 0;

  // Runway durumu
  let runwayStatusColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
  let runwayBadge = 'Güvenli Bölge';
  let RunwayIcon = CheckCircle2;

  if (metrics.currentBalance <= 0) {
    runwayStatusColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
    runwayBadge = 'Bakiye Tükendi';
    RunwayIcon = AlertCircle;
  } else if (metrics.runwayDays < 15) {
    runwayStatusColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
    runwayBadge = 'Kritik Seviye';
    RunwayIcon = AlertCircle;
  } else if (metrics.runwayDays < 30) {
    runwayStatusColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    runwayBadge = 'Dikkatli Harca';
    RunwayIcon = AlertCircle;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Kalan Net Bakiye */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Kalan Net Bakiye
          </span>
          <div className={`p-2 rounded-xl ${isPositiveBalance ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl font-bold tracking-tight ${isPositiveBalance ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatMoney(metrics.currentBalance, currency)}
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {formatMoney(metrics.totalIncome, currency)}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center text-rose-600 dark:text-rose-400 font-medium">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {formatMoney(metrics.totalExpense, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Bu Ayın Harcaması */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Bu Ayki Harcama
          </span>
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatMoney(metrics.thisMonthExpense, currency)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Tahmini Ay Sonu:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatMoney(metrics.projectedMonthEndExpense, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Günlük Ortalama Harcama */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Günlük Ortalama Harcama
          </span>
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatMoney(metrics.dailyAverageExpense, currency)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/ gün</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Ay sonu için hedef:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {formatMoney(metrics.safeDailySpendingToMonthEnd, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Paran Kaç Gün Yeter? */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Paran Ne Kadar Yeter?
          </span>
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400">
            <Hourglass className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {metrics.currentBalance <= 0
                ? '0 Gün'
                : metrics.dailyAverageExpense <= 0
                ? 'Sınırsız'
                : `${Math.floor(metrics.runwayDays)} Gün`}
            </span>
            {metrics.dailyAverageExpense > 0 && metrics.currentBalance > 0 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({(metrics.runwayDays / 30).toFixed(1)} ay)
              </span>
            )}
          </div>
          <div className="mt-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${runwayStatusColor}`}>
              <RunwayIcon className="w-3 h-3" />
              {runwayBadge}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
