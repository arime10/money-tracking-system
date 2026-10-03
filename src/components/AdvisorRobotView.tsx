import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Zap,
  TrendingDown,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Plus,
  Coins,
  Gamepad2,
  ShoppingCart,
  GraduationCap,
} from 'lucide-react';
import { FinancialMetrics, Category } from '../types';
import { analyzePurchaseDecision, PurchaseType, DecisionAnalysisResult } from '../utils/decisionEngine';
import { formatMoney } from '../utils/financeCalculators';

interface AdvisorRobotViewProps {
  metrics: FinancialMetrics;
  categories: Category[];
  currency: string;
  onAddTransaction: (tx: {
    type: 'expense';
    amount: number;
    categoryId: string;
    date: string;
    description: string;
    paymentMethod: 'kart';
  }) => void;
}

export const AdvisorRobotView: React.FC<AdvisorRobotViewProps> = ({
  metrics,
  categories,
  currency,
  onAddTransaction,
}) => {
  // Kullanıcının belirttiği örnek: 3000 TL oyun
  const [itemName, setItemName] = useState('Yeni Oyun (Steam/PS5)');
  const [amount, setAmount] = useState('3000');
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('luxury');
  const [analysisResult, setAnalysisResult] = useState<DecisionAnalysisResult | null>(() => {
    // İlk açılışta kullanıcının sorduğu 3000 TL örneği ile analiz yapalım!
    return analyzePurchaseDecision(
      'Yeni Oyun (Steam/PS5)',
      3000,
      'luxury',
      metrics,
      currency
    );
  });

  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      alert('Lütfen geçerli bir tutar girin.');
      return;
    }
    if (!itemName.trim()) {
      alert('Lütfen harcamanın adını girin.');
      return;
    }

    const result = analyzePurchaseDecision(
      itemName.trim(),
      parsedAmount,
      purchaseType,
      metrics,
      currency
    );
    setAnalysisResult(result);
  };

  const handleQuickAddAsExpense = () => {
    if (!analysisResult) return;
    const parsedAmount = parseFloat(amount);
    const todayStr = new Date().toISOString().split('T')[0];

    // Uygun kategori bul
    let targetCat = categories.find((c) => c.id === 'cat-eglence');
    if (purchaseType === 'need') {
      targetCat = categories.find((c) => c.id === 'cat-market') || categories[0];
    } else if (purchaseType === 'investment') {
      targetCat = categories.find((c) => c.id === 'cat-egitim') || categories[0];
    }
    const catId = targetCat ? targetCat.id : (categories[0]?.id || 'cat-diger-gider');

    onAddTransaction({
      type: 'expense',
      amount: parsedAmount,
      categoryId: catId,
      date: todayStr,
      description: itemName.trim(),
      paymentMethod: 'kart',
    });

    alert(`"${itemName.trim()}" (${formatMoney(parsedAmount, currency)}) başarıyla harcamalarınıza eklendi!`);
  };

  const getStatusBadge = (status: 'safe' | 'warning' | 'danger') => {
    switch (status) {
      case 'safe':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
          icon: ShieldCheck,
          label: 'GÖNÜL RAHATLIĞIYLA ALABİLİRSİN',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
          icon: AlertTriangle,
          label: 'ALABİLİRSİN AMA TEMKİNLİ OL',
        };
      case 'danger':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300',
          icon: ShieldAlert,
          label: 'ŞU AN HİÇ MANTIKLI DEĞİL! ERTELE',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Robot Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-teal-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/30 flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Bot className="w-9 h-9 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Yapay Zeka Destekli Harcama Danışmanı
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                "Bu Harcama Mantıklı mı?" Karar Robotu
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Almak istediğiniz bir şeyi (oyun, kulaklık, tatil, kıyafet vb.) yazın. Robotumuz mevcut bütçenizi, paranızın kaç gün yeteceğini ve ay sonu hedefinizi tarayarak objektif karar versin.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-4 flex-shrink-0">
            <div>
              <span className="text-[11px] text-slate-300 block uppercase tracking-wider font-semibold">
                Mevcut Nakit Bakiye
              </span>
              <span className="text-xl font-black text-emerald-400">
                {formatMoney(metrics.currentBalance, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Form & Instant Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sol Kolon: Girdi Formu */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Neyi Almayı Düşünüyorsun?
          </h3>

          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* Ürün Adı */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Alınacak Şey
              </label>
              <input
                type="text"
                required
                placeholder="Örn: 3000 TL'ye Oyun, Spor Ayakkabı..."
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Tutar */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Fiyat / Tutar (₺)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  placeholder="3000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-3.5 pr-12 py-2.5 text-lg font-bold bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  ₺
                </span>
              </div>

              {/* Hızlı Tutar Butonları */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[500, 1000, 2000, 3000, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      amount === preset.toString()
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    {preset.toLocaleString('tr-TR')} ₺
                  </button>
                ))}
              </div>
            </div>

            {/* Harcama Niteliği (Lüks vs İhtiyaç) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Bu Nasıl Bir Harcama?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPurchaseType('luxury')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                    purchaseType === 'luxury'
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span className="text-[11px]">Keyfi / Oyun</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPurchaseType('need')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                    purchaseType === 'need'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-[11px]">Zorunlu İhtiyaç</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPurchaseType('investment')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                    purchaseType === 'investment'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-[11px]">Eğitim / Araç</span>
                </button>
              </div>
            </div>

            {/* Analiz Et Butonu */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-5 h-5" />
              <span>Mantıklı mı? Analiz Et</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Sağ Kolon: Robotun Analizi ve Kararı */}
        <div className="lg:col-span-7 space-y-4">
          {analysisResult && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
              {/* Karar Başlığı ve Skor */}
              {(() => {
                const badge = getStatusBadge(analysisResult.status);
                const BadgeIcon = badge.icon;
                return (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${badge.bg}`}>
                        <BadgeIcon className="w-4 h-4" />
                        <span>{badge.label}</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                        {analysisResult.headline}
                      </h3>
                    </div>

                    {/* Skor Göstergesi */}
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex-shrink-0">
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Fizibilite Skoru
                        </span>
                        <div className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline justify-center">
                          <span>{analysisResult.score}</span>
                          <span className="text-xs text-slate-400 font-normal">/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Robotun Açıklama Balonu */}
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-start gap-3.5">
                <Bot className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {analysisResult.summary}
                </p>
              </div>

              {/* 4 Çarpıcı Metrik Kartı */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Kalan Bakiye */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Satın Alım Sonrası Bakiye
                  </span>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {formatMoney(analysisResult.balanceAfter, currency)}
                  </div>
                  <span className="text-[11px] text-rose-500 font-medium">
                    (Nakitinin %{analysisResult.percentOfBalance.toFixed(0)}'i)
                  </span>
                </div>

                {/* 2. Runway Kaybı */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Dayanma Süresi (Runway)
                  </span>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {Math.floor(analysisResult.runwayDaysAfter)} Gün
                  </div>
                  <span className="text-[11px] text-rose-500 font-medium flex items-center">
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                    -{Math.floor(analysisResult.lostRunwayDays)} gün kayıp
                  </span>
                </div>

                {/* 3. Günlük Harcama Limiti */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Günlük Limit Azalması
                  </span>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    -{formatMoney(analysisResult.dailyBudgetReduction, currency)}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    günde kısman gereken
                  </span>
                </div>

                {/* 4. Çalışma Saati Karşılığı */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Emek Karşılığı
                  </span>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-purple-500" />
                    {analysisResult.workHoursEquivalent.toFixed(1)} Saat
                  </div>
                  <span className="text-[11px] text-slate-400">
                    mesaiye denk geliyor
                  </span>
                </div>
              </div>

              {/* Artılar, Eksiler & Tavsiyeler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Artılar ve Eksiler */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Finansal Etki Analizi
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {analysisResult.pros.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                        <span className="font-bold">✓</span>
                        <span>{p}</span>
                      </div>
                    ))}
                    {analysisResult.cons.map((c, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-rose-500 dark:text-rose-400">
                        <span className="font-bold">✕</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Robotun Taktik Tavsiyeleri */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Robotun Stratejik Önerileri
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {analysisResult.actionAdvice.map((adv, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Coins className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Aksiyon: Satın Almaya Karar Verdim -> Harcamalara Ekle */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Satın almaya karar verdin mi? Tek tıkla bütçene kaydedebilirsin:
                </div>
                <button
                  type="button"
                  onClick={handleQuickAddAsExpense}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Karar Verdim, Harcamalara Ekle!</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
