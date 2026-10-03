import { FinancialMetrics } from '../types';
import { formatMoney } from './financeCalculators';

export type PurchaseType = 'luxury' | 'need' | 'investment';

export interface DecisionAnalysisResult {
  score: number; // 0 - 100
  status: 'safe' | 'warning' | 'danger';
  headline: string;
  summary: string;
  percentOfBalance: number;
  balanceAfter: number;
  currentRunwayDays: number;
  runwayDaysAfter: number;
  lostRunwayDays: number;
  dailyBudgetReduction: number;
  workHoursEquivalent: number;
  pros: string[];
  cons: string[];
  actionAdvice: string[];
}

export function analyzePurchaseDecision(
  itemName: string,
  amount: number,
  purchaseType: PurchaseType,
  metrics: FinancialMetrics,
  currency: string = '₺'
): DecisionAnalysisResult {
  const currentBalance = metrics.currentBalance;
  const balanceAfter = currentBalance - amount;
  const burnRate = metrics.dailyAverageExpense > 0 ? metrics.dailyAverageExpense : 400;

  // Bakiyeye oran
  const percentOfBalance = currentBalance > 0 ? (amount / currentBalance) * 100 : 100;

  // Runway hesapları
  const currentRunwayDays = metrics.runwayDays;
  const runwayDaysAfter = balanceAfter > 0 ? balanceAfter / burnRate : 0;
  const lostRunwayDays = Math.max(0, currentRunwayDays - runwayDaysAfter);

  // Ay sonu gün hesabı
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - today.getDate());

  const currentSafeDaily = currentBalance > 0 ? currentBalance / remainingDays : 0;
  const safeDailyAfter = balanceAfter > 0 ? balanceAfter / remainingDays : 0;
  const dailyBudgetReduction = Math.max(0, currentSafeDaily - safeDailyAfter);

  // Çalışma saati karşılığı (Aylık gelir / 160 saat)
  const estimatedMonthlyIncome = metrics.thisMonthIncome > 0 ? metrics.thisMonthIncome : 40000;
  const hourlyRate = estimatedMonthlyIncome / 160;
  const workHoursEquivalent = amount / hourlyRate;

  // Puanlama Algoritması (0 - 100)
  let score = 100;

  // 1. Kalan bakiye eksiye düşerse doğrudan 0
  if (balanceAfter <= 0) {
    score = 10;
  } else {
    // Bakiyenin % kaçını yiyor?
    if (percentOfBalance > 50) {
      score -= 50;
    } else if (percentOfBalance > 30) {
      score -= 35;
    } else if (percentOfBalance > 15) {
      score -= 20;
    } else if (percentOfBalance > 5) {
      score -= 10;
    }

    // Runway kaybı ne kadar?
    if (lostRunwayDays > 15) {
      score -= 25;
    } else if (lostRunwayDays > 7) {
      score -= 15;
    } else if (lostRunwayDays > 3) {
      score -= 8;
    }

    // Kalan runway 15 günden az mı?
    if (runwayDaysAfter < 15) {
      score -= 20;
    }

    // Harcama tipi bonusu / cezası
    if (purchaseType === 'need') {
      score += 15; // Zorunlu ihtiyaçsa tolerans yüksek
    } else if (purchaseType === 'investment') {
      score += 10; // Eğitim/gelişimse tolerans yüksek
    } else if (purchaseType === 'luxury') {
      score -= 10; // Keyfi harcama ise daha temkinli
    }
  }

  // Puan sınırları 0 - 100
  score = Math.max(5, Math.min(98, Math.round(score)));

  // Durum belirleme
  let status: 'safe' | 'warning' | 'danger' = 'safe';
  let headline = '';
  let summary = '';

  const pros: string[] = [];
  const cons: string[] = [];
  const actionAdvice: string[] = [];

  if (score >= 70 && balanceAfter > 0) {
    status = 'safe';
    headline = 'Gönül Rahatlığıyla Alabilirsin! 🎉';
    summary = `Bütçen bu harcamayı rahatlıkla kaldırıyor. ${itemName} satın aldıktan sonra cebinde ${formatMoney(balanceAfter, currency)} nakit kalmaya devam edecek.`;

    pros.push(`Mevcut nakdinin sadece %${percentOfBalance.toFixed(1)}'ine denk geliyor.`);
    pros.push(`Paranın dayanma süresi güvende (satın alımdan sonra bile ~${Math.floor(runwayDaysAfter)} gün yetiyor).`);
    pros.push(`Ay sonu nakit akışını riske atmıyor.`);

    actionAdvice.push('Keyfini çıkar! Bütçende buna fazlasıyla yer var.');
    actionAdvice.push('Harcamayı hemen bütçene işleyerek günlük takibini güncel tutabilirsin.');
  } else if (score >= 40 && balanceAfter > 0) {
    status = 'warning';
    headline = 'Alabilirsin Ama Bütçeni Biraz Sıkmalısın! ⚠️';
    summary = `${itemName} almak seni doğrudan eksiye düşürmez ancak paranı tam ${Math.floor(lostRunwayDays)} gün daha erken tüketir. Önümüzdeki günlerde dikkatli harcamalısın.`;

    pros.push(`Cebindeki parayla bu tutarı ödeyebiliyorsun (${formatMoney(balanceAfter, currency)} kalacak).`);
    cons.push(`Bu harcama mevcut nakdinin %${percentOfBalance.toFixed(1)}'ini götürüyor.`);
    cons.push(`Ay sonunu kurtarmak için günde ${formatMoney(dailyBudgetReduction, currency)} daha az harcaman gerekecek.`);
    cons.push(`Yaklaşık ${workHoursEquivalent.toFixed(1)} saatlik emeğine karşılık geliyor.`);

    actionAdvice.push('Bu harcamayı yapacaksan bu hafta dışarıda yeme-içme veya keyfi harcamaları biraz kıs.');
    actionAdvice.push('İmkan varsa kredi kartına vade farksız taksit imkanını değerlendirebilirsin.');
    actionAdvice.push('Acil ihtiyaç değilse indirim dönemini (veya maaş sonrasını) beklemek daha stressiz olabilir.');
  } else {
    status = 'danger';
    headline = 'Şu An Hiç Mantıklı Değil, Ertelemelisin! 🛑';
    summary = `Bu harcama şu anki finansal durumunu ciddi riske atıyor! Satın aldıktan sonra bakiyen kritik seviyeye (${formatMoney(Math.max(0, balanceAfter), currency)}) inecek ve ay sonuna yetişemeyebilirsin.`;

    cons.push(`Bu harcama cebindeki paranın %${Math.min(100, percentOfBalance).toFixed(0)}'ını eritiyor!`);
    cons.push(`Paranın dayanma süresi ${Math.floor(runwayDaysAfter)} güne düşüyor (Tam ${Math.floor(lostRunwayDays)} gün kayıp).`);
    cons.push(`Önümüzdeki günlerde zorunlu ihtiyaçlar için nakit sıkıntısı çekebilirsin.`);

    actionAdvice.push('Bu harcamayı kesinlikle bir sonraki maaş dönemine ertele.');
    actionAdvice.push('Acil bir ihtiyaç değilse satın alma dürtüsünü 3 gün beklet (72 saat kuralı).');
    actionAdvice.push('Önce birikim hedefini tamamlayıp bütçeni güvenli bölgeye çıkar.');
  }

  return {
    score,
    status,
    headline,
    summary,
    percentOfBalance,
    balanceAfter,
    currentRunwayDays,
    runwayDaysAfter,
    lostRunwayDays,
    dailyBudgetReduction,
    workHoursEquivalent,
    pros,
    cons,
    actionAdvice,
  };
}
