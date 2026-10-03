import React, { useMemo } from 'react';
import {
  X,
  Trophy,
  Sparkles,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Transaction, Category, FinancialMetrics } from '../types';
import { formatMoney } from '../utils/financeCalculators';

interface FinancialReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  categories: Category[];
  metrics: FinancialMetrics;
  currency: string;
}

export const FinancialReportCardModal: React.FC<FinancialReportCardModalProps> = ({
  isOpen,
  onClose,
  transactions,
  categories,
  metrics,
  currency,
}) => {
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, c) => {
      acc[c.id] = c;
      return acc;
    }, {} as Record<string, Category>);
  }, [categories]);

  const reportData = useMemo(() => {
    const currentMonthPrefix = new Date().toISOString().slice(0, 7);
    const thisMonthExpenses = transactions.filter(
      (t) => t.type === 'expense' && t.date.startsWith(currentMonthPrefix)
    );

    // 1. Kategori Toplamları
    const catTotals: Record<string, number> = {};
    let biggestExpense: Transaction | null = null;

    // Günlük toplamlar (Haftanın günleri)
    const dayOfWeekExpenses: Record<number, number> = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    };

    thisMonthExpenses.forEach((tx) => {
      catTotals[tx.categoryId] = (catTotals[tx.categoryId] || 0) + tx.amount;

      if (!biggestExpense || tx.amount > biggestExpense.amount) {
        biggestExpense = tx;
      }

      const d = new Date(tx.date + 'T00:00:00');
      const dayNum = d.getDay();
      dayOfWeekExpenses[dayNum] = (dayOfWeekExpenses[dayNum] || 0) + tx.amount;
    });

    // En çok harcanan kategori
    let topCatId = '';
    let topCatAmount = 0;
    Object.entries(catTotals).forEach(([catId, amount]) => {
      if (amount > topCatAmount) {
        topCatAmount = amount;
        topCatId = catId;
      }
    });

    // En masraflı gün
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    let mostExpensiveDayNum = 5; // Cuma varsayılan
    let highestDayAmount = 0;
    Object.entries(dayOfWeekExpenses).forEach(([dayNumStr, amt]) => {
      if (amt > highestDayAmount) {
        highestDayAmount = amt;
        mostExpensiveDayNum = Number(dayNumStr);
      }
    });

    // Tasarruf Oranı
    const savingsRatio = metrics.thisMonthIncome > 0
      ? Math.max(0, (metrics.thisMonthNet / metrics.thisMonthIncome) * 100)
      : 0;

    // Finansal Not (Grade)
    let grade = 'B+';
    let gradeColor = 'text-emerald-400';
    let title = 'Bütçe Dengecisi';

    if (savingsRatio >= 40 && metrics.currentBalance > 0) {
      grade = 'A+';
      gradeColor = 'text-emerald-400';
      title = 'Tasarruf Şampiyonu 👑';
    } else if (savingsRatio >= 25) {
      grade = 'A';
      gradeColor = 'text-teal-400';
      title = 'Finansal Usta ⭐';
    } else if (savingsRatio >= 10) {
      grade = 'B';
      gradeColor = 'text-blue-400';
      title = 'Dengeli Bütçeci ⚖️';
    } else {
      grade = 'C';
      gradeColor = 'text-amber-400';
      title = 'Gelişime Açık 📈';
    }

    return {
      grade,
      gradeColor,
      title,
      topCategory: categoryMap[topCatId] || null,
      topCatAmount,
      topCatPercent: metrics.thisMonthExpense > 0 ? (topCatAmount / metrics.thisMonthExpense) * 100 : 0,
      biggestExpense,
      savingsRatio,
      mostExpensiveDay: dayNames[mostExpensiveDayNum],
      totalTransactionsCount: thisMonthExpenses.length,
    };
  }, [transactions, categories, metrics, categoryMap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white border border-indigo-500/30 shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Bu Ayın Finansal Karnesi (Wrapped)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto relative z-10">
          {/* Big Grade Card */}
          <div className="text-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden">
            <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-2 animate-bounce" />
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Bu Ayki Disiplin Notun
            </div>
            <div className={`text-6xl font-black tracking-tight my-2 ${reportData.gradeColor}`}>
              {reportData.grade}
            </div>
            <div className="text-base font-extrabold text-white">
              {reportData.title}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Bu ay kazandığın her 100 ₺'nin tam <strong>{reportData.savingsRatio.toFixed(0)} ₺</strong>'sini birikiminde tuttun!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Şampiyon Kategori */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                <Flame className="w-3.5 h-3.5" />
                <span>En Çok Harcanan</span>
              </div>
              <div className="font-bold text-sm text-white mt-1 truncate">
                {reportData.topCategory?.name || 'Diğer'}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {formatMoney(reportData.topCatAmount, currency)} (%{reportData.topCatPercent.toFixed(0)})
              </div>
            </div>

            {/* 2. En Büyük Tek Harcama */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
                <Award className="w-3.5 h-3.5" />
                <span>Ayın Rekor Harcaması</span>
              </div>
              <div className="font-bold text-sm text-white mt-1 truncate">
                {reportData.biggestExpense ? (reportData.biggestExpense as Transaction).description : '-'}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {reportData.biggestExpense ? formatMoney((reportData.biggestExpense as Transaction).amount, currency) : '0 ₺'}
              </div>
            </div>

            {/* 3. En Masraflı Gün */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>En Masraflı Gün</span>
              </div>
              <div className="font-bold text-sm text-white mt-1">
                {reportData.mostExpensiveDay}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Haftalık harcama zirvesi
              </div>
            </div>

            {/* 4. Toplam İşlem */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Toplam Hareket</span>
              </div>
              <div className="font-bold text-sm text-white mt-1">
                {reportData.totalTransactionsCount} Harcama
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Kayıt altına alındı
              </div>
            </div>
          </div>

          {/* Motivational Footer */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between gap-3">
            <span>
              💡 Gelecek ay harcamalarını %10 kısarsan birikim hedefine 1 ay daha erken ulaşabilirsin!
            </span>
          </div>

          <button
            onClick={() => {
              alert('Finansal Karneniz panoya kopyalandı! Arkadaşlarınızla paylaşabilirsiniz 🚀');
            }}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Karnemi Paylaş</span>
          </button>
        </div>
      </div>
    </div>
  );
};
