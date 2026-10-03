import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Clock,
  Coins,
} from 'lucide-react';
import { FinancialMetrics } from '../types';
import { formatMoney } from '../utils/financeCalculators';

interface RunwaySimulatorProps {
  metrics: FinancialMetrics;
  currency: string;
}

export const RunwaySimulator: React.FC<RunwaySimulatorProps> = ({ metrics, currency }) => {
  const [activeTab, setActiveTab] = useState<'dailyToDays' | 'daysToDaily' | 'monthEnd'>('dailyToDays');

  // Mode 1: Günde X harcarsam
  const defaultDaily = metrics.dailyAverageExpense > 0 ? Math.round(metrics.dailyAverageExpense) : 350;
  const [simDailySpend, setSimDailySpend] = useState<number>(defaultDaily);

  // Mode 2: Y gün yetirmek için
  const [simTargetDays, setSimTargetDays] = useState<number>(30);

  // Mode 1 Hesabı:
  const simRunwayDays = useMemo(() => {
    if (metrics.currentBalance <= 0 || simDailySpend <= 0) return 0;
    return metrics.currentBalance / simDailySpend;
  }, [metrics.currentBalance, simDailySpend]);

  const simEndDate = useMemo(() => {
    if (simRunwayDays <= 0) return null;
    const target = new Date();
    target.setDate(target.getDate() + Math.floor(simRunwayDays));
    return target.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    });
  }, [simRunwayDays]);

  // Mode 2 Hesabı:
  const requiredDailyBudget = useMemo(() => {
    if (metrics.currentBalance <= 0 || simTargetDays <= 0) return 0;
    return metrics.currentBalance / simTargetDays;
  }, [metrics.currentBalance, simTargetDays]);

  // Ay sonu hesabı
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const remainingDaysInMonth = Math.max(1, totalDaysInMonth - today.getDate());
  const monthEndSafeSpend = metrics.currentBalance > 0 ? metrics.currentBalance / remainingDaysInMonth : 0;

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Akıllı Bütçe & Dayanıklılık Simülatörü
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                Canlı Hesaplama
              </span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mevcut bakiyenize göre paranızın ne kadar dayanacağını ve günlük limitlerinizi simüle edin.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('dailyToDays')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'dailyToDays'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Günde X Harcarsam?
          </button>
          <button
            onClick={() => setActiveTab('daysToDaily')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'daysToDaily'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Hedef Gün İçin Limit
          </button>
          <button
            onClick={() => setActiveTab('monthEnd')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'monthEnd'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ay Sonu Kurtarma
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {metrics.currentBalance <= 0 ? (
          <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-4 text-rose-700 dark:text-rose-300">
            <ShieldAlert className="w-8 h-8 flex-shrink-0" />
            <div>
              <div className="font-semibold text-base">Mevcut Bakiyeniz Yetersiz</div>
              <p className="text-sm opacity-90">
                Simülasyon yapabilmek için lütfen gelir ekleyin veya pozitif bir bakiye oluşturun.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* TAB 1: Günde X Harcarsam Kaç Gün Yeter? */}
            {activeTab === 'dailyToDays' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Input side */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <Coins className="w-4 h-4 text-emerald-500" />
                      Planlanan Günlük Harcama:
                    </label>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {formatMoney(simDailySpend, currency)}
                    </span>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min={50}
                    max={Math.max(5000, Math.round(metrics.currentBalance / 3))}
                    step={25}
                    value={simDailySpend}
                    onChange={(e) => setSimDailySpend(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-slate-400">Hızlı Seçim:</span>
                    {[
                      { label: '150 ₺', val: 150 },
                      { label: '300 ₺', val: 300 },
                      { label: '500 ₺', val: 500 },
                      { label: '1.000 ₺', val: 1000 },
                      ...(metrics.dailyAverageExpense > 0
                        ? [{ label: `Şu Anki Ortalama (${Math.round(metrics.dailyAverageExpense)} ₺)`, val: Math.round(metrics.dailyAverageExpense) }]
                        : []),
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSimDailySpend(btn.val)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          simDailySpend === btn.val
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Manual number input */}
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Özel Tutar Gir:</span>
                    <input
                      type="number"
                      min={1}
                      value={simDailySpend || ''}
                      onChange={(e) => setSimDailySpend(Math.max(0, Number(e.target.value)))}
                      className="w-32 px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                      placeholder="0"
                    />
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{currency} / gün</span>
                  </div>
                </div>

                {/* Result Card Side */}
                <div className="lg:col-span-6 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-transparent p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/80">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    <span>Simülasyon Sonucu</span>
                    <Sparkles className="w-4 h-4" />
                  </div>

                  <div className="mt-3">
                    <div className="text-slate-600 dark:text-slate-300 text-sm">
                      Mevcut <strong className="text-slate-900 dark:text-white">{formatMoney(metrics.currentBalance, currency)}</strong> bakiyenizle:
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                        {Math.floor(simRunwayDays)} Gün
                      </span>
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        (~{(simRunwayDays / 30).toFixed(1)} Ay)
                      </span>
                    </div>
                  </div>

                  {simEndDate && (
                    <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span>
                        Paranız tahminen <strong className="text-emerald-700 dark:text-emerald-300">{simEndDate}</strong> tarihine kadar yetecektir.
                      </span>
                    </div>
                  )}

                  {metrics.dailyAverageExpense > 0 && (
                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5 text-blue-500" />
                      <span>
                        Şu anki gerçek ortalamanız: <strong>{formatMoney(metrics.dailyAverageExpense, currency)}/gün</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Hedef Gün İçin Günlük Limit Ne Olmalı? */}
            {activeTab === 'daysToDaily' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Input side */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Paranızın Yetmesini İstediğiniz Süre:
                    </label>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {simTargetDays} Gün
                    </span>
                  </div>

                  {/* Range Slider for days */}
                  <input
                    type="range"
                    min={3}
                    max={180}
                    step={1}
                    value={simTargetDays}
                    onChange={(e) => setSimTargetDays(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-slate-400">Hızlı Süre:</span>
                    {[
                      { label: '1 Hafta (7 gün)', days: 7 },
                      { label: '15 Gün', days: 15 },
                      { label: '1 Ay (30 gün)', days: 30 },
                      { label: '2 Ay (60 gün)', days: 60 },
                      { label: '3 Ay (90 gün)', days: 90 },
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSimTargetDays(btn.days)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          simTargetDays === btn.days
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Manual input */}
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Özel Gün Sayısı:</span>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={simTargetDays || ''}
                      onChange={(e) => setSimTargetDays(Math.max(1, Number(e.target.value)))}
                      className="w-24 px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">gün</span>
                  </div>
                </div>

                {/* Result Card Side */}
                <div className="lg:col-span-6 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-transparent p-6 rounded-2xl border border-blue-200 dark:border-blue-800/80">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    <span>Önerilen Günlük Harcama Limiti</span>
                    <Sparkles className="w-4 h-4" />
                  </div>

                  <div className="mt-3">
                    <div className="text-slate-600 dark:text-slate-300 text-sm">
                      Paranızı tam <strong className="text-slate-900 dark:text-white">{simTargetDays} gün</strong> idare ettirmek için günde en fazla:
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                        {formatMoney(requiredDailyBudget, currency)}
                      </span>
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        / gün
                      </span>
                    </div>
                  </div>

                  {/* Comparison with current daily average */}
                  <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-blue-800/60">
                    {metrics.dailyAverageExpense > 0 ? (
                      requiredDailyBudget >= metrics.dailyAverageExpense ? (
                        <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                          <span>
                            Harika! Şu anki ortalamanız ({formatMoney(metrics.dailyAverageExpense, currency)}) hedef limitin altında, rahatça yetecektir.
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                          <span>
                            Uyarı: Şu anki ortalamanız ({formatMoney(metrics.dailyAverageExpense, currency)}) bu hedefin üzerinde. Günlük harcamanızı yaklaşık {formatMoney(metrics.dailyAverageExpense - requiredDailyBudget, currency)} kısmanız önerilir.
                          </span>
                        </div>
                      )
                    ) : (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Bu ay harcama yaptıkça gerçek ortalamanızla kıyaslama burada görünecektir.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Ay Sonu Kurtarma Planı */}
            {activeTab === 'monthEnd' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Bu Ayın Kalan Günleri İçin Bütçe
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Ay sonuna kadar cebinizdeki parayla borçlanmadan ve eksiye düşmeden çıkmak için günlük güvenli tavan bütçeniz:
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-xl space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>Bu ay geçen gün:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{today.getDate()} Gün</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ay sonuna kalan süre:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{remainingDaysInMonth} Gün</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1.5">
                      <span>Kalan Mevcut Bakiye:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(metrics.currentBalance, currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent dark:from-purple-950/40 dark:via-pink-950/20 dark:to-transparent p-6 rounded-2xl border border-purple-200 dark:border-purple-800/80">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    Ay Sonu Güvenli Günlük Limit
                  </div>
                  <div className="mt-3">
                    <div className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-300 bg-clip-text text-transparent">
                      {formatMoney(monthEndSafeSpend, currency)}
                    </div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                      Önümüzdeki {remainingDaysInMonth} gün boyunca her gün bu tutarı aşmazsanız ayı pozitif bakiye ile tamamlarsınız.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
