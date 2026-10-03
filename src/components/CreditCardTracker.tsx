import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  Settings,
} from 'lucide-react';
import { Transaction, FinancialMetrics, CreditCardSettings } from '../types';
import { formatMoney } from '../utils/financeCalculators';

interface CreditCardTrackerProps {
  transactions: Transaction[];
  metrics: FinancialMetrics;
  currency: string;
  settings: CreditCardSettings;
  onUpdateSettings: (settings: CreditCardSettings) => void;
}

export const CreditCardTracker: React.FC<CreditCardTrackerProps> = ({
  transactions,
  metrics,
  currency,
  settings,
  onUpdateSettings,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formSettings, setFormSettings] = useState(settings);

  // Bu ay kartla yapılan harcamaların toplamı
  const currentMonthPrefix = new Date().toISOString().slice(0, 7);
  const cardSpentThisMonth = transactions
    .filter((tx) => tx.type === 'expense' && tx.paymentMethod === 'kart' && tx.date.startsWith(currentMonthPrefix))
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Nakit karşılama oranı
  const coverageRatio = cardSpentThisMonth > 0 ? (metrics.currentBalance / cardSpentThisMonth) * 100 : 999;

  // Gün hesapları
  const today = new Date();
  const currentDay = today.getDate();

  // Hesap kesim gününe kalan
  let daysToCutOff = settings.cutOffDay - currentDay;
  if (daysToCutOff < 0) daysToCutOff += 30;

  // Son ödemeye kalan
  let daysToDue = settings.dueDay - currentDay;
  if (daysToDue < 0) daysToDue += 30;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formSettings);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Kredi Kartı Ekstre & Nakit Kalkanı
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kart borcunuzun elinizdeki nakit ile karşılanma gücü
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>{isEditing ? 'Kapat' : 'Kart Ayarları'}</span>
        </button>
      </div>

      {/* Settings Panel if opened */}
      {isEditing && (
        <form onSubmit={handleSaveSettings} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Kart Bilgilerini Güncelle
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Kart Adı:</label>
              <input
                type="text"
                value={formSettings.cardName}
                onChange={(e) => setFormSettings({ ...formSettings, cardName: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Hesap Kesim Günü:</label>
              <input
                type="number"
                min={1}
                max={31}
                value={formSettings.cutOffDay}
                onChange={(e) => setFormSettings({ ...formSettings, cutOffDay: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Son Ödeme Günü:</label>
              <input
                type="number"
                min={1}
                max={31}
                value={formSettings.dueDay}
                onChange={(e) => setFormSettings({ ...formSettings, dueDay: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Kaydet
          </button>
        </form>
      )}

      {/* Main Grid: Card Debt vs Cash Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Kart Harcaması */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Bu Ay Karttan Harcanan
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {formatMoney(cardSpentThisMonth, currency)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Hesap kesimine: <strong>{daysToCutOff} gün</strong></span>
          </div>
        </div>

        {/* 2. Mevcut Bakiye */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Cepteki Net Nakit
          </span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatMoney(metrics.currentBalance, currency)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Son ödemeye: <strong>{daysToDue} gün</strong></span>
          </div>
        </div>

        {/* 3. Güvence Durumu */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Nakit Karşılama Oranı
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              %{Math.min(999, Math.round(coverageRatio))}
            </div>
          </div>
          <div className="mt-2">
            {coverageRatio >= 100 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                Nakit Güvende (%100 Ödenebilir)
              </span>
            ) : coverageRatio >= 70 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                Dikkat: Nakit Sınıra Yakın
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                Açık Var! Borç Nakdi Aşıyor
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Insight Banner */}
      <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
        coverageRatio >= 100
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200'
          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200'
      }`}>
        {coverageRatio >= 100 ? (
          <p>
            Harika bir finansal disiplin! Kart ekstreniz ({formatMoney(cardSpentThisMonth, currency)}) geldiğinde cebinizdeki nakitle borcun tamamını tek seferde kapatabilir ve faiz ödemeden ayı tamamlayabilirsiniz.
          </p>
        ) : (
          <p>
            Uyarı: Kredi kartı harcamanız elinizdeki nakdi aşıyor. Ekstre son ödeme gününe ({daysToDue} gün) kadar acil olmayan keyfi harcamaları kısmanız veya ek nakit girişi sağlamanız önerilir.
          </p>
        )}
      </div>
    </div>
  );
};
