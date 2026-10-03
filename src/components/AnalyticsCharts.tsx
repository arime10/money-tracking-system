import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart, TrendingUp } from 'lucide-react';
import { Transaction, Category, CategoryBudget } from '../types';
import { formatMoney } from '../utils/financeCalculators';
import { CategoryIcon } from './CategoryIcon';
import { Sliders, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

// Register Chart.js modules
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

interface AnalyticsChartsProps {
  transactions: Transaction[];
  categories: Category[];
  categoryBudgets?: CategoryBudget[];
  currency: string;
  isDarkMode: boolean;
  onOpenBudgetLimits?: () => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  transactions,
  categories,
  categoryBudgets = [],
  currency,
  isDarkMode,
  onOpenBudgetLimits,
}) => {
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {} as Record<string, Category>);
  }, [categories]);

  // Sadece harcamaları hesapla (Geçerli Ay)
  const currentMonthPrefix = new Date().toISOString().slice(0, 7);

  const thisMonthExpenses = useMemo(() => {
    return transactions.filter(
      (tx) => tx.type === 'expense' && tx.date.startsWith(currentMonthPrefix)
    );
  }, [transactions, currentMonthPrefix]);

  // Kategori bazında harcama toplamları
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    thisMonthExpenses.forEach((tx) => {
      totals[tx.categoryId] = (totals[tx.categoryId] || 0) + tx.amount;
    });
    return totals;
  }, [thisMonthExpenses]);

  // Doughnut Chart Data
  const doughnutData = useMemo(() => {
    const labels: string[] = [];
    const dataValues: number[] = [];
    const backgroundColors: string[] = [];

    Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .forEach(([catId, total]) => {
        const cat = categoryMap[catId] || { name: 'Diğer', color: '#94a3b8' };
        labels.push(cat.name);
        dataValues.push(total);
        backgroundColors.push(cat.color);
      });

    return {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors,
          borderWidth: isDarkMode ? 2 : 1,
          borderColor: isDarkMode ? '#0f172a' : '#ffffff',
        },
      ],
    };
  }, [categoryTotals, categoryMap, isDarkMode]);

  // Günlük Harcama Trendi (Son 14 gün veya bu ayın günleri)
  const dailyBarData = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const labels: string[] = [];
    const values: number[] = [];

    for (let d = 1; d <= currentDay; d++) {
      const dayStr = String(d).padStart(2, '0');
      const dateKey = `${currentMonthPrefix}-${dayStr}`;
      labels.push(`${d}`);

      const dayTotal = thisMonthExpenses
        .filter((tx) => tx.date === dateKey)
        .reduce((sum, tx) => sum + tx.amount, 0);

      values.push(dayTotal);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Günlük Harcama',
          data: values,
          backgroundColor: '#10b981',
          borderRadius: 6,
        },
      ],
    };
  }, [thisMonthExpenses, currentMonthPrefix]);

  const textColor = isDarkMode ? '#cbd5e1' : '#475569';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <div className="space-y-6">
      {/* 1 & 2. Doughnut & Bar Grafikleri */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Kategori Dağılımı */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Kategorik Harcama Dağılımı
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Bu Ay</span>
          </div>

          <div className="mt-4 flex-1 flex items-center justify-center min-h-[240px]">
            {doughnutData.labels.length === 0 ? (
              <div className="text-center text-xs text-slate-400">
                Bu ay için harcama verisi bulunamadı.
              </div>
            ) : (
              <div className="w-full max-w-[260px] mx-auto">
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: textColor,
                          boxWidth: 12,
                          padding: 12,
                          font: { size: 11 },
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => {
                            const val = ctx.parsed as number;
                            return ` ${ctx.label}: ${formatMoney(val, currency)}`;
                          },
                        },
                      },
                    },
                    cutout: '70%',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 2. Günlük Harcama Grafiği */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Günlük Harcama Akışı (Bu Ay)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Günler</span>
          </div>

          <div className="mt-4 flex-1 flex items-center justify-center min-h-[240px]">
            {dailyBarData.labels.length === 0 ? (
              <div className="text-center text-xs text-slate-400">
                Grafik için henüz yeterli harcama verisi yok.
              </div>
            ) : (
              <div className="w-full h-full min-h-[240px]">
                <Bar
                  data={dailyBarData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { size: 10 } },
                      },
                      y: {
                        grid: { color: gridColor },
                        ticks: {
                          color: textColor,
                          font: { size: 10 },
                          callback: (val) => `${val} ₺`,
                        },
                      },
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          title: (items) => `${items[0].label} ${new Date().toLocaleDateString('tr-TR', { month: 'long' })}`,
                          label: (ctx) => ` Harcama: ${formatMoney((ctx.parsed.y as number) || 0, currency)}`,
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Kategori Bütçe Aşım Radarı */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-blue-500" />
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Kategori Bütçe Limitleri & Aşım Radarı
              </h4>
              <p className="text-xs text-slate-400">
                Aylık tavan bütçelerinizin anlık doluluk durumu
              </p>
            </div>
          </div>

          {onOpenBudgetLimits && (
            <button
              onClick={onOpenBudgetLimits}
              className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Limitleri Düzenle →
            </button>
          )}
        </div>

        {categoryBudgets.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Henüz kategori bütçe limiti belirlenmedi. Sağ üstten veya ayarlardan limit ekleyebilirsiniz.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryBudgets.map((b) => {
              const cat = categoryMap[b.categoryId] || { name: 'Kategori', color: '#3b82f6', icon: 'Tag' };
              const spent = categoryTotals[b.categoryId] || 0;
              const percent = Math.round((spent / b.monthlyLimit) * 100);
              const isExceeded = spent > b.monthlyLimit;
              const isWarning = percent >= 75 && !isExceeded;

              return (
                <div
                  key={b.categoryId}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shadow-xs"
                        style={{ backgroundColor: cat.color }}
                      >
                        <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {cat.name}
                      </span>
                    </div>

                    <div>
                      {isExceeded ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                          <ShieldAlert className="w-3 h-3" />
                          Aşıldı (+{formatMoney(spent - b.monthlyLimit, currency)})
                        </span>
                      ) : isWarning ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                          <AlertTriangle className="w-3 h-3" />
                          %{percent} Doldu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                          <ShieldCheck className="w-3 h-3" />
                          Güvende (%{percent})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Harcama: <strong>{formatMoney(spent, currency)}</strong></span>
                    <span>Tavan: <strong>{formatMoney(b.monthlyLimit, currency)}</strong></span>
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

